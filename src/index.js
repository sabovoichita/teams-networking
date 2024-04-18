import { debounce } from "./utilities";
import "./style.css";

let editId;
let allTeams = [];

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
  }).then(r => r.json());
}

function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  }).then(r => r.json());
}

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function getTeamAsHTML(team) {
  const url = team.url;
  const displayUrl = url.startsWith("https://github.com/") ? url.substring(19) : url;
  return `
  <tr>
  <td>${team.promotion}</td>
  <td>${team.members}</td>
  <td>${team.name}</td>
  <td><a href="${url}" target="_blank">${displayUrl}</a>
</td><td>
  <a href ="#" data-id="${team.id}" class="action-btn delete-btn">✖</a>
  <a href ="#" data-id="${team.id}" class="action-btn edit-btn">&#9998;</a>
  </td>
</tr>`;
}

function renderTeams(teams) {
  const teamsHTML = teams.map(getTeamAsHTML);

  $("#teamsTable tbody").innerHTML = teamsHTML.join("");
}

function loadTeams() {
  fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      allTeams = teams;
      renderTeams(teams);
      console.timeEnd("app-ready");
    });
}

function onSubmit(e) {
  e.preventDefault();
  let team = getFormValues();
  if (editId) {
    team.id = editId;
    console.warn("should we edit?", editId, team);
    updateTeamRequest(team).then(status => {
      // console.warn("status", status);
      if (status.success) {
        window.location.reload();
      }
    });
  } else {
    createTeamRequest(team).then(status => {
      // console.warn("status", status);
      window.location.reload();
    });
  }
}

function startEdit(id) {
  editId = id;
  const team = allTeams.find(team => team.id === id);
  console.warn("edit", id, team);
  setFormValues(team);
}

function setFormValues(team) {
  $("input[name=promotion]").value = team.promotion;
  $("input[name=members]").value = team.members;
  $("input[name=name]").value = team.name;
  $("input[name=url]").value = team.url;
}

function getFormValues() {
  const promotion = $("input[name=promotion]").value;
  const members = $("input[name=members]").value;
  const name = $("input[name=name]").value;
  const url = $("input[name=url]").value;
  return {
    promotion: promotion,
    members: members,
    name,
    url
  };
}

// function onSearch(e) {
//   const query = e.target.value.toLowerCase();
//   const queries = query.split(/\s*,\s*/).filter(q => q);
//   console.warn(queries);
//   if (!queries.length) {
//     renderTeams(allTeams);
//     return;
//   }
//   const teams = allTeams.filter(team => {
//     // console.info("filter", team, queries);
//     return queries.some(q => {
//       // console.info(" q %o", q, team.name);
//       return (
//         team.promotion.toLowerCase().includes(q) ||
//         team.members.toLowerCase().includes(q) ||
//         team.name.toLowerCase().includes(q) ||
//         team.url.toLowerCase().includes(q)
//       );
//     });
//   });
//   renderTeams(teams);
// }

function filterElements(teams, search) {
  search = search.toLowerCase();
  //console.warn("search %o", search);
  return teams.filter(team => {
    return (
      team.promotion.toLowerCase().includes(search) ||
      team.members.toLowerCase().includes(search) ||
      team.name.toLowerCase().includes(search) ||
      team.url.toLowerCase().includes(search)
    );
  });
}

function initEvents() {
  // $("#search").addEventListener("input", debounce(onSearch, 500));

  $("#search").addEventListener("input", e => {
    const search = e.target.value;
    const teams = filterElements(allTeams, search);
    renderTeams(teams);
  });

  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#search").addEventListener("reset", () => {
    console.warn("reset ", editId);
    editId = undefined;
  });

  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.delete-btn")) {
      console.log("e.target", e.target.dataset.id);
      const id = e.target.dataset.id;
      deleteTeamRequest(id).then(status => {
        if (status.success) {
          window.location.reload();
          // allTeams = allTeams.filter(team => team.id !== id);
          // renderTeams(allTeams);
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      e.preventDefault();
      // const id = e.target.getAttribute("data-id");
      const id = e.target.dataset.id;
      startEdit(id);
    }
  });
}

initEvents();
loadTeams();
