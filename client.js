const { Client } = require("@googlemaps/google-maps-services-js")
require("dotenv").config({ path: "./env/KEY.env" })
const API_KEY = process.env.API

const origin = "Budapest"
const destination = "Sarti"

const client = new Client({})

client
  .distancematrix({
    params: {
      origins: ["Budapest"],
      destinations: ["Sarti"],
      travelMode: "DRIVING",
      drivingOptions: {
        departureTime: new Date(Date.now()),
        trafficModel: "pessimistic",
      },
      key: API_KEY,
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => {
    console.log(JSON.stringify(r.data, null, 2)) //data.rows[0].elements[0].duration
  })
  .catch((e) => {
    console.log(e.response.data.error_message)
  })
