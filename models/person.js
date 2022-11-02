const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log("connecting to", url)
mongoose.connect(url).then(result => {
	console.log("connected to MongoDB")
}).catch((error) => {
	console.log("error connecting to MongoDB:", error.message)
})

const personSchema = new mongoose.Schema({
	name: {
		type:String,
		minlength: 3,
		required: [true, "Name required"]
	},
	number: {
		type: String,
		minlength: 8,
		validate: {
			// number: 2 parts separated by dash
			// first part consists of 2 or 3 number; total length > 8
			// e.g. 09-1234556 or 040-22334455
			validator: function(v) {
				return /\d{2,3}-\d{5}/.test(v);
			},
			message: props => `${props.value} is not a valid phone number!\nPlease a supply a phone number with dash, e.g. in form 000-11223344`
		},
		required: [true, "Number required"]
	}
})

// format the objects returned by mongoose
personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Person = mongoose.model("person", personSchema)
module.exports = Person

