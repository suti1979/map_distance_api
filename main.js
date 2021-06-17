// const test = {
//   origins: [{ lat: 55.93, lng: -3.118 }, "Greenwich, England"],
//   destinations: ["Stockholm, Sweden", { lat: 50.087, lng: 14.421 }],
//   travelMode: "DRIVING",
//   drivingOptions: {
//     departureTime: new Date(Date.now()),
//     trafficModel: "optimistic",
//   },
// }

// const origin = "Budapest"
//   const destination = "Sarti"
//   const request = {
//     origins: [origin],
//     destinations: [destination],
//     travelMode: google.maps.TravelMode.DRIVING,
//     unitSystem: google.maps.UnitSystem.METRIC,
//     avoidHighways: false,
//     avoidTolls: false,
//     drivingOptions: {
//       departureTime: new Date(Date.now()),
//       trafficModel: "pessimistic",
//     },
//   }

require("dotenv").config({ path: "./env/KEY.env" })
const mongoose = require("mongoose")
const fetch = require("node-fetch")

// setup ENV
const google_API = process.env.API
const db_name = process.env.DB_NAME
const db_psw = process.env.DB_PSW

const origin = "Budapest"
const destination = "Sarti"
const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&drivingOptions.trafficModel=pessimistic&key=${google_API}`

//database

const uri = `mongodb+srv://${db_name}:${db_psw}@cluster0.vpjd4.mongodb.net/sarti?retryWrites=true&w=majority`
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const distanceSchema = {
  time: Number,
  date: { type: Date, default: Date.now },
}

const Distance = mongoose.model("sarti", distanceSchema)

// const timerID = setInterval(() => {
//   getData()
// }, 10 * 1000)

//clearInterval(timerID) // The setInterval it cleared and doesn't run anymore.

async function getData() {
  try {
    const response = await fetch(URL)
    if (response.ok) {
      const data = await response.json()
      let durationTime = data.rows[0].elements[0] //.value
      //console.log(durationTime)
      const duration = new Distance({ time: durationTime })
      console.log(durationTime)
      //duration.save().then(() => console.log(durationTime))
    } else {
      console.error("Something went wrong")
    }
  } catch (err) {
    // if there's no internet or something
    console.error(err)
  }
}

getData()
