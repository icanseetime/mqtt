if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const mqtt = require('mqtt')
const client = mqtt.connect(`mqtt://localhost:${process.env.PORT}`)
const deviceType = 'lights'
const deviceName = 'nightlight'
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

	// Mock: Set brightness of bulb
	if (message) {
		message = JSON.parse(message)
		message.e.forEach((entry) => {
			if (entry.n == 'brightness') {
				if (entry.v < 0) {
					console.log(
						`💡 ${deviceType}:${deviceName} set brightness to ${
							entry.v * 100
						}`
					)
				} else {
					console.log(`💡 ${deviceType}:${deviceName} turned off`)
				}

				// TODO: test!
				// Publish new status for saving to DB
				client.publish(`/home/${deviceType}/${deviceName}/status`, {
					bn: `${deviceType}:${deviceName}`,
					bt: Date.now(),
					e: [{ n: 'brightness', u: '/', v: entry.v }]
				})
			}
		})
	}
})

client.on('error', (err) => {
	console.log(`❌ ${err}`)
})
