// Packages & broker setup
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const aedes = require('aedes')()
const broker = require('net').createServer(aedes.handle)
const xml2js = require('xml2js').parseString
const exificient = require('exificient.js')

// Database setup
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
})
const db = mongoose.connection
db.on('error', (error) => console.error('❌ Database connection\n', error))
db.on('open', () => console.log('✅ Database connection'))
const { Light, Heater } = require('./models')

// Start the broker
;(start = async () => {
	try {
		await broker.listen(process.env.PORT, () => {
			console.log(`✅ MQTT broker started on port ${process.env.PORT}`)
		})
	} catch (err) {
		console.error(`🛑 Error: ${err}`)
		process.exit()
	}
})()

// Catch published data
aedes.on('publish', async (packet) => {
	try {
		console.log(
			`Topic: ${packet.topic}\nPayload: ${packet.payload.toString()}\n`
		)
		// Ignore system topics
		if (!packet.topic.startsWith('$SYS')) {
			// Convert data to JSON depending on format
			let values
			if (packet.payload.toString().startsWith('{')) {
				// JSON
				values = JSON.parse(packet.payload)
			} else if (packet.payload.toString().startsWith('<')) {
				// XML
				xml2js(packet.payload, (err, result) => {
					values = result.sensml.senml[0]['$']
				})
			} else {
				// EXI
				values = exificient.EXI4JSON(packet.payload)
			}

			// Save desired data to MongoDB database
			if (packet.topic.includes('sensors')) {
				// Mock setting of values of lights and heaters (this would of course be very different in a real system, just added this to show parts of the scenario)

				// When phone moves outside the location area, send message to turn off lights and lower temperature to 20℃
				if (packet.topic.includes('phonegps')) {
					// Lights
					await aedes.publish({
						topic: '/home/lights',
						payload: JSON.stringify({
							bn: 'broker',
							bt: Date.now(),
							e: [
								{
									n: 'brightness',
									u: '/',
									v: 0
								}
							]
						})
					})

					// Heaters
					await aedes.publish({
						topic: '/home/heaters',
						payload: JSON.stringify({
							bn: 'broker',
							bt: Date.now(),
							e: [
								{
									n: 'temperature',
									u: 'Cel',
									v: 20
								}
							]
						})
					})
				}

				// When motion is detected, send message to turn lights on at 50% and raise temperature to 23℃
				if (packet.topic.includes('motion')) {
					// Lights
					aedes.publish({
						topic: '/home/lights',
						payload: JSON.stringify({
							bn: 'broker',
							bt: Date.now(),
							e: [
								{
									n: 'brightness',
									u: '/',
									v: 0.5
								}
							]
						})
					})

					// Heaters
					aedes.publish({
						topic: '/home/heaters',
						payload: JSON.stringify({
							bn: 'broker',
							bt: Date.now(),
							e: [
								{
									n: 'temperature',
									u: 'Cel',
									v: 23
								}
							]
						})
					})
				}

				// When low temperature is detected, send message to raise temperature of specific heater to 21℃
				if (packet.topic.includes('temp')) {
					// Heater
					aedes.publish({
						topic: '/home/heaters/panel1',
						payload: JSON.stringify({
							bn: 'broker',
							bt: Date.now(),
							e: [
								{
									n: 'temperature',
									u: 'Cel',
									v: 21
								}
							]
						})
					})
				}
			} else if (
				packet.topic.includes('lights') &&
				values.bn !== 'broker'
			) {
				// Extract new brightness level from data (could easily be done for other values, like hue of the lightbulb)
				let brightness
				values.e.forEach((entry) => {
					if ((entry.n = 'brightness')) {
						brightness = entry.v
					}
				})

				// Update status of lightbulb in database (or create new entry if it doesn't exist)
				await Light.findOneAndUpdate(
					{ name: values.bn },
					{ name: values.bn, brightness: brightness },
					{ upsert: true }
				)
				console.log(`💡 Status of ${values.bn} saved to DB\n`)
			} else if (
				packet.topic.includes('heaters') &&
				values.bn !== 'broker'
			) {
				// Extract new temperature from data (could easily be done for other values, like hue of the lightbulb)
				let temp
				values.e.forEach((entry) => {
					if ((entry.n = 'temperature')) {
						temp = entry.v
					}
				})

				// Update status of heater in database (or create new entry if it doesn't exist)
				await Heater.findOneAndUpdate(
					{ name: values.bn },
					{ name: values.bn, degrees: temp },
					{ upsert: true }
				)
				console.log(`🔥 Status of ${values.bn} saved to DB\n`)
			}
		}
	} catch (err) {
		console.error(`❌ ${err}`)
	}
})
