// selectors
var themeSwitcher = document.querySelector("#theme-switcher");
var page = document.querySelector(".page");
var submitBtn = document.getElementById("submit-btn");
var input = document.getElementById("search-box");
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
  clearHistoryButtons();
  pastTopics();
  symbolpromise = symbolLookup();
  symbolpromise.then((searchData) => {
    //console.log(searchData); 
    pageSwitcher(searchData );
  })
}
function clearHistoryButtons() {
  searchHistory.innerHTML = "";
  var historyButtonHead = document.createElement("h2");
  historyButtonHead.innerText = `Recent Searches`;
  searchHistory.appendChild(historyButtonHead);
}

function symbolLookup() {
  let topic = document.getElementById("search-box").value;
  if (topic) {
    let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${topic}&apikey=Y7EZGMG4B18PRI2S`;

    return fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        //console.log(data);
        return parseLookupData(data);
        //handleSearchRes(data);
      });
  }
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

/*
  this funciton takes the data returned from alphavantage symbol lookup and 
  parses it into a useable format
*/
function parseLookupData(data)
{
  searchData = new Object()
  searchData.startDate = `${document.querySelector(".start").value}T0000`;
  searchData.endDate = `${document.querySelector(".end").value}T0000`;
  searchData.topic = input.value;;
  searchData.ticker = "";
  //console.log(data.bestMatches);
  //console.log(data.bestMatches[0]);
  //console.log("BestMatchSymbol =>" + data.bestMatches[0]["1. symbol"]);
  if (!data.bestMatches.length == 0) searchData.ticker =data.bestMatches[0]["1. symbol"];
  return searchData;
}

function getArticles(url) {
  articleList.innerHTML = "";

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      //console.log(data);
      localStorage.setItem("articles", JSON.stringify(data));
    });
}
function pageSwitcher(searchData) {
  let datequerystart = `startDate=${searchData.startDate}`;
  let datequeryend = `endDate=${searchData.endDate}`;
  let topicOrTicker = searchData.ticker == "" ? "topic" : "ticker";
  let valueOfTopicOrTicker = searchData.ticker == "" ? searchData.topic : searchData.ticker;
  tickerQuery = `$tt-${topicOrTicker}=${valueOfTopicOrTicker}`;
  var queryString = `./results.html?=${datequerystart}&${datequeryend}&${tickerQuery}`;
  console.log(queryString);
  location.assign(queryString);
}

//saves searches to local storage and generates button to redo search
function pastTopics() {
  if (input.value == "") return;

  let pastArticlesData = input.value;

  //console.log(pastArticlesData);
  //localStorage.setItem("pastArticles", JSON.stringify(pastArticlesData));

  let storedArticles = JSON.parse(localStorage.getItem("pastArticles"));
  //console.log(storedArticles);
  //console.log(typeof storedArticles);
  if (storedArticles === null) {
    storedArticles = [];
    //console.log("Stored Articles is no longer null");
  }
  //console.log(storedArticles);
  if (!Array.isArray(storedArticles)) {
    //console.log("stored articles is not an array");
    storedArticles = [];
  }
  //console.log(storedArticles.includes(pastArticlesData));
  if (!storedArticles.includes(pastArticlesData))
    storedArticles.push(pastArticlesData);
  //if(storedArticles.includes(pastArticlesData)) //do nothing
  //else
  //add the data

  localStorage.setItem("pastArticles", JSON.stringify(storedArticles));
  if (storedArticles.length) {
    storedArticles.forEach((el) => {
      let historyButton = document.createElement("button");
      historyButton.textContent = el;
      historyButton.setAttribute("class", "button");
      searchHistory.appendChild(historyButton);
    });
  }
}

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
