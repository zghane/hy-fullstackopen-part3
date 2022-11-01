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


// info page; show number of entries
app.get("/info", (req, res) => {
        const resString = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `
        res.send(200, resString)
})
// get all persons
app.get("/api/persons", (req, res) => {
	Person.find({}).then(persons => {
		res.status(200).json(persons.map(person => person.toJSON()))
	})
})
// get a person by id
app.get("/api/persons/:id", (req, res) => {
        const id = Number(req.params.id)
	Person.find({id: id}).then(person => {
		if (person) {
			res.status(200).json(person.toJSON())
		}
		else {
			res.status(404).end()
		}
	})
})

// delete a person by id
app.delete("/api/persons/:id", (req, res) => {
	Person.findByIdAndRemove(req.params.id).then(person => {
		// 204 no content if delete is successful
		res.status(204).end()
	}).catch(error => {
		console.log(error)
	})

})
// create new person with random id
app.post("/api/persons", (req, res) => {
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
			console.log(error)
		})
		// redirect to created resource
		//res.redirect(201, `/api/persons/`)
	}
})
// update a person's number
app.put("/api/persons/:id", (req, res) => {
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
		Person.findByIdAndUpdate(req.params.id, updatedPerson).then(person => {
			if (person) {
				res.json(updatedPerson.toJSON())
			}
			else {
				response.status(404).end()
			}
		})
	}
})



const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})
