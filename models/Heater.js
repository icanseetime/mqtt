const mongoose = require('mongoose')

// Schema
const Heater = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		group: {
			// Group that the heater is placed into
			type: String,
			required: false
		},
		degrees: {
			// Degrees celcius that the heater is currently set to
			type: Number,
			required: true,
			min: 0,
			max: 40
		}
	},
	{ timestamps: true }
)

// Export
module.exports = mongoose.model('Heater', Heater)
