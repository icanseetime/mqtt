// Packages & broker setup
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const aedes = require('aedes')()
const broker = require('net').createServer(aedes.handle)
const xml2js = require('xml2js').parseString

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
			`Topic: ${packet.topic}\nPayload: ${packet.payload.toString()}\n\n`
		)
		// Ignore system topics
		if (!packet.topic.startsWith('$SYS')) {
			// Convert data to JSON depending on format
			let values
			if (packet.payload.toString().startsWith('{')) {
				// JSON
				values = packet.payload // TODO: check this
			} else if (packet.payload.toString().startsWith('<')) {
				// XML
				xml2js(packet.payload, (err, result) => {
					values = result.sensml.senml[0]['$']
				})
			} else {
				// EXI // TODO
				console.log('EXI?')
			}

			// Save desired data to MongoDB database
			if (packet.topic.includes('sensors')) {
				// Mock setting of values of lights and heaters (this would of course be very different in a real system, just added this to show parts of the scenario)

				// When phone moves outside the location area, send message to turn off lights and lower temperature to 20℃
				if (packet.topic.includes('phonegps')) {
					// Lights
					let payload = {
						bn: 'broker',
						bt: Date.now(),
						e: [
							{
								n: 'brightness',
								u: '/',
								v: 0
							}
						]
					}
					await aedes.publish('/home/lights', JSON.stringify(payload))

					// Heaters
					payload = {
						bn: 'broker',
						bt: Date.now(),
						e: [
							{
								n: 'temperature',
								u: 'Cel',
								v: 20
							}
						]
					}
					await aedes.publish('/home/lights', JSON.stringify(payload))
				}

				// When motion is detected, send message to turn lights on at 50% and raise temperature to 23℃
				if (packet.topic.includes('motion')) {
					// Lights
					let payload = {
						bn: 'broker',
						bt: Date.now(),
						e: [
							{
								n: 'brightness',
								u: '/',
								v: 0.5
							}
						]
					}
					console.log(1)
					await aedes.publish('/home/lights', JSON.stringify(payload))
					console.log(2)
					// Heaters
					payload = {
						bn: 'broker',
						bt: Date.now(),
						e: [
							{
								n: 'temperature',
								u: 'Cel',
								v: 23
							}
						]
					}
					console.log(3)
					await aedes.publish('/home/lights', JSON.stringify(payload))
					console.log(4)
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
				console.log(`💡 Status of ${values.bn} saved to DB`)
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
				console.log(`🔥 Status of ${values.bn} saved to DB`)
			}
		}
	} catch (err) {
		console.log(`❌ ${err}`)
	}
})
