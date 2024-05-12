let scoresHistory = localStorage.getItem("scoresHistory")
  ? JSON.parse(localStorage.getItem("scoresHistory"))
  : [];

function drawModal(content) {
  let modal = document.createElement("div");
  modal.id = "modal";
  document.body.appendChild(modal);
  modal.innerHTML = `
        <div id="modal-content">
            <span id="close">&times;</span>
            ${content}
        </div>
    `;
  document.getElementById("close").addEventListener("click", function (event) {
    document.getElementById("modal")?.remove();
  });
}

let n =
    scoresHistory.length > 0 ? scoresHistory[scoresHistory.length - 1].n : 0,
  v = scoresHistory.length > 0 ? scoresHistory[scoresHistory.length - 1].v : 0;

let pendingVScore, pendingNScore;
let prevVScore = null,
  prevNScore = null;

renderScore(n, v);

document.querySelectorAll("input[type=checkbox]").forEach(function (e) {
  e.addEventListener("change", function (event) {
    let team = e.id[0];
    if (e.id.startsWith("belote")) {
      if (e.checked) {
        let letter = e.id.split("-")[1] === "n" ? "v" : "n";
        let otherbelote = document.getElementById("belote-" + letter);
        if (otherbelote.checked) {
          otherbelote.checked = false;
        }
      }
    }
    if (e.checked) {
      if (e.id[0] == "n") {
        //uncheck all n
        document.querySelectorAll("input[id^=n]").forEach(function (e) {
          e.checked = false;
        });
        //disable number input for n
        document.getElementById("score-n").disabled = true;
      } else if (e.id[0] == "v") {
        //uncheck all v
        document.querySelectorAll("input[id^=v]").forEach(function (e) {
          e.checked = false;
        });
        //disable number input for v
        document.getElementById("score-v").disabled = true;
      }
      e.checked = true;

      let name = e.id.split("-")[1];
      let pendingScore;
      switch (name) {
        case "contre":
          pendingScore = 320;
          break;
        case "surcontre":
          pendingScore = 640;
          break;
        case "capot":
          pendingScore = 500;
          break;
        case "capotarabe":
          pendingScore = 250;
          break;
        case "dedans":
          pendingScore = 160;
          break;
      }
      if (team == "n") {
        pendingNScore = pendingScore;
      } else if (team == "v") {
        pendingVScore = pendingScore;
      }
    } else {
      if (e.id[0] == "n") {
        //enable number input for n
        document.getElementById("score-n").disabled = false;
        pendingNScore = document.getElementById("score-n").value;
      } else if (e.id[0] == "v") {
        //enable number input for v
        document.getElementById("score-v").disabled = false;
        pendingVScore = document.getElementById("score-v").value;
      }
    }
  });
});

document.getElementById("score-n").addEventListener("input", function (event) {
  pendingNScore = event.target.value;
});

document.getElementById("score-v").addEventListener("input", function (event) {
  pendingVScore = event.target.value;
});

document
  .getElementById("add-score-v")
  .addEventListener("click", function (event) {
    if (pendingVScore) {
      prevNScore = n;
      prevVScore = v;
      v += parseInt(pendingVScore);
      if (!document.getElementById("score-v").disabled) {
        if (document.getElementById("v-case").value === "case") {
          n += 170 - pendingVScore;
        } else {
          n += 160 - pendingVScore;
        }
      }
      if (document.getElementById("belote-n").checked) {
        if (pendingVScore > 250) {
          v += 20;
        } else {
          n += 20;
        }
      }
      if (document.getElementById("belote-v").checked) {
        v += 20;
      }

      localStorage.setItem("v", v);
      localStorage.setItem("n", n);
      scoresHistory.push({ n, v });
      localStorage.setItem("scoresHistory", JSON.stringify(scoresHistory));
      renderScore(n, v);
      //uncheck all v
      document.querySelectorAll("input[id^=v]").forEach(function (e) {
        e.checked = false;
      });
      //empty number input for v
      document.getElementById("score-v").value = "";
      document.getElementById("score-v").disabled = false;

      document.getElementById("undo").disabled = false;
    }
  });

