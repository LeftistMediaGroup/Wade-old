// Allow require
import axios from "axios";
import { url } from "inspector";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

import strftime from "strftime";


var PouchDB = require("pouchdb");
require('pouchdb-all-dbs')(PouchDB);
PouchDB.plugin(require('pouchdb-upsert'));

const bbb = require('bigbluebutton-js')


export default class StartMessages {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;

        this.InitMessages();
        this.Sockets();
    }

    Sockets = () => {
        this.socket.on("joinConversation", (conversationName) => {
            this.socket.join(conversationName);
        })

        this.socket.on("sendMessage", (message) => {
            let ReciverMessage = {
                message: message.message,
                sentTime: strftime("%y%m%d_%X"),
                sender: this.socket.request.session.username,
                avatarLink: "",
                type: "text",
                direction: "incoming",
                imageContent: "",
                recievers: message.recievers,
                conversationName: message.conversationName
            }

            let SenderMessage = {
                message: message.message,
                sentTime: strftime("%y%m%d_%X"),
                sender: this.socket.request.session.username,
                avatarLink: "",
                type: "text",
                direction: "outgoing",
                imageContent: "",
                recievers: message.recievers,
                conversationName: message.conversationName
            }

            new Promise((resolve, reject) => {
                this.PutMessage(this.socket.request.session.username, SenderMessage, message.conversationName)
                resolve();
            }).then(() => {
                setTimeout(() => {
                    for (let reciever of message.recievers) {
                        try {
                            this.PutMessage(reciever, ReciverMessage, message.conversationName)
                        } catch (err) {
                            console.log(`Err: ${JSON.stringify(err, null, 2)}`)
                        }
                    }
                }, 2000)
            })
        });

        this.socket.on("NewConversation", ((user, contact) => {
            var users_db = new PouchDB(`https://${process.env.host}/database/users`);

            users_db.get(user).then((result) => {
                let found = false;

                new Promise((resolve, reject) => {
                    result.messages.conversations.forEach((conversation) => {
                        let participants = conversation.split("__");

                        if (participants.length === 2) {
                            if (participants[0] === contact || participants[1] === contact) {
                                found = true;
                            } else {
                                found = false;
                                resolve();
                            }
                        }
                    })
                }).then(() => {
                    if (found === false) {
                        let participantsSorted = [user, contact].sort();

                        let NewConversationName = `${participantsSorted[0]}__${participantsSorted[1]}`;

                        var conversations_db = new PouchDB(`https://${process.env.host}/database/conversations`);

                        conversations_db.get(user).then((conversationsReturned) => {

                            conversationsReturned.conversations.push({
                                conversationName: NewConversationName,
                                messages: []
                            })
                            this.io.to(user).emit("historical_messages", conversationsReturned["conversations"]);
                        });
                    }
                })

            })
        }))

        this.socket.on("StartVideoChat", (data) => {
            this.StartVideoChat(data);
        })
    }

    StartVideoChat = (data) => {
        console.log(`StartVideoChat Data: ${JSON.stringify(data, null, 2)}`)

        axios.post(`${process.env.Chat_URL}/api/v1/meeting`,
            {
                "room": data.conversationName,
                "roomPassword": "false",
                "audio": "false",
                "video": "false",
                "screen": "false",
                "notify": "false"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'DootDoot'
                }
            }).then((result) => {
                console.log(`URL Data Join: ${JSON.stringify(result.data.meeting, null, 2)}`);

                this.io.to(this.socket.request.session.username).emit("StartVideoChatURL", result.data.meeting);
            })
            .catch((err) => {
                console.log(`Err: ${JSON.stringify(err, null, 2)}`);
            })
    }

    InitMessages = () => {
        this.socket.on("get_historical_messages", () => {
            this.GetMessages(this.socket.request.session.username, `${this.socket.request.session.username}__${this.socket.request.session.username}`);
        })
    }

    PutMessage = (user, message, conversationName) => {
        var users_db = new PouchDB(`https://${process.env.host}/database/users`);
        var conversations_db = new PouchDB(`https://${process.env.host}/database/conversations`);


        users_db.get(user).then((result) => {
            if (result.messages.conversations === undefined || result.messages.conversations.length == 0) {
                new Promise((resolve, reject) => {
                    result.messages = {};
                    result.messages.conversations = [];
                    result.messages.conversations.push(conversationName)
                    users_db.put(result);

                    resolve(result);
                }).then(() => {
                    conversations_db.info();

                    conversations_db.put({
                        _id: user,
                        conversations: [{
                            conversationName: conversationName,
                            messages: [message]

                        }]
                    })

                    this.io.to(conversationName).emit("refreshMessages");
                })

            } else {
                conversations_db.get(user).then((conversationResult) => {
                    console.log(`Conversations: ${JSON.stringify(conversationResult.conversations, null, 2)}`)

                    let found = conversationResult.conversations;

                    console.log(`Found ${typeof found} conversations`)
                    conversationResult.conversations.forEach(conversation => {
                        if (conversation.conversationName === conversationName) {
                            console.log(`Found conversation: ${JSON.stringify(conversationName, null, 2)}`);
                            conversation.messages.push(message);

                            conversations_db.put(conversationResult);

                            this.io.to(conversationName).emit("refreshMessages");
                        } else {
                            console.log(`NotconversationName found: ${JSON.stringify(conversationName)}`)

                            conversationResult.conversations.push({
                                conversationName: conversationName,
                                messages: [message]
                            })

                            conversations_db.put(conversationResult);

                            this.io.to(conversationName).emit("refreshMessages");
                        }
                    });
                });
            }
        });
    }

    GetMessages = (user, conversationName) => {
        var users_db = new PouchDB(`https://${process.env.host}/database/users`);

        users_db.get(user).then((result) => {
            if (JSON.stringify(result.messages) === "{}") {
                let RecipientMessage = {
                    message: "This is your first message with yourself!",
                    sentTime: strftime("%y%m%d_%X"),
                    sender: user,
                    avatarLink: "",
                    type: "text",
                    direction: "incoming",
                    imageContent: "",
                    reciever: user,
                    conversationName: conversationName
                }

                this.PutMessage(user, RecipientMessage, conversationName);

                this.io.to(conversationName).emit("refreshMessages");

            } else {
                var conversations_db = new PouchDB(`https://${process.env.host}/database/conversations`);

                conversations_db.get(user).then((conversations) => {
                    this.io.to(user).emit("historical_messages", conversations["conversations"]);
                });
            }
        }).catch((err) => {
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        })
    };
};