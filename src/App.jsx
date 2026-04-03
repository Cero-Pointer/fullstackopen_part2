import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

function Filter({ filterName, filterByName }) {
  return (
    <div>
      filter by name:
      <input
        value={filterName}
        onChange={filterByName}
      />
    </div>
  )
}

function PersonForm({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange }) {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name:
          <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  )
}
function Persons({ persons, filterName, deletePerson }) {
  return (
    <div>
      {persons
        .filter(person =>
          filterName === '' || person.name.toLowerCase().includes(filterName.toLowerCase())
        )
        .map(person =>
          <div key={person.id}>
            {person.name} {person.number} <button onClick={() => { deletePerson(person.id) }}>Delete</button>
          </div>
        )
      }
    </div>
  )
}

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState("")
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initalPersons => { setPersons(initalPersons), console.log("Got Data") })
      .catch(error => {
        console.log("Error getting all: ", error),
          setNotification("Error while getting data")
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const foundPerson = persons.find(person => person.name === newName)
    if (foundPerson) {
      if (confirm(newName + " is already added, do you want to update the number?")) {
        const updatedPerson = {
          name: foundPerson.name,
          number: newNumber,
          id: foundPerson.id,
        }
        personService
          .update(foundPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== foundPerson.id ? person : returnedPerson
            ))
            setNotification("Successfully updated " + foundPerson.name)
            timeout(5000)
          })
          .catch(error => {
            console.log("Error while updating Person: ", error,
              setNotification("Error while updating Person"))
            timeout(5000)
          })
      }
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1),
      }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson)),
            setNotification("Successfully created " + newPerson.name)
          timeout(5000)
        })
        .catch(error => {
          console.log("Error adding Person: ", error),
            setNotification("Error while creating Person")
          timeout(5000)
        })
    }
  }

  function deletePerson(id) {
    const person = persons.find(p => p.id === id)
    if (confirm("Do you want to delete " + person.name)) {
      personService
        .deleting(id)
        .then(setPersons(persons.filter(person => person.id !== id),
          setNotification("Successfully deleted " + person.name),
          timeout(5000)))
        .catch(error => {
          console.log("Error while deleting Person", error),
            setNotification("Error while updating Person")
          timeout(5000)
        })

    }
  }

  function timeout(howLong) {
    setTimeout(() => {
      setNotification(null)
    }, howLong)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filterByName = (event) => {
    setFilterName(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} />
      <Filter filterName={filterName} filterByName={filterByName} />

      <h2>add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} filterName={filterName} deletePerson={deletePerson} />
    </div>
  )
}

export default App