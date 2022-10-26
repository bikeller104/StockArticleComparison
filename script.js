const searchFrom = document.querySelector(".search");
const input = document.querySelector(".input");
const articleList = document.querySelector(".list");
const datePickerStart = document.getElementById("start-date");
const datePickerSubBtn = document.getElementById("date-start-btn");
const start = datepicker(".start", {
  id: 1,
  formatter: (input, date, instance) => {
    const value = date.toLocaleDateString("sv").replaceAll("-", "");
    input.value = value;
  },
});
const end = datepicker(".end", {
  id: 1,
  formatter: (input, date, instance) => {
    const value = date.toLocaleDateString("sv").replaceAll("-", "");
    input.value = value;
  },
});
const searchHistory = document.querySelector(".past-searches");

searchFrom.addEventListener("submit", searchTopic);

function searchTopic(e) {
  articleList.innerHTML = "";
  e.preventDefault();
  const dateStartValue = `${document.querySelector(".start").value}T0000`;
  const dateEndValue = `${document.querySelector(".end").value}T0000`;
  let topic = input.value;
  let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${topic}&time_from=${dateStartValue}&time_to=${dateEndValue}&apikey=Y7EZGMG4B18PRI2S`;

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

//saves searches to local storage and generates button to redo search
function pastTopics() {
  let pastArticlesData = input.value;
  let pastArticles = [];
  localStorage.setItem("pastArticles", JSON.stringify(pastArticlesData));

  var storedArticles = JSON.parse(localStorage.getItem("pastArticles"));
  if (storedArticles) {
    pastArticles.push(storedArticles);
  }
  console.log(pastArticles);
  if (storedArticles.length) {
    pastArticles.forEach((e) => {
      let historyButton = document.createElement("button");
      searchHistory.appendChild(historyButton);
      historyButton.textContent = e;
      historyButton.setAttribute("class", "button");
    });
  }
}

searchFrom.addEventListener("submit", pastTopics);
