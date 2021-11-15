//function displayFilms (request, category, number_films) {
//    fetch(request)
//      .then(function (response) {
//        // handle success
//            return response.json();
//      })
//      .then(function (value) {
//        let i = 0;
//        if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score") {
//            i = 1;
//        }
//        if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page=2") {
//            number_films = 3;
//        }
//         let imageFilm = [];
//         while (i < number_films) {
//            imageFilm.push(value.results[i].image_url)
//            i++
//         }
//         console.log(category + ":" + number_films + ":" + performance.now());
//         return imageFilm;
//         })
//      .then(function(imageFilm) {
//          let film = document.getElementById(category);
//           if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score") {
//            i = 1;
//            number_films -= 1;
//        }
//          i = 0;
//          while (i < number_films) {
//            let new_p = document.createElement("p");
//            let new_film = document.createElement("img");
//            let image_src = imageFilm[i];
//            new_film.src = image_src;
//            new_p.appendChild(new_film)
//            film.appendChild(new_p);
//            i++
//         }
//      })
//      .catch(function (error) {
//        // handle error
//        console.log(error);
//      })
//};


function displayFilms (request, category, numberPages) {
        let number_films = 5;
    fetch(request)
      .then(function (response) {
        // handle success
            return response.json();
      })
      .then(function (value) {
        let i = 0;
        if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score") {
            i = 1;
        }
        if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page=2") {
            number_films = 5;
        }
         let imageFilm = [];
         while (i < number_films) {
            imageFilm.push(value.results[i].image_url);
            i++;
         }
         console.log(category + ":" + number_films + ":" + performance.now());
         console.log(imageFilm);
         return imageFilm;
         })
      .then(function(imageFilm) {
          let film = document.getElementById(category);
           if (request == "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score") {
            i = 1;
            number_films -= 1;
        }
          i = 0;
          while (i < number_films) {
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

displayFilms("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score", "best", 5);
displayFilms("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page=2", "best", 3);

displayFilms("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Animation", "animation", 5);
displayFilms("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Animation&page=2", "animation", 2);

displayFilms("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Thriller", "thriller", 5);
displayFilms("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Thriller&page=2", "thriller", 2);

displayFilms("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Family", "family", 5);
displayFilms("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Family&page=2", "family", 2);





//// test d'un événement click
//let evenement = document.getElementsByClassName("categories__bestratedfilm");
//evenement[0].addEventListener("click", function(){
//    let new_element = document.createElement("p");
//    evenement[0].appendChild(new_element);
//    new_element.innerHTML = "<p>test</p>";
//    evenement[0].style.border = "2px solid red";
//});

// lecture de l'API

// Make a request for a user with a given ID





//const axios = require('axios')
//
//function askGenres () {
//
//axios.get("http://127.0.0.1:8000/api/v1/genres/")
//    .then(function(response) {
//        let new_genre = document.createElement("p");
//        let new_element = document.getElementsByTagName("footer")
//        new_element[0].appendChild(new_genre);
//        new_genre.innerHTML = "<p> genre trouvé :" + response.data.results[0].name + "</p>";
//    })
//    .catch(function(error) {
//        // Une erreur est survenue
//        alert("erreur");
//    })
//    .then(function() {
//        alert("fin");
//    });
//}
//
//askGenres()


