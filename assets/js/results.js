// Dark Light Mode Function
var themeSwitcher = document.querySelector("#theme-switcher");
var page = document.querySelector(".page");
var modeDefault = "dark";

themeSwitcher.addEventListener("click", function() {  
  if (modeDefault === "dark") {
    modeDefault = "light";
    page.setAttribute("class", "light");
  } else {
    modeDefault = "dark";
    page.setAttribute("class", "dark");
  }
});

// RESULTS FUNCTIONALITY TO BE ADDED BELOW