require("dotenv").config()
const express = require("express")
var morgan = require("morgan")
const Person = require("./models/person")
const app = express()

app.use(express.json())
// use static frontend files in build/
app.use(express.static("build"))
// customize log messages
// method : url : status : content length : response time : request body
morgan.token("body", (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
const MAX_ID = 1000000


// info page; show number of entries in the database
app.get("/info", (req, res) => {
	Person.find({}).then(persons => {
		const resString = `
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date()}</p>
		`
		res.send(200, resString)
	}).catch(error => {
		next(error)
	})
})
// get all persons
app.get("/api/persons", (req, res, next) => {
	Person.find({}).then(persons => {
		res.status(200).json(persons.map(person => person.toJSON()))
	}).catch(error => {
		next(error)
	})
})
// get a person by id
app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id).then(person => {
		if (person) {
			res.status(200).json(person.toJSON())
		}
		else {
			res.status(404).end()
		}
	}).catch(error => {
		next(error)
	})
})

// delete a person by id
app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id).then(person => {
		// 204 no content if delete is successful
		res.status(204).end()
	}).catch(error => {
		next(error)
	})

})
// create new person with random id
app.post("/api/persons", (req, res, next) => {
	// name or number not supplied; return 400 bad request
	// mandatory params not given
	if (!(req.body.name || req.body.number)) {
		res.status(400).send("name and number must be supplied")
	} 
	else {
		// person already in the phonebook
		// note: find() returns [] while findOne returns null if nothing is found ...
		Person.findOne({name: {"$regex": req.body.name, "$options": "i"}}).then(person => {
			if (person) {
				res.status(400).send(`person ${req.body.name} already exists`)
			}
		})

		// parameters ok, process the request
		const newPerson = new Person({
			"name": req.body.name,
			"number": req.body.number,
		})
		newPerson.save().then(() => {
			res.json(newPerson.toJSON())
		}).catch(error => {
			next(error)
		})
	}
})
// update a person's number by id
app.put("/api/persons/:id", (req, res, next) => {
	// mandatory params not given
	if(!(req.body.name || req.body.number)) {
		res.status(400).send("name and number must be supplied")
	}
	// parameters ok, try to find corresponding entry
	else {
		const updatedPerson = {
			name: req.body.name,
			number: req.body.number
		}
		Person.findByIdAndUpdate(req.params.id, updatedPerson, {new: true}).then(person => {
			if (person) {
				res.json(person.toJSON())
			}
			else {
				response.status(404).end()
			}
		}).catch(error => {
			next(error)
		})
	}
})

// error handler for api endpoints
const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	else if (error.name === "ValidationError") {
		return response.status(400).json({error: error.message})
	}

	next(error)
}

// register error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
