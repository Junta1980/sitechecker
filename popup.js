import { getHeding, getImg, getGeneral, getLink } from "./content.js";
import {getReport} from "./content.report.js"

let storedResponse;

const setHtml = (response, type) => {
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
    document.getElementById("results").innerHTML = getLink(response, type);

    document.querySelectorAll(".links").forEach((item) => {
      item.addEventListener("click", () => {
        const type = item.getAttribute("data-target");
        document
          .querySelectorAll(".links")
          .forEach((el) => el.classList.remove("active"));

        item.classList.add("active");
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
  console.log("checkCeo", tab);
  chrome.tabs.sendMessage(tab.id, { action: "getSEOData" }, (response) => {
    storedResponse = response;
    setHtml(response, "General");
    console.log(response);
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
