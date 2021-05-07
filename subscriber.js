if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')
const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const topic = '/lights/#'

console.log('🚧 Connecting to MQTT subscriber')

client.on('connect', (ack) => {
	console.log('✅ MQTT subscriber connected!')
	client.subscribe(topic)
})

client.on('message', (topic, message) => {
	console.log(
		`📩 MQTT subscriber received message\n\tTopic: ${topic}\n\tMessage: ${message.toString()}`
	)
})

client.on('error', (err) => {
	console.log(`❌ ${err}`)
})
