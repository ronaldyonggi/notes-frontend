import { useEffect, useState } from "react";
import Note from "./components/Note";
import noteService from './services/notes'
import Notification from "./components/Notification";
import ShowAllButton from "./components/ShowAllButton";
import Form from "./components/Form";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const toggleImportance = id => {
    // Find the note that matches the id
    const matchingNote = notes.find(note => note.id === id)
    const modifiedNote = {...matchingNote, important: !matchingNote.important}

    noteService
      .update(id, modifiedNote)
      .then(modifiedNoteResponse => {
        setNotes(notes.map(note => note.id === id ? modifiedNoteResponse : note))
      })
      .catch(error => {
        // setErrorMessage(`The note '${matchingNote.content}' had already been deleted!`)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  const addNote = event => {
    event.preventDefault()
    const noteToBeAdded = {
      content: newNote,
      important: Math.random() < 0.5,
      // id: notes.length + 1
    }

    noteService
      .create(noteToBeAdded)
      .then(addedNoteResponse => {
        setNotes(notes.concat(addedNoteResponse))
        setNewNote('')
      })
      .catch(error => {
        console.log(error.name)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleNoteChange = event => {
    setNewNote(event.target.value)
  }

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ShowAllButton toggleShowAll={toggleShowAll} showAll={showAll} />
      {notes && (
        <ul>
          {notesToShow.map(note => 
            <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
            />
            )}
        </ul>
      )}

      <Form addNote={addNote} newNote={newNote} handleNoteChange={handleNoteChange}/>
      <Footer />
    </div>
  )
}

export default App;
