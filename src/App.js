import { useEffect, useState, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import Notification from './components/Notification'
import ShowAllButton from './components/ShowAllButton'
import LoginForm from './components/LoginForm'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()

  // Retrieve all notes initially
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // Retrieve currently logged in user from local browser storage, if a user was logged in in the first place
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    // If the retrieved user is not null, then a user is currently logged in
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // Determine whether to show all notes or only important ones by looking at value
  // of showAll variable (true or false)
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const toggleImportance = id => {
    // Find the note that matches the id
    const matchingNote = notes.find(note => note.id === id)
    const modifiedNote = { ...matchingNote, important: !matchingNote.important }

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

  // Handle adding note (when save button is pressed)
  // This function will be passed to NoteForm component as createNote props.
  // The noteObject argument will be provided in NoteForm
  const addNote = noteObject => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(addedNoteResponse => {
        setNotes(notes.concat(addedNoteResponse))
      })
      .catch(error => {
        console.log(error.name)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  // Toggle between showing all notes or showing only the important ones
  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  // Handle login when login button is pressed
  // username and password is provided from LoginForm
  const handleLogin = async (username, password) => {
    // console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      // if user login is successful, save user info to browser local storage
      window.localStorage.setItem(
        // Values saved to storage are DOMstrings, not JS. The 'user' JS object need to be converted to JSON
        'loggedNoteappUser', JSON.stringify(user)
      )

      // if user login is successful, set token
      noteService.setToken(user.token)

      setUser(user)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // Handle logout when logout button is pressed
  const handleLogout = () => {
    // Remove user from local storage
    window.localStorage.removeItem('loggedNoteappUser')
    // Set user to null
    setUser(null)
    // Set token to null
    noteService.setToken(null)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {/* If user is null (no user is logged in), display login form. Otherwise display add new note form */}
      {!user &&
        <Togglable buttonLabel="log in">
          <LoginForm login={handleLogin}/>
        </Togglable>
      }

      {user &&
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            {/* <NoteForm onSubmit={addNote} value={newNote} handleChange={handleNoteChange}/> */}
            <NoteForm createNote={addNote}/>
          </Togglable>
        </div>
      }

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

      {/* <Form addNote={addNote} newNote={newNote} handleNoteChange={handleNoteChange}/> */}
      <Footer />
    </div>
  )
}

export default App
