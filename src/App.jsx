import { useState, useEffect } from 'react'
import personService from './services/persons'

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

  useEffect(() => {
    personService
      .getAll()
      .then(initalPersons => { setPersons(initalPersons), console.log("Got Data") })
      .catch(error => { console.log("Error getting all: ", error) })
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
            console.log("Person updated");
          })
          .catch(error => {
            console.log("Error while updating Person: ", error);
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
        .then(returnedPerson => { setPersons(persons.concat(returnedPerson)), console.log("Person added") })
        .catch(error => { console.log("Error adding Person: ", error) })
    }
  }

  function deletePerson(id) {
    const person = persons.find(p => p.id === id)
    if (confirm("Do you want to delete " + person.name)) {
      personService
        .deleting(id)
        .then(setPersons(persons.filter(person => person.id !== id)))
        .catch(error => { console.log("Error while deleting Person", error) })
    }
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
      <h2>Phonebook</h2>
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