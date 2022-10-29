// Dark Light Mode Function
var themeSwitcher = document.querySelector("#theme-switcher");
var page = document.querySelector(".page");
var modeDefault = "dark";
var SearchData;
var articleList = document.getElementById("article-list");

function articleFeed(articleData) {
  for (let i = 0; i < 5; ++i) {
    let feed = articleData.feed[i];
    let li = document.createElement("li");
    let a = document.createElement("a");
    // console.log(articleData[i]);
    a.setAttribute("href", feed.url);
    a.setAttribute("target", "_blank");
    a.textContent = feed.title;
    li.appendChild(a);
    articleList.appendChild(li);
  }

  // articleData.feed.forEach((feed) => {

  // });
}

SearchData = parseURL();

if (SearchData.ticker == "") {
  //hide the price info with css (Help Ari!!!!)
} else {
  // getHistoricStockPrice(SearchData.ticker, parseDate(SearchData.startDate),parseDate(SearchData.endDate));
}
handleSearchRes(SearchData);

function parseURL() {
  SearchData = new Object();

  var queryString = window.location.href;
  //console.log(queryString);
  let startDataPattern = "(?<=startDate=).+?(?=&)";
  const re_start = new RegExp(startDataPattern);

  let startDataMatches = re_start.exec(queryString);
  //console.log(startDataMatches);
  SearchData.startDate = startDataMatches[0];

  let endDataPattern = "(?<=endDate=).+?(?=&)";
  const re_end = new RegExp(endDataPattern);
  let endDataMatches = re_end.exec(queryString);

  SearchData.endDate = endDataMatches[0];

  let tickerPattern = "(?<=tt-ticker=).+?.$";
  const re_ticker = new RegExp(tickerPattern);
  if (re_ticker.test(queryString))
    SearchData.ticker = re_ticker.exec(queryString)[0];

  //http://127.0.0.1:5501/results.html?=startDate=20221004T0000&endDate=20221024T0000&$tt-topic=Google

  let topicPattern = "(<=tt-topic=).+?.$";
  const re_topic = new RegExp(topicPattern);

  if (re_topic.test(queryString))
    SearchData.topic = re_topic.exec(queryString)[0];

  return SearchData;
}
function handleSearchRes(SearchData) {
  let dateStartValue = SearchData.startDate;
  let dateEndValue = SearchData.endDate;
  let url;
  if (SearchData.ticker === undefined) {
    url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${SearchData.topic}&time_from=${dateStartValue}&time_to=${dateEndValue}&apikey=Y7EZGMG4B18PRI2S`;
  } else {
    url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&ticker=${SearchData.ticker}&time_from=${dateStartValue}&time_to=${dateEndValue}&apikey=Y7EZGMG4B18PRI2S`;
  }
  getArticles(url);
}

function getArticles(url) {
  articleList.innerHTML = "";

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);

      articleFeed(data);
    });
}
function getHistoricStockPrice(symbol, dateStart = "", dateEnd = "") {
  let apiKey = "635b26dc35a434.57858620";
  let apiKey2 = "63544169d45691.02124558";
  //console.log("DateStart =>" + dateStart);
  //console.log("DateEnd =>" + dateEnd);
  let dates =
    dateStart != "" && dateEnd != "" ? `from=${dateStart}&to=${dateEnd}` : ``;
  //console.log("DateRange =>" + dates)
  let request = `https://eodhistoricaldata.com/api/eod/${symbol}.US?api_token=${apiKey2}&fmt=json&from=${dateStart}&to=${dateEnd}`;

  //console.log(request);

  fetch(request, { mode: "cors" })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);
    });
}

function parseDate(date) {
  //"2022-10-4" desired
  //20221004T0000 incoming
  //console.log(date);
  let newDate = date.split("T")[0];
  // console.log(newDate.slice(0,4));
  // console.log(newDate.slice(4,6));
  // console.log(newDate.slice(6));
  newDate =
    newDate.slice(0, 4) + "-" + newDate.slice(4, 6) + "-" + newDate.slice(6);
  console.log(newDate);
  return newDate;
}

themeSwitcher.addEventListener("click", function () {
  if (modeDefault === "dark") {
    modeDefault = "light";
    page.setAttribute("class", "light");
  } else {
    modeDefault = "dark";
    page.setAttribute("class", "dark");
  }
});

//articleFeed();
// RESULTS FUNCTIONALITY TO BE ADDED BELOW

//get stock price from query string