document
  .getElementById("add-score-n")
  .addEventListener("click", function (event) {
    if (pendingNScore) {
      prevVScore = v;
      prevNScore = n;
      n += parseInt(pendingNScore);
      if (!document.getElementById("score-n").disabled) {
        if (document.getElementById("n-case").value === "case") {
          v += 170 - parseInt(pendingNScore);
        } else {
          v += 160 - parseInt(pendingNScore);
        }
      }
      if (document.getElementById("belote-v").checked) {
        if (pendingNScore > 250) {
          n += 20;
        } else {
          v += 20;
        }
      }
      if (document.getElementById("belote-n").checked) {
        n += 20;
      }
      localStorage.setItem("n", n);
      localStorage.setItem("v", v);
      scoresHistory.push({ n, v });
      localStorage.setItem("scoresHistory", JSON.stringify(scoresHistory));
      renderScore(n, v);
      //uncheck all n
      document.querySelectorAll("input[id^=n]").forEach(function (e) {
        e.checked = false;
      });
      //empty number input for n
      document.getElementById("score-n").value = "";
      document.getElementById("score-n").disabled = false;

      document.getElementById("undo").disabled = false;
    }
  });

if (scoresHistory.length === 0) document.getElementById("undo").disabled = true;

document.getElementById("undo").addEventListener("click", function (event) {
  //if (prevNScore !== null && prevVScore !== null) {
  if (scoresHistory.length > 0) {
    scoresHistory = scoresHistory.slice(0, scoresHistory.length - 1);
    if (scoresHistory.length === 0) {
      n = 0;
      v = 0;
    } else {
      n = scoresHistory[scoresHistory.length - 1].n;
      v = scoresHistory[scoresHistory.length - 1].v;
    }
    localStorage.setItem("n", n);
    localStorage.setItem("v", v);
    localStorage.setItem("scoresHistory", JSON.stringify(scoresHistory));
    renderScore(n, v);
  }
  if (scoresHistory.length == 0) {
    event.target.disabled = true;
  }
});

document.getElementById("reset").addEventListener("click", function (event) {
  if (n == 0 && v == 0) {
    return;
  }
  prevNScore = n;
  prevVScore = v;
  n = 0;
  v = 0;
  localStorage.setItem("n", n);
  localStorage.setItem("v", v);
  document.getElementById("undo").disabled = true;
  scoresHistory = [];
  localStorage.setItem("scoresHistory", JSON.stringify(scoresHistory));
  renderScore(n, v);
});

function renderScore(n, v) {
  document.getElementById("display-n-score").innerHTML = n;
  document.getElementById("display-v-score").innerHTML = v;
}

function getScoresInHistoryUntilLatestReset() {
  if (scoresHistory.length === 0) {
    return [];
  }
  let latestResetIndex = scoresHistory.length - 1;
  while (
    latestResetIndex >= 0 &&
    (scoresHistory[latestResetIndex].n > 0 ||
      scoresHistory[latestResetIndex].v > 0)
  ) {
    latestResetIndex--;
  }
  return scoresHistory.slice(latestResetIndex + 1);
}

function renderHistoryUntilLatestReset() {
  let scores = getScoresInHistoryUntilLatestReset();
  const contentIfEmpty = scores.length === 0 ? "No history" : "";
  return `
    <div class="history-table">
            ${
              contentIfEmpty
                ? contentIfEmpty
                : `
            <ul>
                <span class='history-score-title'>Score N</span>
                ${scores.map((score) => `<li>${score.n}</li>`).join("")}
            </ul>
            <ul> 
                <span class='history-score-title'>Score V</span>
                ${scores.map((score) => `<li>${score.v}</li>`).join("")}
            </ul>`
            }
    </div>
    `;
}
function drawHistory() {
  drawModal(renderHistoryUntilLatestReset());
}

document.getElementById("history-show").addEventListener("click", drawHistory);
