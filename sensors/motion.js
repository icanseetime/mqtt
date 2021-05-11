// Packages
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')

// Setup
const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const topic = '/home/sensors/motion'
const deviceType = 'sensors'
const deviceName = 'motion'

// XML message
const message =
	'<sensml xmlns="urn:ietf:params:xml:ns:senml"><senml bn="sensors:motion" bt="1620754675" n="detected" vb="true"></senml></sensml>'

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
