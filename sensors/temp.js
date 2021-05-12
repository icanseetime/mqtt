// Packages
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')

// Setup
const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const topic = '/home/sensors/temp'
const deviceType = 'sensors'
const deviceName = 'temp'

// EXI message
const message =
	'80 40 36 26 ea 80 44 39 cd 95 b9 cd bd c9 cc e9 d1 95 b5 c0 03 62 74 a8 03 5e 70 3d 70 80 c0 00 09 96 a0 00 00 27 5a 80 44 15 0d 95 b0 02 76 a8 03 42 40 07 a0'

// Connect
console.log(`🚧 Connecting to ${deviceType}:${deviceName}...`)
client.on('connect', () => {
	console.log(`✅ ${deviceType}:${deviceName} connected!`)
})

// Publish message
client.publish(topic, message)
console.log(`📨 Message sent from ${deviceType}:${deviceName} : ${message}`)

// Error
client.on('error', (err) => {
	console.log(`❌ ${err}`)
})
