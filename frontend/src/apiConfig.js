const defaultApiBase = window.location.hostname === "localhost"
  ? "http://localhost:9000"
  : "https://elcto-1.onrender.com";

export const API_BASE = process.env.REACT_APP_API_URL || defaultApiBase;

export default API_BASE;
