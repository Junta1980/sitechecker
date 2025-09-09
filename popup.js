import { getHeding, getImg, getGeneral, getLink } from "./content.js";
import {getReport} from "./data.report.js"

let storedResponse;

function showLoader() {
  const resultsDiv = document.getElementById("results");

  // se il loader non esiste già, crealo
  if (!document.getElementById("loader")) {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.textContent = "⏳ Caricamento...";
    loader.style.margin = "10px 0";
    loader.style.fontWeight = "bold";
    loader.style.color = "#333";
    loader.style.fontSize = "18px";
    loader.style.textAlign = "center";

    resultsDiv.parentNode.insertBefore(loader, resultsDiv);
  }

  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.remove();
  }
}


const setHtml = async (response, type) => {
  let html;
  if (type == "General") {
    document.getElementById("results").innerHTML = getGeneral(response);
  }

  if (type == "img-no-alt") {
    document.getElementById("results").innerHTML = getImg(response);
  }

  if (type == "headings") {
    document.getElementById("results").innerHTML = getHeding(response);
  }

  if (type == "link-internal" || type == "link-external") {
    document.getElementById("results").innerHTML  = '';
    showLoader();
    document.getElementById("results").innerHTML = await getLink(response, type);
    hideLoader();

    document.querySelectorAll(".links").forEach((item) => {
      item.addEventListener("click", () => {
        const type = item.getAttribute("data-target");    
        setHtml(storedResponse, type);
      });
    });
  }


  if (type == "JSON-LD") {
    document.getElementById("results").innerHTML = '<div id="report"></div>';
    getReport(response.DJSONBlocks)
  }
};

(async () => {
  await checkCeo();
})();

async function checkCeo() {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, { action: "getSEOData" }, (response) => {
    storedResponse = response;
    setHtml(response, "General");
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-item")
      .forEach((el) => el.classList.remove("active"));

    item.classList.add("active");
    const type = item.getAttribute("data-target");
    setHtml(storedResponse, type);
  });
});



