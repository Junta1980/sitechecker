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

async function checkLink(url) {
  let linkOk = "";
  if (url.startsWith("mailto:")) return "📧";
  if (url.startsWith("tel:")) return "📞";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "⚠️";
  }
  try {
    const response = await fetch(url, { method: "HEAD" });
    response.ok ? (linkOk = "✅ ") : (linkOk = "❌ ");
  } catch (error) {
    linkOk = linkOk = "❌ ";
  }
  return linkOk;
}

export const getLink = async (response, type = "link-external") => {
  let header = `
  <div  style="display:flex; gap:10px; align-items:center">
    <div class="links ${
      type == "link-external" ? "active" : "noactive"
    }"  data-target="link-external">
          <strong class="${getClassLengthEqualZero(
            (response.externalLinks || []).length
          )}">External Links Number:</strong> ${
    (response.externalLinks || []).length
  }</div>
    <div class="links ${
      type == "link-external" ? "noactive" : "active"
    }" data-target="link-internal">
          <strong class="${getClassLengthEqualZero(
            (response.internalLinks || []).length
          )}">Internal Links Number:</strong> ${
    (response.internalLinks || []).length
  }</div>
  </div>
    `;

  let html;
  if (type == "link-internal") {
    const checkedLinks = await Promise.all(
      (response.internalLinks || []).map(async (l) => {
        const status = await checkLink(l);
        return `<div>${status} <a href="${l}" target="_blank">${l}</a></div>`;
      })
    );
    console.log(checkedLinks);
    html = `  <div style="display:flex; gap:10px; flex-direction: column;">
           ${checkedLinks.join("")}
           <div>`;
  }

  if (type == "link-external") {
    const checkedLinks = await Promise.all(
      (response.externalLinks || []).map(async (l) => {
        const status = await checkLink(l);
        return `<div>${status} <a href="${l}" target="_blank">${l}</a></div>`;
      })
    );
    console.log(checkedLinks);
    html = `  <div style="display:flex; gap:10px; flex-direction: column;">
           ${checkedLinks.join("")}
           </div>`;
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
  const imgNoAlt = response.imgValidation.filter((img) => !img.isAltValid);
  const imgNoLazy = response.imgValidation.filter((img) => !img.hasLazy);
  const report = `<div>
    <p><strong>Total img:</strong> ${
      (response.imgValidation || []).length
    }</p>  
    <div><strong>Total img no alt:</strong> ${(imgNoAlt || []).length}</div>
    <div><strong>Total img no lazy:</strong> ${(imgNoLazy || []).length}</div>
  </div>`;
  const noAlt = `<p><strong class="${getClassLengthMoreThenZero(
    (imgNoAlt || []).length
  )}">Missing Alt <span style="font-size: 15px;font-weight: 300;">(${
    (imgNoAlt || []).length
  })</span> :</strong></p>
    ${getImageNoAltLazy(imgNoAlt)}`;

  const noLazy = `<p><strong class="${getClassLengthMoreThenZero(
    (imgNoLazy || []).length
  )}">Missing Lazy <span style="font-size: 15px;font-weight: 300;">(${
    (imgNoLazy || []).length
  })</span> :</strong></p>
    ${getImageNoAltLazy(imgNoLazy)}`;

  return report + noAlt + noLazy;
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


