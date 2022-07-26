function xhrRequest(){
    const xhr = new XMLHttpRequest();
    const url = new URL(location.href);
    const id = url.searchParams.get("id");
    xhr.open("get",`http://www.omdbapi.com/?i=${id}&plot=full&apikey=eb2728ec`);
    xhr.onload = ()=>{
        const response = JSON.parse(xhr.response);
        populateDom(response);
    }
    xhr.send();
}

function populateDom(res){
    document.title = res.Title;
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src=${res.Poster} class="poster">
        <div>
        <p class="title">${res.Title}<span class="language">${res.Language}</span></p>
        <p class="released">${res.Released}<span class="genre">${res.Genre}</span></p>
        <p>${res.Plot}</p>
        <div class="info">
            <p>Director: ${res.Director}</p>
            <p>Writer: ${res.Writer}</p>
            <p>Actors: ${res.Actors}</p>
            <p>Country: ${res.Country}</p>
            <p class="rating">IMDB Rating: ${res.imdbRating}</p>
        </div>
    </div>`;
    document.body.appendChild(div);
}

xhrRequest();