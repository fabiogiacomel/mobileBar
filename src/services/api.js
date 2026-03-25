import axios from 'axios';

// ATENÇÃO: Se estiver testando em um celular real ou simulador, 
// altere 'localhost' para o IP da sua máquina na rede local.
// No emulador de Android você pode usar '10.0.2.2'.
const API_BASE_URL = 'http://10.0.2.2:8000'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
