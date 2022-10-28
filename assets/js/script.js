// Dark Light Mode Function
var themeSwitcher = document.querySelector("#theme-switcher");
var page = document.querySelector(".page");

var modeDefault = "dark";

themeSwitcher.addEventListener("click", function () {
  if (modeDefault === "dark") {
    modeDefault = "light";
    page.setAttribute("class", "light");
  } else {
    modeDefault = "dark";
    page.setAttribute("class", "dark");
  }
});

const submitBtn = document.getElementById("submit-btn");
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

submitBtn.addEventListener("click", symbolLookup);

function symbolLookup(e) {
  e.preventDefault();
  let topic = input.value;
  let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${topic}&apikey=Y7EZGMG4B18PRI2S`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      handleSearchRes(data);
    });
}

function handleSearchRes(data) {
  var url = "";
  console.log(data.bestMatches);
  const dateStartValue = `${document.querySelector(".start").value}T0000`;
  const dateEndValue = `${document.querySelector(".end").value}T0000`;
  if (data.bestMatches.length == 0) {
    let topic = input.value;
    let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${topic}&time_from=${dateStartValue}&time_to=${dateEndValue}&apikey=Y7EZGMG4B18PRI2S`;
    getArticles(url);
  } else {
    let ticker = data.bestMatches[0].symbol;
    let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&ticker=${ticker}&time_from=${dateStartValue}&time_to=${dateEndValue}&apikey=Y7EZGMG4B18PRI2S`;
    getArticles(url);
  }
}
function getArticles(url) {
  articleList.innerHTML = "";

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
function pastTopics(e) {
  e.preventDefault();
  console.log(localStorage.getItem("pastArticles"));
  let pastArticlesData = JSON.parse(localStorage.getItem("pastArticles"));
  //TODO: fix the display of duplicate values.
  // if (pastArticlesData.includes(input.value)) {
  //   return;
  // }
  if (!Array.isArray(pastArticlesData)) {
    pastArticlesData = [];
  }

  pastArticlesData.push(input.value);
  console.log(pastArticlesData);
  localStorage.setItem("pastArticles", JSON.stringify(pastArticlesData));

  searchHistory.innerHTML = "";
  if (pastArticlesData.length) {
    pastArticlesData.forEach((e) => {
      let historyButton = document.createElement("button");
      searchHistory.appendChild(historyButton);
      historyButton.textContent = e;
      historyButton.setAttribute("class", "button");
    });
  }

  function runSearch() {
    var searchValue = document.querySelector("button");
    input.value = searchValue.textContent;
  }
  historyButton.addEventListener("click", runSearch);
}

submitBtn.addEventListener("click", pastTopics);
