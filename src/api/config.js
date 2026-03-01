const ENV_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// this is for fallback if .env is not present
const DEFAULT_LOCAL_API = "http://127.0.0.1:8000/api";

let API_BASE_URL;

if (ENV_API_BASE_URL && ENV_API_BASE_URL.trim() !== "") {
  API_BASE_URL = ENV_API_BASE_URL;
} else {
  API_BASE_URL = DEFAULT_LOCAL_API;
}

export { API_BASE_URL };
