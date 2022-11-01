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

var SearchData;
var articleList = document.getElementById("article-list");



SearchData = parseURL();
getNewDateRange(SearchData);

if (SearchData.ticker === undefined) {
  $('#cur_stock_price').addClass('hide');
  $('#past_start_price').addClass('hide');
  $('#past_end_price').addClass('hide');
  $('#past_price_change').addClass('hide');
  $('#present_start_price').addClass('hide');
  $('#present_end_price').addClass('hide');
  $('#present_price_change').addClass('hide');
} else {
  $('#cur_stock_price').removeClass('hide');
  $('#past_start_price').removeClass('hide');
  $('#past_end_price').removeClass('hide');
  $('#past_price_change').removeClass('hide');
  $('#present_start_price').removeClass('hide');
  $('#present_end_price').removeClass('hide');
  $('#present_price_change').removeClass('hide');
  // getHistoricStockPrice(SearchData.ticker, parseDate(SearchData.startDate),parseDate(SearchData.endDate));  
}
handleSearchRes(SearchData);

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

  let topicPattern = "(?<=tt-topic=).+?.$";
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

function parseDate(date, seperator = '-') {
  //"2022-10-4" desired
  //20221004T0000 incoming
  //console.log(date);
  let newDate = date.split("T")[0];
  // console.log(newDate.slice(0,4));
  // console.log(newDate.slice(4,6));
  // console.log(newDate.slice(6));
  newDate =
    newDate.slice(0, 4) + seperator + newDate.slice(4, 6) + seperator + newDate.slice(6);
  console.log(newDate);
  return newDate;
}

function getNewDateRange(SearchInfo) {  
  const startDay = Date.parse(parseDate(SearchInfo.startDate, "/"));  
  const endDay = Date.parse(parseDate(SearchInfo.endDate, "/"));  
  // ticker = SearchInfo.ticker;
  // topic = SearchInfo.topic;

  // To calculate the time difference of two dates
  var timeDifference = endDay - startDay;

  // To calculate the no. of days between two dates
  var dayDifference = timeDifference / (1000 * 3600 * 24);
  console.log(dayDifference);

  // Gets current date
  let currentDay = new Date();
  let currentStartDay = new Date();
  currentStartDay.setDate(currentDay.getDate() - dayDifference);
  console.log(currentDay + `end`); 
  console.log(currentStartDay + `start`);
  
  // Calculates start date from current date (mimicing the selected date range)
  
  let curSearchInfo = new Object();
   curSearchInfo.ticker = SearchInfo.ticker;
   curSearchInfo.topic = SearchInfo.topic;
   // return YYYYMMDD
   curSearchInfo.startDate = `${currentStartDay.getFullYear()}${(currentStartDay.getMonth() + 1)}${currentStartDay.getDate() > 10 ? currentStartDay.getDate() : "0" + currentStartDay.getDate()}`;
   curSearchInfo.endDate = `${currentDay.getFullYear()}${(currentDay.getMonth() + 1)}${currentDay.getDate() > 10 ? currentDay.getDate() : "0" + currentDay.getDate()}`;
  console.log(curSearchInfo.endDate);
  console.log(curSearchInfo.startDate);
  return curSearchInfo;
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
