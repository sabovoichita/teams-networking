// for demo purposes...
const isDemo = location.host === "sabovoichita.github.io";
//const inlineChanges = isDemo;

const API = {
  CREATE: {
    URL: "http://localhost:3000/teams-json/create",
    METHOD: "POST"
  },
  READ: {
    URL: "http://localhost:3000/teams-json",
    METHOD: "GET"
  },
  UPDATE: {
    URL: "http://localhost:3000/teams-json/update",
    METHOD: "PUT"
  },
  DELETE: {
    URL: "http://localhost:3000/teams-json/delete",
    METHOD: "DELETE"
  }
};

if (isDemo) {
  API.READ.URL = "data/products.json";
  API.DELETE.URL = "data/delete.json";
  API.CREATE.URL = "data/create.json";
  API.UPDATE.URL = "data/update.json";

  API.DELETE.METHOD = "GET";
  API.CREATE.METHOD = "GET";
  API.UPDATE.METHOD = "GET";
}

const baseUrl = "http://localhost:3000/teams-json";

export function loadTeamsRequest() {
  return fetch(API.READ.URL, {
    method: API.READ.METHOD,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => r.json());
}

export function createTeamRequest(team) {
  return fetch(API.CREATE.URL, {
    method: API.CREATE.METHOD,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

export function deleteTeamRequest(id) {
  return fetch(API.DELETE.URL, {
    method: API.DELETE.METHOD,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  }).then(r => r.json());
}

export function updateTeamRequest(team) {
  return fetch(API.UPDATE.URL, {
    method: API.UPDATE.METHOD,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}
