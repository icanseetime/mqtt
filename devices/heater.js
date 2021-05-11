if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')
const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const deviceType = 'heaters'
const deviceName = 'panel1'
const topics = [`home/${deviceType}`, `/home/${deviceType}/${deviceName}/#`]

console.log(`🚧 Connecting to ${deviceType}:${deviceName}`)

client.on('connect', () => {
	console.log(`✅ ${deviceType}:${deviceName} connected!`)
	client.subscribe(topics)
})

client.on('message', (topic, message) => {
	console.log(
		`📩 ${deviceType}:${deviceName} received message\n\tTopic: ${topic}\n\tMessage: ${message.toString()}`
	)

	// Mock: Set temperature of the heater
	if (message) {
		message = JSON.parse(message)
		message.e.forEach((entry) => {
			if (entry.n == 'temperature') {
				if (entry.v < 0) {
					console.log(
						`💡 ${deviceType}:${deviceName} set temperature to ${entry.v}℃`
					)
				} else {
					console.log(`💡 ${deviceType}:${deviceName} turned off`)
				}

				// TODO: test!
				// Publish new status for saving to DB
				client.publish(`/home/${deviceType}/${deviceName}/status`, {
					bn: `${deviceType}:${deviceName}`,
					bt: Date.now(),
					e: [{ n: 'temperature', u: 'Cel', v: entry.v }]
				})
			}
		})
	}
})

client.on('error', (err) => {
	console.log(`❌ ${err}`)
})
