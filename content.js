import {
  getClass,
  getClassLengthMoreThenZero,
  getClassLengthEqualZero,
  getIcon,
  getMetaLength,
  getTitleLength,
  getIndent,
} from "./utils.js";

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const addClick = async () => {
  const tab = await getCurrentTab();
  document.querySelectorAll(".imgAltLazy").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-target");
      chrome.tabs.sendMessage(
        tab.id,
        { action: "HighligthImmage", src: src },
        (resp) => {
          console.log("Response:", resp);
        }
      );
    });
  });
};

function getImageNoAltLazy(imgAltLazy) {
  const div = `${imgAltLazy
    .map(
      (img) =>
        ` <div class="img-no-alt"  style="display:flex; gap:10px; align-items:center">
          <img style="max-width: 80px;" src="${img.src}"/>
          <div class="imgAltLazy" data-target="${img.src}"> ❌ ${img.src}</div>
      </div>`
    )
    .join("")}`;
  addClick();
  return div;
}

function getHeading(response) {
  return ` ${response.headings
    .map(
      (h) => `<li style="margin-left: ${getIndent(h.tag)}px;">
        <strong>${h.tag.toUpperCase()}</strong>: ${h.text} </li>`
    )
    .join("")}`;
}

export const getLink = (response, type = "link-internal") => {
  let header = `
  <div  style="display:flex; gap:10px; align-items:center">
        <div class="links" data-target="link-internal">
            <strong class="${getClassLengthEqualZero(
          (response.internalLinks || []).length
        )}">Internal Links Number:</strong> ${
    (response.internalLinks || []).length
  }</div>
  <div class="links"  data-target="link-external">
        <strong class="${getClassLengthEqualZero(
              (response.externalLinks || []).length
            )}">External Links Number:</strong> ${
    (response.externalLinks || []).length
  }</div>
  </div>
    `;

  let html;
  if (type == "link-internal") {
    html = ` <div style="display:flex; gap:10px;flex-direction: column;">
         ${response.internalLinks

           .map((l) => ` <a href="${l}" target="_blank">${l}</a>`)
           .join("")}
           <div>`;
  }

  if (type == "link-external") {
    html = `  <div style="display:flex; gap:10px; flex-direction: column;">
         ${response.externalLinks

           .map((l) => ` <a href="${l}" target="_blank">${l}</a>`)
           .join("")}
           <div>`;
  }

  return header + html;
};

export const getHeding = (response) => {
  return `
    <ul> 
    ${getHeading(response)}
 </ul>`;
};

export const getImg = (response) => {
  const imgNoAlt = response.imgValidation.filter( img => !img.isAltValid);
  const imgNoLazy = response.imgValidation.filter( img => !img.hasLazy)
  
  const noAlt = `<p><strong class="${getClassLengthMoreThenZero(
    (imgNoAlt|| []).length
  )}">Missing Alt <span style="font-size: 15px;font-weight: 300;">(N°: ${
    (imgNoAlt|| []).length
  })</span> :</strong></p>
    ${getImageNoAltLazy(imgNoAlt)}`;

  const noLazy = `<p><strong class="${getClassLengthMoreThenZero(
    (imgNoLazy|| []).length
  )}">Missing Lazy <span style="font-size: 15px;font-weight: 300;">(N°: ${
    (imgNoLazy|| []).length
  })</span> :</strong></p>
    ${getImageNoAltLazy(imgNoLazy)}`;

return noAlt + noLazy;
};

export const getGeneral = (response) => {
  return `
    <p><strong class="${getClass(response.title)}">Title:</strong> 
     <div style="margin:10px"> ${getIcon(response.title)}  ${
    response.title
  }</div>
     ${
       response.title != "None"
         ? `<div style="margin-left:10px">${getTitleLength(
             response.title?.length
           )}</div>`
         : ""
     }
    </p>
    <p><strong class="${getClass(response.meta)}">Meta description:</strong> 
    <div style="margin:10px"> ${getIcon(response.meta)}  ${response.meta}</div>
     ${
       response.meta != "None"
         ? `<div style="margin-left:10px">${getMetaLength(
             response.meta?.length
           )}</div>`
         : ""
     }
    </p>
    <p><strong class="${getClass(response.h1Exist)}">  
    H1 heading:</strong></p>
    <div style="margin:10px"> ${getIcon(response.h1Exist)}  ${
    response.h1Exist
  }</div>
    <div style="margin:10px">
    ${
      response.multipleH1 != 0
        ? response.multipleH1 > 1
          ? "<div>❌ Multiple H1 </div>"
          : "<div>✅ ok only one H1</div>"
        : ""
    }
    </div>
    <p><strong  class="${getClass(response.h1Exist)}">Canonical:</strong></p>
     <div style="margin:10px"> ${getIcon(response.canonical)}  ${
    response.canonical
  }</div>
     
    <p>
    <strong>Word Count:</strong> ${response.wordCount}
    </p>
     `;
};
