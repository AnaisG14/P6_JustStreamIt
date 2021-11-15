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

async function displayFilms (request, category, all_films, number_film_end_page) {
    await fetch(request)
      .then(function (response) {
        // handle success
           return response.json();
      })
      .then(function (value) {
      // get id of films
        let id_films = [];
        let j = 0;
         while (j < 5) {
            id_films.push(value.results[j].id);
            j++;
         }
         console.log(id_films);
          for (let j in id_films) {
            getResume(id_films[j]);
         };

        // get image_url of films
        let i = 0;
        if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page=1") {
            // add image and title in best film
            let p_image_best = document.getElementById('bestFilm__img');
            let new_image_best = document.createElement('img');
            new_image_best.src = value.results[0].image_url;
            p_image_best.appendChild(new_image_best);

            document.getElementById('titleBestFilm').textContent = value.results[0].title;

            // don't use first film in best_film category
            i = 1;
        }
        if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page=2") {
            number_film_end_page += 1;
        }
         let imageFilm = [];
         while (i < number_film_end_page) {
            imageFilm.push(value.results[i].image_url);
            i++;
         }
         return imageFilm;
         })
      .then(function(imageFilm) {
           if (category == "no") {
                category = "best";
           }
          let film = document.getElementById(category.toLowerCase());
           if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score") {
            let i = 1;
            number_film_end_page -= 1;
        }
          let i = 0;
          while (i < number_film_end_page) {
            let new_p = document.createElement("p");
            let new_film = document.createElement("img");
            let image_src = imageFilm[i];
            new_film.src = image_src;
            new_p.appendChild(new_film)
            film.appendChild(new_p);
            i++
         }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
};

function getResume (id) {
    url = "http://127.0.0.1:8000/api/v1/titles/" + id;
    fetch(url)
    .then(function(resp) {
        return resp.json();
    })
    .then(function(resp) {
        film = new Film ( resp.id, resp.title, resp.year, resp.duration, resp.description, resp.long_description,
            resp.imdb_score, resp.img_url, resp.actors, resp.directors, resp.genres, resp.countries,
            resp.rated, resp.worldwide_gross_income);
        all_films.push(film);
    })
    .catch(function (error) {
        // handle error
        console.log(error.message);
     })
};

let all_films = [];
const categories = ["no", "Animation", "Thriller", "Family"];
const number_of_films_to_display = 7;

async function fetchAll (categories, numbers_of_number_of_films_to_display) {
    const numbers_of_pages_to_display = Math.trunc(number_of_films_to_display/5)+1;
    for (let category of categories) {
        let number_film_end_page = 5;
        let i = 1;
        while (i <= numbers_of_pages_to_display) {
            let request = "";
            if (category == "no") {
                request = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score" + "&page=" + i;
                console.log(request);
            } else {
                request = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score" + "&genre=" + category + "&page=" + i;
                console.log(request);
            }
            if (i == numbers_of_pages_to_display) {
                number_film_end_page = number_of_films_to_display % 5;
            }
            await displayFilms(request, category, all_films, number_film_end_page).then(console.log("en cours: " + performance.now() + ":" + all_films.length));
            i++;
            }
    }
};

fetchAll(categories, number_of_films_to_display)
.then(function() {
    console.log("fini: " + performance.now() + ":" + all_films.length);
})


