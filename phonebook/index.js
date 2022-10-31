const express = require('express')
const app = express()

//const persons = require("./db.json").persons
const persons = [
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

app.get('/api/persons', (req, res) => {
        res.json(persons)
})
app.get('/api/persons/:id', (req, res) => {
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

app.delete('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        const person = persons.filter(person => {
                return person.id !== id
        })

        // 204 no content if delete is successful
        response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})
