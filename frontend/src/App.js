import { useState, useEffect} from 'react'
import personService from "./services/persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Notification from "./components/Notification"

import "./index.css"

const App = () => {
        const [persons, setPersons] = useState([]) 
        const [newName, setNewName] = useState("")
        const [newNumber, setNewNumber] = useState("")
        const [filterString, setFilterString] = useState("")
        const [notification, setNotification] = useState({message: null, isErrorNotification: false})

        const handleNameFormChange = (event) => {
                setNewName(event.target.value)
        }
        const handleNumberFormChange = (event) => {
                setNewNumber(event.target.value)
        }
        const handleFilterFormChange = (event) => {
                setFilterString(event.target.value)
        }
        const filterPersons = (persons) => {
                return persons.filter(person =>
                        person.name.toLowerCase().includes(filterString.toLowerCase()))
        }

        const addPerson = (event) => {
                // prevent form submission / page reload
                event.preventDefault()
                // is the name new? (allow each person only once)
                if (!persons.map(person => person.name).includes(newName)) {
                        const newPerson = {name: newName, number: newNumber}
                        personService.create(newPerson).then(returnedPerson => {
                                setPersons(persons.concat(returnedPerson))
                        })
                        displayNotification(`Added ${newPerson.name}`, false)
                }
                // if name already exists, update the phone number
                else {
                        updatePerson(persons.find(p => p.name === newName).id, newNumber)
                }
                setNewName("")
                setNewNumber("")
        }
        const deletePerson = (id) => {
                if (window.confirm(`Really delete the person?`)) {
                        // attempt to remove the person and update person list
                        personService.remove(id).then(response => {
                                setPersons(persons.filter(person => person.id !== id))
                        }).catch(error => {
                                displayNotification("Person has already been deleted", true)
                        })
                                
                        displayNotification(`Person deleted`, false)
                }
        }
        // update person's phone number
        const updatePerson = (id, updatedNumber) => {
                const person = persons.find(p => p.id === id)
                const changedPerson = {...person, number: updatedNumber}

                if (window.confirm(`${person.name} is already in the phonebook, replace the old number with a new one?`)) {
                        personService.update(id, changedPerson).then(returnedPerson => {
                                setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
                        }).catch(error => {
                                displayNotification(`Information of ${person.name} has already been removed from the server`, true)
                        })
                        displayNotification(`updated ${person.name}'s number to ${updatedNumber}`, false)
                }
        }
        // display notification with message for time ms
        const displayNotification = (message, isError, time=3000) => {
                setNotification({message: message, isErrorNotification: isError})
                setTimeout(() => {
                        setNotification({message: null, isErrorNotification: false})
                }, time)
        }

        // set the initial list of persons
        useEffect(() => {
                personService.getAll()
                        .then(initialPersons => {
                                setPersons(initialPersons)
                        })
        }, [])
                        

        return (
                <div>
                        <h2>Phonebook</h2>
                        <Notification message={notification.message} isError={notification.isErrorNotification}/>
                        <Filter filterString={filterString} onChange={handleFilterFormChange} />
                        <h2>Numbers</h2>
                        <h3>Add a new</h3>
                        <PersonForm onSubmit={addPerson} newName={newName} onChangeName={handleNameFormChange} newNumber={newNumber} onChangeNumber={handleNumberFormChange} />
                        <Persons personArray={filterPersons(persons)} onClickDelete={deletePerson} />
                </div>
        )
}

export default App
