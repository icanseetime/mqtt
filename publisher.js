// Packages
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')

const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const topic = '/lights/test'
const message = 'This is a message'

console.log('🚧 Connecting to MQTT publisher')

client.on('connect', () => {
	console.log('✅ MQTT publisher connected!')
	setInterval(() => {
		client.publish(topic, message)
		console.log(`📨 Message sent from publisher: ${message}`)
	}, 5000)
})
