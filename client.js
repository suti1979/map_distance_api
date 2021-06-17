const { Client } = require("@googlemaps/google-maps-services-js")

const origin = "Budapest"
const destination = "Sarti"

const client = new Client({})

client
  .distancematrix({
    params: {
      origins: [origin],
      destinations: [destination],
      drivingOptions: {
        departureTime: new Date(Date.now()),
        trafficModel: "pessimistic",
      },
      key: "",
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => {
    console.log(r.data.rows[0].elements[0]) //data.rows[0].elements[0].duration
  })
  .catch((e) => {
    console.log(e.response.data.error_message)
  })
