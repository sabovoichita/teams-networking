import "./style.css";
import { debounce } from "./utilities";

let allTeams = [];
let editId = false;

function $(selector) {
  return document.querySelector(selector);
}

function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  });
}

function deleteTeamRequest(id) {
  fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  });
}

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  });
}

function getTeamAsHTML(team) {
  const url = team.url;
  const displayUrl = url.startsWith("https://github.com/") ? url.substring(19) : url;
  return `
  <tr>
  <td>${team.promotion}</td>
  <td>${team.members}</td>
  <td>${team.name}</td>
  <td>
  <a href="${url}" target="_blank">${displayUrl}</a>
</td>
  <td>
  <a href ="#" data-id="${team.id}" class="delete-btn">✖</a>
  <a href ="#" data-id="${team.id}" class="edit-btn">&#9998;</a>

  </td>
</tr>`;
}

function renderTeams(teams) {
  // console.warn("render", teams);
  const teamsHTML = teams.map(getTeamAsHTML);
  // console.info("teams:", teamsHTML);
  $("#teamsTable tbody").innerHTML = teamsHTML.join("");
}

function loadTeams() {
  const promise = fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      // console.info(teams);
      allTeams = teams;
      renderTeams(teams);
      return teams;
    });
  // console.warn("loadTeams", promise);
}

function setFormValues(team) {
  $("input[name=promotion]").value = team.promotion;
  $("input[name=members]").value = team.members;
  $("input[name=name]").value = team.name;
  $("input[name=url]").value = team.url;
}

function getFormValues() {
  return {
    promotion: $("input[name=promotion]").value,
    members: $("input[name=members]").value,
    name: $("input[name=name]").value,
    url: $("input[name=url]").value
  };
}

function onSubmit(e) {
  e.preventDefault();
  let team = getFormValues();
  if (editId) {
    team.id = editId;
    // console.warn("should we edit?", editId, team);
    const req = updateTeamRequest(team);
    const response = req.then(r => r.json());
    response.then(status => {
      console.info("status:", status);
      if (status.success) {
        window.location.reload();
      }
    });
  } else {
    createTeamRequest(team)
      .then(r => r.json())
      .then(status => {
        if (status.success) {
          window.location.reload();
        }
      });
  }
}

function startEdit(teams, id) {
  editId = id;
  const team = teams.find(team => {
    return id === team.id;
  });
  setFormValues(team);
}

function onSearch(e) {
  const query = e.target.value.toLowerCase();
  const queries = query.split(/\s*,\s*/).filter(q => q);
  console.warn(queries);
  if (!queries.length) {
    renderTeams(allTeams);
    return;
  }
  const teams = allTeams.filter(team => {
    // console.info("filter", team, queries);
    return queries.some(q => {
      // console.info(" q %o", q, team.name);
      return (
        team.promotion.toLowerCase().includes(q) ||
        team.members.toLowerCase().includes(q) ||
        team.name.toLowerCase().includes(q) ||
        team.url.toLowerCase().includes(q)
      );
    });
  });
  renderTeams(teams);
}
// function filterElements(teams,search) {
//   search = search.toLowerCase();
//   //console.warn("search %o", search);
//   return teams.filter(team => {
//     return (
//       team.promotion.toLowerCase().includes(search) ||
//       team.members.toLowerCase().includes(search) ||
//       team.name.toLowerCase().includes(search) ||
//       team.url.toLowerCase().includes(search)
//     );
//   });
// }

function initEvents() {
  // $("#search").addEventListener("input", e => {
  //   const search = e.target.value;
  //   const teams = filterElements(allTeams, search);
  //   renderTeams(teams);
  // });
  $("#search").addEventListener("input", debounce(onSearch, 500));
  $("#search").addEventListener("reset", () => {
    console.warn("edit ", editId);
    editId = undefined;
  });

  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.delete-btn")) {
      const id = e.target.dataset.id;
      deleteTeamRequest(id);
      window.location.reload();
    } else if (e.target.matches("a.edit-btn")) {
      e.preventDefault();
      // const id = e.target.getAttribute("data-id");
      const id = e.target.dataset.id;
      startEdit(allTeams, id);
    }
  });
}

initEvents();
loadTeams();
