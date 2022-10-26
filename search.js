const searchFrom = document.querySelector(".search");
const input = document.querySelector(".input");
const articleList = document.querySelector(".list");

searchFrom.addEventListener("submit", searchTopic);

function searchTopic(e) {
  e.preventDefault();
  let topic = input.value;
  let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${topic}&limit=25&apikey=Y7EZGMG4B18PRI2S`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      data.feed.forEach((feed) => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.setAttribute("href", feed.url);
        a.setAttribute("target", "_blank");
        a.textContent = feed.title;
        li.appendChild(a);
        articleList.appendChild(li);
      });
    });
}

function pastTopics() {
  let pastArticles = input.value;
  let articles = [];
  localStorage.setItem("pastArticles", JSON.stringify(pastArticles));
  console.log(pastArticles);
  articles.push(...pastArticles);
}

searchFrom.addEventListener("submit", pastTopics);
