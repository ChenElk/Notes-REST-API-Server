import axios from 'axios'

const baseUrl = 'http://127.0.0.1:3001/login'


export default {
  login: (newObject: { username: string; password: string }) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  }
}