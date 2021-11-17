class Film {
    constructor(id, title, year, duration, description, long_description, imdb_score,
            img_url, actors, directors, genres, countries, rated, worldwide_gross_income) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.duration = duration;
    this.description = description;
    this.long_description = long_description;
    this.imdb_score = imdb_score;
    this.img_url = img_url;
    this.actors = actors;
    this.directors = directors;
    this.genres = genres;
    this.countries = countries;
    this.rated = rated;
    this.worldwide_gross_income = worldwide_gross_income;
    }
};

async function getFilms(data, allFilms, numberFilms, category) {
// récupère les informations (id, titre, url_image et les ajoute aux listes vides de chaque categorie de allFilms
// boucle sur le nombre de film de la page
    let i = 0
    while (i < numberFilms) {
    // ajoute au dictionnaire allFilms des informations
        allFilms[category].push([data[i].id, data[i].title, data[i].image_url]);
        i++
    }
    return true;
}

async function getData(request) {
// récuper les datas en json
    let response = await fetch(request);
    if (!response.ok) {
    throw new Error(`Erreur HTTP ! statut: ${response.status}`);
    }
    return await response.json();
}


//async createFilm => creer des instance de la classe film et les ajouter à un dictionnaire


// creer le dictionnaire des categories : let allFilms
const categories = ["best", "Animation", "Thriller", "Family"];
let number_of_films_to_display = 7;
let allFilms = {};
let urls = [];
let informationsFilm = []

// boucle for sur categories
for (let category of categories) {
    // => retourne tableau ou chaque categorie a pour valeur une liste vide {'category1': [], 'category2': [], ...}
    allFilms[category] = [];
    // construction des url de la page1
    if (category == "best") {
        urls.push(["http://localhost:8000/api/v1/titles/?sort_by=-imdb_score", category]);
    } else {
        urls.push(["http://localhost:8000/api/v1/titles/?sort_by=-imdb_score" + "&genre=" + category, category]);
    }
}


async function saveData() {
    // Recupération des données pour chaque url
    for (let url of urls) {
        // boucle tant que le nombre de livres dans category < nombre de livres à traiter
//            let i = allFilms[url[1]].length;
            if (url[1] == "best") {
                number_of_films_to_display ++;
            }
            else {
                number_of_films_to_display = 7;
            }
            while (allFilms[url[1]].length < number_of_films_to_display) {
                if (allFilms[url[1]] == 0) {
                    urlPage = url[0];
                } else {
                    urlPage = nextUrl
                }
            // recupération des données :
                let dataJson = await getData(urlPage);
                nextUrl = dataJson.next;
                data = dataJson.results;
                //vérification du nombre de films à récupérer sur cette url
                let numberFilm = number_of_films_to_display - allFilms[url[1]].length;
                let numberFilmToSelect = 0;
                if (numberFilm > data.length) {
                    numberFilmToSelect = data.length;
                } else {
                    numberFilmToSelect = numberFilm;
                }
                // getFilms() qui ajoute les datas aux catégories vides
                await getFilms(data, allFilms, numberFilmToSelect, url['1']);
                }
        }
    }

function addImages () {
//    --- boucle sur categorie  => ajout des films depuis le dictionnaire dans les 4 catégories
    for (category of categories) {
        let i = 0;
        let lengthCategory = number_of_films_to_display;
        if (category == "best") {
            i = 1;
            lengthCategory++
        }
        let film = document.getElementById(category.toLowerCase());
        while (i < 7) {
            let new_p = document.createElement("p");
            let new_film = document.createElement("img");
            let image_src = allFilms[category][i][2];
            new_film.src = image_src;
            new_film.setAttribute("id", allFilms[category][i][0])
            new_p.appendChild(new_film)
            film.appendChild(new_p);
            i++
         }
    }
}

function addBestFilm () {
//    --- ajout des informations du film best
    // image
    let p_image_best = document.getElementById('bestFilm__img');
    let new_image_best = document.createElement('img');
    new_image_best.src = allFilms["best"][0][2];
    new_image_best.setAttribute("id", allFilms["best"][0][0]);
    p_image_best.appendChild(new_image_best);
    // title
    document.getElementById('titleBestFilm').textContent = allFilms["best"][0][1];
    // resume
    let id_best = parseInt(document.querySelector("#bestFilm__img > img").getAttribute("id"));
    let item = (informationsFilm.find(item => item.id === id_best)).long_description;
    document.getElementById("resumeBestFilm").textContent = item;
}

async function getResume (id) {
    url = "http://127.0.0.1:8000/api/v1/titles/" + id;
    let resp = await getData(url);

    film = new Film ( resp.id, resp.title, resp.year, resp.duration, resp.description, resp.long_description,
            resp.imdb_score, resp.img_url, resp.actors, resp.directors, resp.genres, resp.countries,
            resp.rated, resp.worldwide_gross_income);
        informationsFilm.push(film);
};


async function displayFilmsCategory () {
    await saveData();
    addImages();
    await getResume(allFilms["best"][0][0]);
    addBestFilm();
}
displayFilmsCategory();


//    --- creation du carousel
//
//    --- creation des modales

