// Allow require
import { createRequire } from "module";

import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

//End require
const require = createRequire(import.meta.url);
var PouchDB = require("pouchdb");

var express = require('express');
var router = express.Router();

var strftime = require('strftime') 

dotenv.config();
  

router.post('/insert_event', (req, res) => {
  try {
    let event = req.body.eventData
    let eventName = req.body.eventTitle

    let now = strftime('%y%m%d_%X');

    let dateStartIn = event.dateStart;
    let dateArray = dateStartIn.split("T");
    let dateStart = dateArray[0];
    let dateStartArray = dateStart.split("-");
    let year = dateStartArray[0];
    let month = dateStartArray[1];
    let day = dateStartArray[2];

    let timeArrayZ = dateArray[1];
    let timeArrayC = timeArrayZ.split(".")[0];
    let timeArray = timeArrayC.split(":");
    let hour = timeArray[0];
    let min = timeArray[1];

    event["Time_in"] = now;
    event["Event_time"] = `${year}${month}${day}_${hour}:${min}`;

    event["uuid"] = uuidv4();
    

    console.log(`Event: ${JSON.stringify(event, null, 2)}`)
      
    var main_db = new PouchDB(`https://${process.env.REACT_APP_host}:${process.env.REACT_APP_port}/database/manifest`);
    
    main_db.info().then(function (info) {
      console.log(`Info: ${JSON.stringify(info)}`);

      main_db.get("Calendar").then(function (result) {
        console.log(`Calendar: ${JSON.stringify(result, null, 2)}`);
      
          console.log(`Adding data: ${JSON.stringify(event, null, 2)}`);

          result.events[eventName] = event;

          main_db.put(result).then(function (result2) {
            console.log(`Result: ${JSON.stringify(result2, null, 2)}`);

            res.send("Success");
            res.end();
          }).catch(function (err) {
            console.log(`Error: ${err}`);
          });
      }).catch(function (err) {
        console.log(`Error: ${err}`);
      });
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  };
});

router.post('/update_event', (req, res) => {
    try {
      let event = req.body.eventData
      let eventName = req.body.eventLabel
  
      console.log(`Event: ${JSON.stringify(event, null, 2)}`)
        
      var main_db = new PouchDB(`https://${process.env.REACT_APP_host}:${process.env.REACT_APP_port}/database/manifest`);
      
      main_db.info().then(function (info) {
        console.log(`Info: ${JSON.stringify(info)}`);
  
        main_db.get("Calendar").then(function (result) {
          console.log(`Calendar: ${JSON.stringify(result, null, 2)}`);
        
            console.log(`Adding data: ${JSON.stringify(event, null, 2)}`);
  
            result.events[eventName] = event;
  
            main_db.put(result).then(function (result2) {
              console.log(`Result: ${JSON.stringify(result2, null, 2)}`);
  
              res.send("Success");
              res.end();
            }).catch(function (err) {
              console.log(`Error: ${err}`);
            });
        }).catch(function (err) {
          console.log(`Error: ${err}`);
        });
      });
    } catch (err) {
      console.log(`Error: ${err}`);
    };
});

router.post('/delete_event', (req, res) => {
  try {
    let event = req.body.eventData
    let eventName = req.body.eventLabel

    console.log(`Event: ${JSON.stringify(event, null, 2)}`);


  } catch (err) {
    console.log(`Error: ${err}`);
  }
});


router.post('/insert_event', (req, res) => {
  try {
    let event = req.body.eventData
    let eventName = req.body.eventTitle

    console.log(`Event: ${JSON.stringify(event, null, 2)}`);

  } catch (err) {
    console.log(`Error: ${err}`);
  };
});

router.get('/get_events', (req, res) => {
  var main_db = new PouchDB(`https://${process.env.REACT_APP_host}:${process.env.REACT_APP_port}/database/manifest`);
      
  main_db.info().then(function () {
    main_db.get("Calendar").then(function (result) {
      res.json(result);
      res.end();
    });
  });
});

export default router;