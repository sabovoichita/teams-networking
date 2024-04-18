//import { debounce } from "lodash"; // imports too much code...
import debounce from "lodash/debounce"; // improved import
import "./style.css";
import { $, mask, unmask } from "./utilities";
import { loadTeamsRequest, createTeamRequest, deleteTeamRequest, updateTeamRequest } from "./middleware";

let editId;
let allTeams = [];

const formSelector = "#teamsForm";

function getTeamAsHTML({ id, promotion, members, name, url }) {
  const displayUrl = url.startsWith("https://github.com/") ? url.substring(19) : url;
  return `
  <tr>
  <td>${promotion}</td>
    <td>${members}</td>
    <td>${name}</td>
  <td><a href="${url}" target="_blank">${displayUrl}</a>
</td><td>
<a href ="#" data-id="${id}" class="action-btn delete-btn">✖</a>
  <a href ="#" data-id="${id}" class="action-btn edit-btn">&#9998;</a></tr>`;
}

function areTeamsEquals(renderedTeams, teams) {
  if (renderedTeams === teams) {
    console.info("same array");
    return true;
  }
  if (renderedTeams.length === teams.length) {
    const eq = renderedTeams.every((team, i) => team === teams[i]);
    if (eq) {
      console.info("same content in different arrays");
      return true;
    }
  }
  return false;
}

let renderedTeams = [];
function renderTeams(teams) {
  //console.time("eq-check");
  if (areTeamsEquals(renderedTeams, teams)) {
    //console.timeEnd("eq-check");
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
  const teams = await loadTeamsRequest();
  allTeams = teams;
  renderTeams(teams);
}

function updateTeam(teams, team) {
  return teams.map(t => {
    if (t.id === team.id) {
      //console.info("edited", t, team);
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
  mask(formSelector);
  let team = getFormValues();
  if (editId) {
    team.id = editId;
    console.warn("should we edit?", editId, team);
    const status = await updateTeamRequest(team);
    if (status.success) {
      allTeams = updateTeam(allTeams, team);
      renderTeams(allTeams);
      $("#teamsForm").reset();
    }
    unmask(formSelector);
  } else {
    createTeamRequest(team).then(status => {
      console.warn("status", status);
      if (status.success) {
        team.id = status.id;
        //allTeams = allTeams.map(team => team);
        //allTeams.push(team);
        allTeams = [...allTeams, team];
        renderTeams(allTeams);
        $("#teamsForm").reset();
      }
      unmask(formSelector);
    });
  }
}

function startEdit(id) {
  editId = id;
  const team = allTeams.find(team => team.id === id);
  console.warn("edit", id, team);
  setFormValues(team);
}

function setFormValues({ promotion, members, name, url }) {
  $("input[name=promotion]").value = promotion;
  $("input[name=members]").value = members;
  $("input[name=name]").value = name;
  $("input[name=url]").value = url;
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
    }, 500)
  );

  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#search").addEventListener("reset", () => {
    console.warn("reset ", editId);
    editId = undefined;
  });

  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.delete-btn")) {
      console.log("e.target", e.target.dataset.id);
      const { id } = e.target.dataset;
      mask(formSelector);
      deleteTeamRequest(id).then(status => {
        if (status.success) {
          allTeams = allTeams.filter(team => team.id !== id);
          renderTeams(allTeams);
        }
        unmask(formSelector);
      });
    } else if (e.target.matches("a.edit-btn")) {
      e.preventDefault();
      // const id = e.target.getAttribute("data-id");
      const { id } = e.target.dataset;
      startEdit(id);
    }
  });
}

initEvents();
mask(formSelector);
loadTeams().then(() => {
  console.timeEnd("app-ready");
  unmask(formSelector);
});
// - this code blockes the main thread
// await loadTeams();
// console.timeEnd("app-ready");

console.info("end...");
