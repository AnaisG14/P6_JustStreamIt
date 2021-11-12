// Affichage des jaquettes de films grâce à une boucle
let imageFilm = ["../app/images/reflechir.gif",
                    "../app/images/logo.png",
                    "../app/images/reflechir.gif",
                    "../app/images/logo.png",
                    "../app/images/reflechir.gif",
                    "../app/images/logo.png",
                    "../app/images/reflechir.gif",]

let films = document.getElementsByClassName("films");
let i = 0
while (i<7){
    for (let film of films) {
        let new_film = document.createElement("img");
        new_film.src = imageFilm[i];
        film.appendChild(new_film);
//        new_film.innerHTML = "<p><img src='../app/images/reflechir.gif'/></p>";
        }
    i++;
}

// test d'un événement click
let evenement = document.getElementsByClassName("categories__bestratedfilm");
evenement[0].addEventListener("click", function(){
    let new_element = document.createElement("p");
    evenement[0].appendChild(new_element);
    new_element.innerHTML = "<p>test</p>";
    evenement[0].style.border = "2px solid red";
});

// lecture de l'API
//const axios = require('axios')
//
//function askGenres () {
//
//axios.get("http://localhost:8000/api/v1/genres/")
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

//askGenres()


