const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const defaultApiBase = isLocal
  ? "http://localhost:9000"
  : "https://elcto-1.onrender.com";

export const API_BASE = process.env.REACT_APP_API_URL || defaultApiBase;

export default API_BASE;
