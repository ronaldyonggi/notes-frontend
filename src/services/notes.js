import axios from "axios";
const baseUrl = '/api/notes'

// Initialize token
let token = null

// Function to set token
const setToken = newToken => {
  token = `Bearer ${newToken}`
}
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

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll, create, update 
}