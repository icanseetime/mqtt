// Packages
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
// const mqtt = require('mqtt')

const startBroker = async () => {
	return new Promise((res, rej) => {
		server.listen(process.env.PORT, () => {
			console.log(`MQTT broker started on port ${process.env.PORT}`)
			return res
		})
	})
}

const start = async () => {
	try {
		await startBroker()
		// await mqttClient()
	} catch (err) {
		console.error(`🛑 Error: ${err}`)
		process.exit()
	}
}
start()
