import axios from 'axios';
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});
apiClient.interceptors.request.use(config => {
const token = localStorage.getItem('authToken');
if(token){
      config.headers.Authorization = `Bearer ${token}`;
}
console.log('📡 Sending request to:', config.url);
  return config;


})
export default apiClient;