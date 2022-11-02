const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url).then(result => {
	console.log('connected to MongoDB')
}).catch((error) => {
	console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
	name: {
		type:String,
		minlength: 3,
		required: true
	},
	// e.g. 050 000 0000 -> 9 digits
	// +358 50 000 0000 -> 10 digits
	// storing short form numbers probably isn't necessary
	number: {
		type: String,
		minlength: 6,
		required: true
	}
})

// format the objects returned by mongoose
personSchema.set('toJSON', {
	  transform: (document, returnedObject) => {
		      returnedObject.id = returnedObject._id.toString()
		      delete returnedObject._id
		      delete returnedObject.__v
		    }
})

const Person = mongoose.model("person", personSchema)
module.exports = Person

