function imgError(object) {
    if (object.src !== "buttons/fallback.gif") {
        console.log("Error loading image for", object.src);
        object.src = "buttons/fallback.gif";
        object.onerror = "";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".neobutton a").forEach(function (element) {
        var bgColor = element.getAttribute("data-bg");
        var fgColor = element.getAttribute("data-fg");
        if (bgColor) {
            element.style.setProperty("--tooltip-bg-color", bgColor);
        }
        if (fgColor) {
            element.style.setProperty("--tooltip-fg-color", fgColor);
        }
    });
    fetch('./buttons.json')
        .then(response => response.json())
        .then(data => {
            let html = "";
            data.forEach(section => {
                const sectionName = Object.keys(section)[0];
                const items = section[sectionName];
                html += `<p>${sectionName}</p>\n`;
                items.forEach(item => {
                    if (item.href) {
                        html += `<a href="${item.href}" target="_blank"`;
                        if (item.tooltip) html += ` data-tooltip="${item.tooltip}"`;
                        if (item.bg) html += ` data-bg="${item.bg}" style="--tooltip-bg-color: ${item.bg};"`;
                        if (item.fg) html += ` data-fg="${item.fg}" style="--tooltip-fg-color: ${item.fg};"`;
                        html += ">";
                    }
                    html += `<img src="${item.img}"${item.alt ? ` alt="${item.alt}"` : `${this.img}`} onerror="imgError(this)">`;
                    if (item.href) {
                        html += `</a>`;
                    }
                    html += "\n";
                });
            });
            document.querySelector(".neobutton").innerHTML = html;
        });
});