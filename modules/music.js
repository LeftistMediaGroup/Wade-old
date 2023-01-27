import express from 'express';
import path from 'path';
import * as fs from 'fs';
import { dirname } from 'path';

import  * as evs from 'express-video-stream'; // Express Video Stream
 

var app = express();
 
evs.addVideo("1", "./Revolution/Fuck_these_fuckin_fascists.mp4");
evs.addVideo("2", "./Revolution/Failed_State.mp3");

app.use(evs.middleware); //Use streaming middleware
  
app.listen(4002, () => {
    console.log("Music is up and running on 4002!");
});