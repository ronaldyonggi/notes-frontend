import axios from "axios";
const baseUrl = '/api/notes'

// Initialize token
let token = null

// Function to set token
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Get all notes
const getAll = () => {
  const request = axios.get(baseUrl)
  // const nonExistingNote = {
  //   id: 10000,
  //   content: "This note isn't saved in the server!",
  //   important: true
  // }
  // return request.then(response => response.data.concat(nonExistingNote))
  return request.then(response => response.data)
}

// Create a new note
const create = async newObject => {
  // const request = axios.post(baseUrl, newObject)
  // return request.then(response => response.data)

  // Sets token to the authorization header
  const config = {
    headers: { Authorization: token },
  }

  // Header is given to axios as the 3rd parameter of post method
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// Update a note
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { 
  getAll, create, update , setToken
}