// Packages
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')

// Setup
const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const topic = '/home/sensors/phonegps'
const deviceType = 'sensors'
const deviceName = 'phonegps'

// JSON message
const message =
	'{"bn": "sensors:phonegps","bt": 1620754675,"e": [{"u": "lat","v": -37.813629},{"u": "lon","v": 144.963058}]}'

console.log(`🚧 Connecting to ${deviceType}:${deviceName}...`)
client.on('connect', () => {
	console.log(`✅ ${deviceType}:${deviceName} connected!`)
})

// Publish message
client.publish(topic, message)
console.log(`📨 Message sent from ${deviceType}:${deviceName} : ${message}`)

client.on('error', (err) => {
	console.log(`❌ ${err}`)
})
