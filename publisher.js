// Packages
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')
const message =
	'{"bn": "light:ceiling1","bt": 111111111,"e":[{"n": "brightness","u": "/","v": 0.8}]}'

// const json2xml = require('json2xml')
// const jsonObj = JSON.parse(data) // Convert JSON string into object
// const message = json2xml(jsonObj) // Convert JSON to XML
// console.log(message)

const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const topic = '/home/lights/test'

console.log('🚧 Connecting to MQTT publisher')

client.on('connect', () => {
	console.log('✅ MQTT publisher connected!')
})

client.publish(topic, message)
console.log(`📨 Message sent from publisher: ${message}`)
