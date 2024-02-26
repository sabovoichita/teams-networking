import "./style.css";

// console.warn("app ready");

function createTeamRequest() {
  fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      promotion: "WON3",
      members: "Your Name",
      name: "CV",
      url: "https://github.com/nmatei/teams-networking"
    })
  });
}

function getTeamAsHTML(team) {
  return `
<tr>
  <td>${team.promotion}</td>
  <td>${team.members}</td>
  <td>${team.name}</td>
  <td>${team.url}</td>
  <td>x</td>
</tr>`;
}
function renderTeams(teams) {
  // console.warn("render", teams);
  const teamsHTML = teams.map(getTeamAsHTML);
  // console.info("teams:", teamsHTML);
  document.querySelector("#teamsTable tbody").innerHTML = teamsHTML.join("");
}

function loadTeams() {
  const promise = fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      renderTeams(teams);
      return teams;
    });
  // console.warn("loadTeams", promise);
}
function onSubmit(e) {
  e.preventDefault();
  console.warn("please save all values");
  createTeamRequest();
  window.location.reload();
}

function initEvents() {
  document.querySelector("#teamsForm").addEventListener("submit", onSubmit);
}

initEvents();
loadTeams();
