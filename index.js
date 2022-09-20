console.log("working");

const type = document.getElementById("serachType");
const title = document.getElementById("searchTitle");
const year = document.getElementById("searchYear");
const searchBtn = document.querySelector("header button");
const result = document.querySelector(".result");
const card = document.getElementsByClassName("card");
const header = document.querySelector("header");

// Fetching favourite list from local storage
const favourite = localStorage.getItem("favourite") ? JSON.parse(localStorage.getItem("favourite")) : [];

function search() {
    const XHR = new XMLHttpRequest();
    const url = new URL("https://www.omdbapi.com/");
    url.searchParams.append("s", title.value);
    url.searchParams.append("apikey", "eb2728ec");
    if (type.value) {
        url.searchParams.append("type", type.value);
    }
    if (year.value) {
        url.searchParams.append("y", year.value);
    }
    XHR.open("get", url.href);
    XHR.send();
    XHR.onload = () => {
        const res = JSON.parse(XHR.response);
        if (res.Response === "False") {
            return alert(res.Error);
        }
        result.innerHTML = "";
        for (let i of res.Search) {
            populateDom(i);
        }
    }
};

function checkInput() {
    if (!title.value) {
        return alert("Movie title required");
    }
    search();
};

function populateDom(res) {
    const div = document.createElement("div");
    div.className = "card";
    div.dataset.id = res.imdbID;
    div.innerHTML = `<img src="${res.Poster === "N/A" ? "" : res.Poster}" class="poster">
    <div>
        <p class="title">${res.Title}</p>
        <p class="year">${res.Year}<span class="type">${res.Type}</span></p>
        <p class="fav" data-id="${res.imdbID}" ${favourite.find((e) => e === res.imdbID) ? `data-added="true">Remove from` : `data-added="false">Add to`} favourites</p>
    </div>`;
    result.appendChild(div);
};

function favHandler(target) {
    if (target.dataset.added === "false") {
        favourite.push(target.dataset.id);
        target.dataset.added = "true";
        target.innerHTML = "Remove from favourites";
    }
    else {
        favourite.find((e, i) => {
            if (e === target.dataset.id) {
                favourite.splice(i, 1);
                return true;
            }
            return false;
        })
        target.dataset.added = "false";
        target.innerHTML = "Add to favourites";
    }

    // this is for persistent 
    localStorage.setItem("favourite", JSON.stringify(favourite));
}

function renderFav() {
    if (favourite.length === 0) {
        return result.innerHTML = "No favourite";
    }
    result.innerHTML = "";
    for (let i of favourite) {
        let XHR = new XMLHttpRequest();
        XHR.open("get", "https://www.omdbapi.com/?apikey=eb2728ec&i=" + i);
        XHR.onload = () => {
            let res = JSON.parse(XHR.response);
            populateDom(res);
        }
        XHR.send();
    }
}

function redirect(id) {
    // location.assign("/movie.html?id="+id);
    open("./movie.html?id=" + id, "_blank");
};

function clickHandler(e) {
    const target = e.target;
    if (target === searchBtn || e.key === "Enter") {
        return checkInput();
    }
    if (target.className === "poster") {
        return redirect(target.parentNode.dataset.id);
    }
    if (target.className === "fav") {
        return favHandler(target);
    }
    if (target.className === "renderFav") {
        header.style.display = "none";
        return renderFav();
    }
    if (target.className === "renderHome") {
        header.style.display = "flex";
        return result.innerHTML = "Search Result";
    }
};

document.addEventListener("click", clickHandler);
document.addEventListener("keydown", clickHandler);