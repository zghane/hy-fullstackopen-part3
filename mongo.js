const mongoose = require("mongoose")

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("person", personSchema)


if (process.argv.length<3) {
	console.log("usage:")
	console.log("insert person: node mongo.js password name number")
	console.log("get all entries: node mongo.js password")
	process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://hy-fullstack:${password}@cluster0.u4oyghf.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)

// name + number given; create new person
if (process.argv.length > 4) {
	const name = process.argv[3]
	const number = process.argv[4]

	const person = new Person({
		name: name,
		number: number
	})

	person.save().then(result => {
		console.log(`Added ${name} ${number} to phonebook`)
		mongoose.connection.close()
	})
}
// otherwise, return person list
else {
	Person.find({}).then(persons => {
		console.log("phonebook")
		console.log(persons.map(person => `${person.name} ${person.number}`).join("\n"))
		mongoose.connection.close()
	})
}
