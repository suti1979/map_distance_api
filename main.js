require("dotenv").config({ path: "./env/KEY.env" })
const mongoose = require("mongoose")
const fetch = require("node-fetch")

// setup ENV
const google_API = process.env.API
const db_name = process.env.DB_NAME
const db_psw = process.env.DB_PSW

const origin = "Budapest"
const destination = "Sarti"
const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${google_API}`

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
//   let dummyData = 13725 + Math.floor(Math.random() * 1000)
//   const duration = new Distance({ time: dummyData })
//   duration.save().then(() => console.log("meow"))
// }, 5 * 1000)

//clearInterval(timerID) // The setInterval it cleared and doesn't run anymore.

async function saveData() {
  try {
    const response = await fetch(URL)
    if (response.ok) {
      const data = await response.json()
      console.log(data) //console.log(data.map((user) => user.name)) //data.rows.elements.duration.value
    } else {
      console.error("Something went wrong")
    }
  } catch (err) {
    // if there's no internet or something
    console.error(err)
  }
}

saveData()
