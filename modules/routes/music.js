import express from 'express';
import  * as evs from 'express-video-stream'; // Express Video Stream


var router = express.Router();

router.get('/music', (req, res) => { 
    var app = express();   

    evs.addVideo("1", "./Revolution/Fuck_these_fuckin_fascists.mp4");
    evs.addVideo("2", "./Revolution/Failed_State.mp3");

    app.use(evs.middleware); //Use streaming middleware
});

export default router;
