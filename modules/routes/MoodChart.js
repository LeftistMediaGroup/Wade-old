// Allow require
import { createRequire } from "module";
import * as dotenv from "dotenv";
import { v4 } from "uuid";

//End require
const require = createRequire(import.meta.url);
var PouchDB = require("pouchdb");

var express = require("express");
var router = express.Router();

var strftime = require("strftime");

dotenv.config();

router.post("/in", (req, res) => {
  var users_db = new PouchDB(`https://${process.env.host}/database/users`);

  let username = req.session.username;

  let data = req.body.data;

  users_db
    .info()
    .then(() => {
      users_db
        .get(`${req.session.username}`)
        .then((result) => {
          console.log(`Result IN: ${JSON.stringify(result, null, 2)}`);

          data.time = new Date();

          if (!result.MoodChart) {
            result.MoodChart = {};
          }

          let MoodDay = strftime("%y%m%d");
          let MoodHour = strftime("%H");
          let MoodName = `${data.time}_${v4()}`

          Object.values(result.MoodChart).forEach((day) => {
            if (day === MoodDay) {
              console.log(`Day: ${JSON.stringify(day)}`);

              Object.values(day).forEach((hour) => {
                if (MoodHour in day) {
                  if (hour === MoodHour) {
                    hour[MoodName] = data
                  }
                } else {
                  day[MoodHour] = {
                    [MoodName]: data
                  }
                }
              })
            }

          })

          console.log(`NEW Result: ${JSON.stringify(result, null, 2)}`);

          users_db.put(result).then((final) => {
            console.log(`Final: ${JSON.stringify(final, null, 2)}`);
          });

          res.end();
        })
        .catch(function (err) {
          if (err.error === "not_found") {
            data.time = new Date();

            let newUserData = {
              _id: username,
              MoodChart: {
                [strftime("%y%m%d")]: {
                  [strftime("%H")]: {
                    [strftime("%y%m%d_%H:%M") + "_" + v4()]: data,
                  },
                },
              },
            };

            console.log(`NewUserData: ${JSON.stringify(newUserData, null, 2)}`);

            users_db.put(newUserData).catch((err) => {
              console.log(`Error ${JSON.stringify(err, null, 2)}`);
            });
          }
          res.end();
        });
    })
    .catch(function (err) {
      res.json(`Error: ${JSON.stringify(err, null, 2)} `);
      res.end();
    });
});

router.put("/out", (req, res) => {
  var users_db = new PouchDB(`https://${process.env.host}/database/users`);

  let finalData = {
    Anxiety: [],
    Depression: [],
    Mood: [],
    Energy: [],
  };

  users_db.get(`${req.session.username}`).then((result) => {
    //console.log(JSON.stringify(`Result: ${JSON.stringify(result)}`));

    //console.log(`Final Data in: ${JSON.stringify(finalData, null, 2)}`);

    if (result.MoodChart) {
      Object.values(result.MoodChart).forEach((day, dayNameVal) => {
        console.log(`Day: ${JSON.stringify(day, null, 2)}`);

        let dayName = Object.keys(result.MoodChart)[dayNameVal];

        //console.log(`DayName: ${dayName}`);

        if (dayName === strftime("%y%m%d")) {
          Object.values(day).forEach((hour) => {
            //console.log(`Hour: ${JSON.stringify(hour)}`);

            finalData.Anxiety.push({
              x: hour.time,
              y: hour.Anxiety,
            });

            finalData.Depression.push({
              x: hour.time,
              y: hour.Depression,
            });

            finalData.Energy.push({
              x: hour.time,
              y: hour.Energy,
            });

            finalData.Mood.push({
              x: hour.time,
              y: hour.Mood,
            });
          });
        }
      });
      console.log(`Final Data Out: ${JSON.stringify(finalData, null, 2)}`);
      res.json(finalData);
      res.end();
    } else {
      res.json("No Data");
      res.end();
    }
  });
});

export default router;