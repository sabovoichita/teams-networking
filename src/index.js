import { debounce } from "lodash"; //imports too much code
// import { debounce } from "lodash/debounce"; //improved import
import "./style.css";
import { $ } from "./utilities";
import { loadTeamRequest, createTeamRequest, deleteTeamRequest, updateTeamRequest } from "./middleware";

let allTeams = [];
let editId;

function getTeamAsHTML({ id, promotion, members, name, url }) {
  const displayUrl = url.startsWith("https://github.com/") ? url.substring(19) : url;

  return `
  <tr>
    <td>${promotion}</td>
    <td>${members}</td>
    <td>${name}</td>
    <td>
      <a href="${url}" target="_blank">${displayUrl}</a>
    </td>
    <td>
      <button type="button" data-id="${id}" class="edit-btn action-btn">✎</button>
      <button type="button" data-id="${id}" class="delete-btn action-btn">♻</button>
    </td>
  </tr>
  `;
}

function areTeamsEquals(renderedTeams, teams) {
  if (renderedTeams === teams) {
    console.info("same array");
    return true;
  }
  if (renderedTeams.length === teams.length) {
    const eq = renderedTeams.every((team, i) => team === teams[i]);
    if (eq) {
      console.warn("same content in diferent arrays");
      return true;
    }
    return false;
  }
}
let renderedTeams = [];
function renderTeams(teams) {
  // console.time("eq-check");
  if (areTeamsEquals(renderedTeams, teams)) {
    // console.timeEnd("eq-check");
    return;
  }
  // console.timeEnd("eq-check");
  renderedTeams = teams;
  console.time("render");
  const teamsHTML = teams.map(getTeamAsHTML);
  $("#teamsTable tbody").innerHTML = teamsHTML.join("");
  console.timeEnd("render");
}

async function loadTeams() {
  const teams = await loadTeamRequest();
  allTeams = teams;
  renderTeams(teams);
}

function updateTeam(teams, team) {
  return teams.map(t => {
    if (t.id === team.id) {
      console.info("edited", t, team);
      return {
        ...t,
        ...team
      };
    }
    return t;
  });
}

async function onSubmit(e) {
  e.preventDefault();

  const team = getTeamValues();
  if (editId) {
    team.id = editId;
    console.warn("Should edit?", editId, team);

    const status = await updateTeamRequest(team);
    if (status.success) {
      allTeams = updateTeam(allTeams, team);
      renderTeams(allTeams);
      $("#teamsForm").reset();
    }
  } else {
    createTeamRequest(team).then(status => {
      console.warn("ready status", status, team);
      if (status.success) {
        // window.location.reload();
        team.id = status.id;
        // allTeams = allTeams.map(team => team);
        // allTeams.push(team);
        allTeams = [...allTeams, team];
        renderTeams(allTeams);
        $("#teamsForm").reset();
      }
    });
  }
}

function startEdit(id) {
  editId = id;
  const team = allTeams.find(team => team.id === id);
  console.log("edit", id, team);
  setTeamValues(team);
}

function setTeamValues({ promotion, members, name, url } = team) {
  $("input[name=promotion]").value = promotion;
  $("input[name=members]").value = members;
  $("input[name=name]").value = name;
  $("input[name=url]").value = url;
}

function getTeamValues() {
  const promotion = $("input[name=promotion]").value;
  const members = $("input[name=members]").value;
  const name = $("input[name=name]").value;
  const url = $("input[name=url]").value;
  return {
    promotion,
    members,
    name,
    url
  };
}

function filterElements(teams, search) {
  search = search.toLowerCase();
  // console.warn("search %o", search);
  return teams.filter(({ promotion, members, name, url }) => {
    return (
      promotion.toLowerCase().includes(search) ||
      members.toLowerCase().includes(search) ||
      name.toLowerCase().includes(search) ||
      url.toLowerCase().includes(search)
    );
  });
}

function initEvents() {
  $("#search").addEventListener(
    "input",
    debounce(e => {
      const search = e.target.value;
      console.info("search %o", search);
      const teams = filterElements(allTeams, search);
      renderTeams(teams);
    }, 200)
  );

  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsForm").addEventListener("reset", () => {
    console.log("reset", editId);
    editId = undefined;
  });

  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("button.delete-btn")) {
      const { id } = e.target.dataset;
      deleteTeamRequest(id).then(status => {
        // console.warn("ready? ", status);
        if (status.success) {
          allTeams = allTeams.filter(team => team.id !== id);
          renderTeams(allTeams);
        }
      });
    } else if (e.target.matches("button.edit-btn")) {
      const { id } = e.target.dataset;
      startEdit(id);
    }
  });
}
initEvents();
loadTeams().then(() => {
  console.timeEnd("app-ready");
});

//This code blocks the main thread
// await loadTeams();
// console.timeEnd("app-ready");

console.info("end...");
