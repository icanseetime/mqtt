// Packages
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

// const cluster = require('cluster')
// const mqemitter = require('mqemitter-mongodb')
// const mongoPersistence = require('aedes-persistence-mongodb')

const aedes = require('aedes')()
// 	{
// 	id: `BROKER_${cluster.worker.id}`,
// 	mq: mqemitter({
// 		url: process.env.MONGODB_URL
// 	}),
// 	persistence: mongoPersistence({
// 		url: process.env.MONGODB_URL,
// 		// Optional TTL settings TODO remove
// 		ttl: {
// 			packets: 300, // No of seconds
// 			subscriptions: 300
// 		}
// 	})
// }

const broker = require('net').createServer(aedes.handle)
const mongoClient = require('mongodb').MongoClient

const startBroker = () => {
	return new Promise((res, rej) => {
		broker.listen(process.env.PORT, () => {
			console.log(`MQTT broker started on port ${process.env.PORT}`)
			return res
		})
	})
}

;(start = async () => {
	try {
		await startBroker()
	} catch (err) {
		console.error(`🛑 Error: ${err}`)
		process.exit()
	}
})()

aedes.on('publish', (packet, client) => {
	console.log(packet.topic, packet.payload.toString())
})
