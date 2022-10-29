// Dark Light Mode Function
var themeSwitcher = document.querySelector("#theme-switcher");
var page = document.querySelector(".page");
var modeDefault = "dark";
var SearchData;

// function articleFeed() {
//   var articleData = localStorage.getItem(JSON.parse("articles"));
//   console.log(articleData);
//   JSON.parse(articleData).forEach((feed) => {
//     let li = document.createElement("li");
//     let a = document.createElement("a");
//     a.setAttribute("href", feed.url);
//     a.setAttribute("target", "_blank");
//     a.textContent = feed.title;
//     li.appendChild(a);
//     articleList.appendChild(li);
//   });
// }

SearchData = parseURL();

function parseURL()
{

  SearchData = new Object();
  
  var queryString = window.location.href;
  console.log(queryString);
  let startDataPattern = '(?<=startDate=).+?(?=&)';
  const re_start = new RegExp(startDataPattern);

let startDataMatches = re_start.exec(queryString);
console.log(startDataMatches);
SearchData.startDate = startDataMatches[0];

let endDataPattern = '(?<=endDate=).+?(?=&)';
const re_end = new RegExp(endDataPattern);
let endDataMatches = re_end.exec(queryString);

SearchData.endDate = endDataMatches[0];



let tickerPattern = '(?<=tt-ticker=).+?.$';
const re_ticker = new RegExp(tickerPattern);
if(re_ticker.test(queryString)) SearchData.ticker = re_ticker.exec(queryString)[0];


//http://127.0.0.1:5501/results.html?=startDate=20221004T0000&endDate=20221024T0000&$tt-topic=Google

let topicPattern = '(<=tt-topic=).+?.$';
const re_topic = new RegExp(topicPattern);

if(re_topic.test(queryString)) SearchData.topic = re_topic.exec(queryString)[0];


 return SearchData;
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
