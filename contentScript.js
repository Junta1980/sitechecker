(() => {
  collectSEOData();
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function validateLDJSONBlocks() {
  const scripts = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]')
  );

  return scripts.map((script, index) => {
    try {
      const json = JSON.parse(script.textContent);

      const hasContext = json["@context"] !== undefined;
      const hasType = json["@type"] !== undefined;
      const hasgraph = json["@graph"] !== undefined;

      return {
        index,
        valid: true,
        error: "",
        hasContext,
        hasType,
        hasgraph,
        content: json,
      };
    } catch (err) {
      return {
        index,
        valid: false,
        error: err.message,
        hasContext: false,
        hasType: false,
        hasgraph: false,
        content: script.textContent.slice(0, 200),
      };
    }
  });
}

async function getSeo(sendResponse) {

  const title = document.title || "None";
  const meta =
    document.querySelector("meta[name='description']")?.content || "None";
  const h1Elem = document.querySelector("h1");
  const h1Exist = h1Elem ? h1Elem.innerText : "None";
  const img = Array.from(document.querySelectorAll("img"));
  const imgValidation = img
    .filter(
      (img) => !img.style?.cssText.includes("none") && img.width != 0
    )
    .map((img) => {
      const loading = img.getAttribute("loading") || "";
      const alt = img.getAttribute("alt") || "";
      return {
        src: img.src,
        width: img.width,
        height: img.height,
        isAltValid: alt.trim().length > 3,
        hasLazy: loading === "lazy",
        loading: loading,
        alt: alt,
        tag: img.outerHTML.slice(0, 100),
      };
    });

  const allLinks = Array.from(document.querySelectorAll("a[href]")).map(
    (a) => a.href
  );
  const internalLinks = allLinks.filter((link) =>
    link.includes(location.hostname)
  );
  const externalLinks = allLinks.filter(
    (link) => !link.includes(location.hostname)
  );

  const bodyText = document.body.innerText.trim();
  const wordCount = bodyText.split(/\s+/).length;

  const h1Count = document.querySelectorAll("h1").length;
  const multipleH1 = h1Count;
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(500);
  const headings = Array.from(
    document.querySelectorAll("h1, h2, h3")
  ).map((el) => ({
    tag: el.tagName.toLowerCase(),
    text: el.innerText.trim(),
  }));
  window.scrollTo(0, 0);

  const canonical =
    document.querySelector("link[rel='canonical']")?.href || "None";

  const DJSONBlocks = validateLDJSONBlocks();

  sendResponse({
    title,
    meta,
    h1Exist,
    imgValidation,
    wordCount,
    multipleH1,
    internalLinks,
    externalLinks,
    canonical,
    headings,
    DJSONBlocks,
  });

}

function collectSEOData() {
  chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
    console.log("Ricevuto messaggio:", obj);

    if (obj.action === "getSEOData") {
      getSeo(sendResponse);
    }

    if (obj.action === "HighligthImmage") {
      const img = document.querySelector(`img[src="${obj.src}"]`);
      img.style.border = "5px solid red";
      modal(img.getBoundingClientRect())
      scrollToSection(img)

    }

    return true;
  });

  function scrollToSection(img) {
    img.scrollIntoView({ behavior: 'smooth' });
  }

}

function modal(position) {
  const modal = document.createElement("div");
  modal.classList.add("modal-image");
  modal.style.position = "fixed";
  modal.innerHTML = `<div> Img No Alt </div> `
  modal.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

  modal.style.background = "white";
  modal.style.border = "1px solid #ccc";
  modal.style.borderRadius = "12px";
  modal.style.padding = "10px";
  modal.style.visibility = "hidden";
  document.body.appendChild(modal);
  modal.style.top = position.top + "px";
  modal.style.left = (position.left - 10 -  modal.offsetWidth) + "px";
  modal.style.visibility = "visible";

  window.addEventListener("click", (e) => {
    if (!modal.contains(e.target) && e.target !== img) {
      modal.remove();
    }
  });
}
