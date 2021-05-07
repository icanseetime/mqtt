// Packages
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')

const json2xml = require('json2xml')

const data =
	'{"Data": {"SOM": {"Tab": [{"Values": {"ExpandedValues":null, "ID":"msorgrole"}, "ID": "OrgRole"},{"Values": {"ExpandedValues":null, "ID":"msorg"}, "ID": "Organization"}]}}}'

const jsonObj = JSON.parse(data) // Convert JSON string into object
const message = json2xml(jsonObj) // Convert JSON to XML
console.log(message)

const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const topic = '/lights/test'
// const message = 'This is a message'

console.log('🚧 Connecting to MQTT publisher')

client.on('connect', () => {
	console.log('✅ MQTT publisher connected!')
	setInterval(() => {
		client.publish(topic, message)
		console.log(`📨 Message sent from publisher: ${message}`)
	}, 5000)
})
