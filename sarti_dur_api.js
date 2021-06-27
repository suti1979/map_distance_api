require("dotenv").config({ path: "./env/KEY.env" })
const mongoose = require("mongoose")
const fetch = require("node-fetch")

// setup ENV
const google_API = process.env.API
const db_name = process.env.DB_NAME
const db_psw = process.env.DB_PSW

const origin = "Budapest"
const destination = "Sarti"
const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=driving&language=en&departure_time=now&traffic_model=pessimistic&key=${google_API}`

//database
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)

const uri = `mongodb+srv://${db_name}:${db_psw}@cluster0.vpjd4.mongodb.net/sarti?retryWrites=true&w=majority`
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const distanceSchema = {
  time: Number,
  date: { type: Date, default: Date.now },
}

const Distance = mongoose.model("sarti_pess", distanceSchema)

const timerID = setInterval(() => {
  getData()
}, 30 * 60 * 1000)

//clearInterval(timerID) // The setInterval it cleared and doesn't run anymore.

async function getData() {
  try {
    const response = await fetch(URL)
    if (response.ok) {
      try {
        const data = await response.json()
        let durationTime = data.rows[0].elements[0].duration_in_traffic.value //.value
        console.log(durationTime)
        const duration = new Distance({ time: durationTime })
        duration
          .save()
          .then(() => console.log(durationTime))
          .catch((err) => {
            console.log(err)
          })
      } catch (err) {
        console.log(err)
      }
    } else {
      console.error("Response error")
    }
  } catch (err) {
    // if there's no internet or something
    console.error(err)
  }
}

getData()
