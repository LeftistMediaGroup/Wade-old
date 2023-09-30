// Allow require
import { createRequire } from "module";

import * as dotenv from "dotenv";

//End require
const require = createRequire(import.meta.url);

const nodemailer = require("nodemailer");

export default class Send_Mail {
  constructor(data) {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: `${process.env.gmail_user}`,
        pass: `${process.env.gmail_pass}`,
      },
    });

    this.data = data;

    this.transporter
      .verify()
      .then(console.log)
      .then(() => {
        this.transporter
          .sendMail({
            from: '"Leftist Media Group - Wade" <LeftistMediaGroup@gmail.com>', // sender address
            to: `${process.env.mail_admin1}, ${process.env.mail_admin2}, ${this.data.email}`, // list of receivers
            subject: "New User Account!", // Subject line
            html: this.Message(),
          })
          .then((info) => {
            console.log({ info });
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  Message = () => {
    return `
            <img
            src=${this.data.avatar}/>
            <p>
                Welcome ${this.data.username}!
            </p>
            <br/>

            <p> Make sure to use this username when logging in: ${this.data.username}</p>

            <p>Wait, that's not your name! It's your Alias!</p>
            <br/>

            <p>
                You've just completed the first step to working with LMG, and that's registering on our website, and with that comes a brand new name to keep the bad-actors from finding out who you are!
            </p>
            <br/>

            <p>
                Evreything we do is anonymous to the best of our abilities! 
            </p>
            < br/>

            <p> Our admins have been notified of your new user creation, they will be reaching out via email soon.</p>
            <p> If you'd like to talk directly to an admin, please respond to this email. </p>
            <br/>
            <b>This email IS monitored</b>

            <b>Join our Discord for LMG (Community Support Network)</b>
            <br/>
            <b>https://discord.gg/SSZhgF5kWB</b>

            <p>This email was sent by Leftist Media Group's automated system, Wade.</p>
            `;
  };
}
