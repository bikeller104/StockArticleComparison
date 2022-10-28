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

// Date Picker Functionality
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

// Submit to Results webpage
var queryString = "./results.html"

submitBtn.addEventListener("click", submitResults);

function submitResults() {
  location.assign(queryString);
}

// Original Functionality Below
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

submitBtn.addEventListener("submit", pastTopics);