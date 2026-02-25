(async function () {
  try {
    const articlesJSON = await fetch("assets/articles.json");
    const articles = await articlesJSON.json();

    const list = document.getElementById("fieldnotes-list");

    const buttons = [];
    for (const article of articles) {
      const button = document.createElement("button");
      button.classList = "article-button";
      button.onclick = async function () {
        const articleMD = await fetch(`assets/${article.slug}`);
        let articleText = await articleMD.text();
        // Remove the front matter
        articleText = articleText.replace(/^-+\r?\n[\s\S]*?\r?\n-+\r?\n?/, "");

        document.getElementById("article-panel").innerHTML =
          marked.parse(articleText);
      };

      const subtitle = document.createElement("div");
      subtitle.classList = "subtitle";
      subtitle.innerText = article.date;
      button.appendChild(subtitle);

      const title = document.createElement("div");
      title.classList = "article-header";
      title.innerText = article.title;

      button.appendChild(title);
      buttons.push(button);
    }

    for (const button of buttons) {
      list.appendChild(button);
      list.appendChild(document.createElement("hr"));
    }

    // Default to the first article in the list
    buttons[0].click();
  } catch (articleListErr) {
    console.error("Article list error", articleListErr);
  }
})();
