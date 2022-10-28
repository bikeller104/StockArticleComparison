// selectors
var themeSwitcher = document.querySelector("#theme-switcher");
var page = document.querySelector(".page");
var submitBtn = document.getElementById("submit-btn");
var input = document.getElementById("#search-box");
var articleList = document.querySelector(".list");
var searchHistory = document.querySelector(".past-searches");
var topic = "";
var topicsArray = [];
var tickersArray = [];
var dateStartValue = "";
var dateEndValue = "";
var url = "";
var modeDefault = "dark";
// var queryString = "";

// Date Picker Functionality
var datePickerStart = document.getElementById("start-date");
var datePickerSubBtn = document.getElementById("date-start-btn");
var start = datepicker(".start", {
  id: 1,
  formatter: (input, date, instance) => {
    const value = date.toLocaleDateString("sv").replaceAll("-", "");
    input.value = value;
  },
});
var end = datepicker(".end", {
  id: 1,
  formatter: (input, date, instance) => {
    const value = date.toLocaleDateString("sv").replaceAll("-", "");
    input.value = value;
  },
});
// Submit to Results webpage
function submitKeyClick(e) {
  e.preventDefault();
  symbolLookup();
  pageSwitcher();
}
function symbolLookup() {
  let topic = document.getElementById("search-box").value;
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
  let dateStartValue = `${document.querySelector(".start").value}T0000`;
  let dateEndValue = `${document.querySelector(".end").value}T0000`;
  if (data.bestMatches.length == 0) {
    let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${topic}&time_from=${dateStartValue}&time_to=${dateEndValue}&apikey=Y7EZGMG4B18PRI2S`;
    topicsArray.push(topic);
    localStorage.setItem("topics", JSON.stringify(topicsArray));
    getArticles(url);
  } else {
    let ticker = data.bestMatches[0].symbol;
    let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&ticker=${ticker}&time_from=${dateStartValue}&time_to=${dateEndValue}&apikey=Y7EZGMG4B18PRI2S`;
    tickersArray.push(ticker);
    localStorage.setItem("tickers", JSON.stringify(tickersArray));
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
      localStorage.setItem("articles", JSON.stringify(data));
    });
}
function pageSwitcher() {
  var queryString = `./results.html?=${topic}+${dateStartValue}+${dateEndValue}+`;
  location.assign(queryString);
}

//saves searches to local storage and generates button to redo search
// function pastTopics() {
//   let pastArticlesData = input.value;
//   let pastArticles = [];
//   localStorage.setItem("pastArticles", JSON.stringify(pastArticlesData));

//   var storedArticles = JSON.parse(localStorage.getItem("pastArticles"));
//   if (storedArticles) {
//     pastArticles.push(storedArticles);
//   }
//   console.log(pastArticles);
//   if (storedArticles.length) {
//     pastArticles.forEach((e) => {
//       let historyButton = document.createElement("button");
//       searchHistory.appendChild(historyButton);
//       historyButton.textContent = e;
//       historyButton.setAttribute("class", "button");
//     });
//   }
// }

//event listeners
// submitBtn.addEventListener("submit", pastTopics);
submitBtn.addEventListener("click", submitKeyClick);
submitBtn.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitKeyClick(e);
  }
});
themeSwitcher.addEventListener("click", function () {
  if (modeDefault === "dark") {
    modeDefault = "light";
    page.setAttribute("class", "light");
  } else {
    modeDefault = "dark";
    page.setAttribute("class", "dark");
  }
});

// arranged contents.  Global variables top, listeners bottom, functions in order
//renamed function submitKeyClick and added enter key functionality
//submitKeyClick now calls function to switch to results page
//removed redundant event listeners and ran out of API calls
