// Dark Light Mode Function
var themeSwitcher = document.querySelector("#theme-switcher");
var page = document.querySelector(".page");
var modeDefault = "dark";

function articleFeed() {
  var articleData = localStorage.getItem(JSON.parse("articles"));
  console.log(articleData);
  JSON.parse(articleData).forEach((feed) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.setAttribute("href", feed.url);
    a.setAttribute("target", "_blank");
    a.textContent = feed.title;
    li.appendChild(a);
    articleList.appendChild(li);
  });
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
