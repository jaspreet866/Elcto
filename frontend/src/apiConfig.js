export const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:9000'
    : 'https://elcto-1.onrender.com';

export default API_BASE;
