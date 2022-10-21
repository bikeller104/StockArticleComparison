const searchFrom = document.querySelector(".search");
const input = document.querySelector(".input");
const articleList = document.querySelector(".list");

searchFrom.addEventListener("submit", searchTopic);

function searchTopic(e) {
  e.preventDefault();
  let topic = input.value;
  let url = `https://www.loc.gov/search/?q=${topic}&fo=json`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      data.results.forEach((results) => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.setAttribute("href", results.url);
        a.setAttribute("target", "_blank");
        a.textContent = results.title;
        li.appendChild(a);
        articleList.appendChild(li);
      });
    });
}
