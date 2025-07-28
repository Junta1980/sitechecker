export const getReport = (validationResults) =>{
    const reportEl = document.getElementById("report");

    function createBlock(item) {
      const div = document.createElement("div");
      div.classList.add("block");
      div.classList.add(item.valid ? "valid" : "invalid");

      const header = document.createElement("div");
      header.classList.add("header");

      const title = document.createElement("h2");
      title.textContent = `Bloc ${item.index + 1} - Valid: ${item.valid ? "✅" : "❌"}`;
      header.appendChild(title);

      div.appendChild(header);

      const info = document.createElement("p");
      info.innerHTML = `
        <strong>@context</strong>: ${item.hasContext ? "✅" : "❌"}<br/>
        <strong>@type</strong>: ${item.hasType || item.hasgraph ? "✅" : "❌"}<br/>
        ${item.error ? `<strong>Errore:</strong> ${item.error}` : ""}
      `;
      div.appendChild(info);

      const pre = document.createElement("pre");
      pre.textContent = JSON.stringify(item.content, null, 2);
      div.appendChild(pre);

      return div;
    }

     validationResults.forEach(item => {
      reportEl.appendChild(createBlock(item));
    });
}