const API_BASE = "http://localhost:8080/api";

function getToken() {
    return localStorage.getItem("token");
}

async function apiRequest(endpoint, method = "GET", body = null, auth = false) {
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (body) options.body = JSON.stringify(body);
    if (auth) options.headers["Authorization"] = "Bearer " + getToken();

    const response = await fetch(API_BASE + endpoint, options);
    if (!response.ok) {
        throw new Error(await response.text());
    }
    return response.json();
}