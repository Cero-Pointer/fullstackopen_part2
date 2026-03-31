import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ filterName, filterByName }) => {
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

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange }) => {
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

const Persons = ({ persons, filterName }) => {
  return (
    <div>
      {persons
        .filter(person =>
          filterName === '' || person.name.toLowerCase().includes(filterName.toLowerCase())
        )
        .map(person =>
          <div key={person.id}>
            {person.name} {person.number}
          </div>
        )
      }
    </div>
  )
}

const App = () => {
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
    if (persons.some(person => person.name === newName))
      alert("User already exists")
    else {
      const nameObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1),
      }
      personService
        .create(nameObject)
        .then(returnedPerson => { setPersons(persons.concat(returnedPerson)), console.log("Person added") })
        .catch(error => { console.log("Error adding Person: ", error) })
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
      <Persons persons={persons} filterName={filterName} />
    </div>
  )
}

export default App