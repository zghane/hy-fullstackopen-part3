require("dotenv").config()
const express = require("express")
var morgan = require("morgan")
const app = express()

app.use(express.json())
// use static frontend files in build/
app.use(express.static("build"))
// customize log messages
// method : url : status : content length : response time : request body
morgan.token("body", (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
const MAX_ID = 1000000

let persons = [
                { 
                        "name": "Arto Hellas", 
                        "number": "040-123456",
                        "id": 1
                },
                { 
                        "name": "Ada Lovelace", 
                        "number": "39-44-5323523",
                        "id": 2
                },
                { 
                        "name": "Dan Abramov", 
                        "number": "12-43-234345",
                        "id": 3
                },
                { 
                        "name": "Mary Poppendieck", 
                        "number": "39-23-6423122",
                        "id": 4
                }
        ]

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
        res.json(persons)
})
// get a person by id
app.get("/api/persons/:id", (req, res) => {
        const id = Number(req.params.id)
        const person = persons.find(person => {
                return person.id === id
        })

        if (person) {
                res.json(person)
        }
        else {
                res.status(404).end()
        }
})

// delete a person by id
app.delete("/api/persons/:id", (req, res) => {
        const id = Number(req.params.id)
        persons = persons.filter(person => {
                return person.id !== id
        })

        // 204 no content if delete is successful
        res.status(204).end()
})
// create new person with random id
app.post("/api/persons", (req, res) => {
        // name or number not supplied; return 400 bad request
        if (!(req.body.name || req.body.number)) {
            res.status(400).send("name and number must be supplied")
        } 
        // person already in the phonebook
        else if (persons.map(person => person.name.toLowerCase()).includes(req.body.name.toLowerCase())) {
            res.status(400).send(`person ${req.body.name} already exists`)
        }
        // parameters ok, process the request
        else {
                const id = Math.floor(Math.random() * MAX_ID)
                const newPerson = {
                        "name": req.body.name,
                        "number": req.body.number,
                        "id": id
                }
                persons = persons.concat(newPerson)

                res.status(200).send(newPerson)
                // redirect to created resource
                //res.redirect(201, `/api/persons/`)
        }
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})
