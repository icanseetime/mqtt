const mongoose = require('mongoose')

// Schema
const Light = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		group: {
			// Group that the lightbulb is placed into
			type: String,
			required: false
		},
		brightness: {
			// Percentage of total lumen that the lightbulb is capable of
			type: Number,
			required: true,
			min: 0,
			max: 1
		}
	},
	{ timestamps: true }
)

// Export
module.exports = mongoose.model('Light', Light)
