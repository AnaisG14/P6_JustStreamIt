class Film {
    constructor(id, title, year, duration, description, long_description, imdb_score,
            image_url, actors, directors, genres, countries, rated, worldwide_gross_income) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.duration = duration;
    this.description = description;
    this.long_description = long_description;
    this.imdb_score = imdb_score;
    this.image_url = image_url;
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
let categoriesTitle = document.getElementsByClassName('category__title');
let i = 1;
while (i < categories.length) {
    categoriesTitle[i].textContent = categories[i];
    i ++;
}


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
        while (i < lengthCategory) {
            let new_p = document.createElement("p");
            let new_film = document.createElement("img");
            let image_src = allFilms[category][i][2];
            new_film.src = image_src;
            new_film.setAttribute("id", allFilms[category][i][0]);
            new_film.setAttribute("tabindex", "0")
            new_film.setAttribute("alt", allFilms[category][i][1]);
            new_p.appendChild(new_film);
            film.appendChild(new_p);
            i++
         }
    }
}

async function addBestFilm () {
//    --- ajout des informations du film best
    // image
    let p_image_best = document.getElementById('bestFilm__img');
    let new_image_best = document.createElement('img');
    new_image_best.src = allFilms["best"][0][2];
    new_image_best.setAttribute("id", allFilms["best"][0][0]);
    new_image_best.setAttribute("alt", allFilms["best"][0][1]);
    p_image_best.appendChild(new_image_best);
    // title
    document.getElementById('titleBestFilm').textContent = allFilms["best"][0][1];
    // resume
    let idBest = parseInt(document.querySelector("#bestFilm__img > img").getAttribute("id"));
    let findedFilm = await searchFilm(idBest);
    let item = findedFilm.long_description;
    document.getElementById("resumeBestFilm").textContent = item;
}

async function searchFilm (idFilm) {
    let findedFilm = informationsFilm.find(item => item.id === idFilm);
    if (!findedFilm) {
            await saveInformationsFilm(idFilm);
            findedFilm = informationsFilm.find(item => item.id === idFilm);
        }
    return findedFilm;
}

async function saveInformationsFilm (id) {
    url = "http://127.0.0.1:8000/api/v1/titles/" + id;
    let resp = await getData(url);

    film = new Film ( resp.id, resp.title, resp.year, resp.duration, resp.description, resp.long_description,
            resp.imdb_score, resp.image_url, resp.actors, resp.directors, resp.genres, resp.countries,
            resp.rated, resp.worldwide_gross_income);
        informationsFilm.push(film);
};


async function displayFilmsCategory () {
    await saveData();
    addImages();
    addBestFilm();
}


//    --- creation du carousel with options (element and options in a table)
class Carousel {
    /**
    * @param {HTMLElement} element
    * @param {Object} options
    * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
    * @parma {Object} [options.slidesVisible=1] Nombre d'éléments visibles dans un slide
    * @parma {boolean} [options.loop=false] doit-on boucler en fin de slide
    */
    constructor (element, options = {}) {
        this.element = element
        // Object.assign permet de fusionner avec l'objet passé en paramètres
        // Le premier paramètre créer le tableau d'options vide, le 2ème y met des options par défaut
        // et le 3ème met les options passées en paramètre
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)
        let children = [].slice.call(element.children) //fige le nombre d'élements au départ avant la création du nouvel enfant
        this.isMobile = false
        this.currentItem = 0
        this.moveCallBacks = []

        // Modification du DOM
        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.root.setAttribute("tabindex", "0")
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map ((child) => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()

        // Evènements
        this.moveCallBacks.forEach(cb => cb(0))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.root.addEventListener('keyup', e => {
            if (e.key === "ArrowRight" || e.key === "Right") {
                this.next()
            } else if (e.key === "ArrowLeft" || e.key === "Left") {
                this.prev()
            }
        })
    }

    /**
    * Applique les bonnes dimensions aux éléments du carousel
    */
    setStyle () {
         let ratio = this.items.length / this.slidesVisible
         this.container.style.width = (ratio * 100) + "%"
         this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }

    createNavigation () {
        let nextButton = this.createDivWithClass("carousel__next")
        let prevButton = this.createDivWithClass("carousel__prev")
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener("click", this.next.bind(this))
        prevButton.addEventListener("click", this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add("carousel__prev--hidden")
            } else {
                prevButton.classList.remove("carousel__prev--hidden")
            }
            if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add("carousel__next--hidden")
            } else {
                nextButton.classList.remove("carousel__next--hidden")
            }
        })
    }

    next () {
        this.goToItem(this.currentItem + this.slidesToScroll)
    }

    prev () {
        this.goToItem(this.currentItem - this.slidesToScroll)
    }

    /**
    * Déplace le carousel vers les éléments ciblés
    * @param {number} index
    */
    goToItem (index) {
        if (index < 0) {
            if (this.options.loop) {
                index = this.items.length - this.slidesVisible
            } else {
                return
            }
        } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
            if (this.options.loop) {
                index = 0
            } else {
                return
            }
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index
        this.moveCallBacks.forEach(cb => cb(index))

    }

    onMove (cb) {
        this.moveCallBacks.push(cb)
    }

    onWindowResize () {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
        }
        this.moveCallBacks.forEach(cb => cb(this.currentItem))
    }

    /**
    *
    * @param (strig) className
    * @returns {HTMLElement}
    */
    createDivWithClass (className) {
        let div = document.createElement("div")
        div.setAttribute("class", className)
        return div
    }

    /**
    * @returns {numbers}
    */
    get slidesToScroll () {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    /**
    * @returns {numbers}
    */
    get slidesVisible () {
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await displayFilmsCategory();
    new Carousel(document.querySelector("#best"), {
        slidesToScroll: 1,
        slidesVisible: 5,
        loop: false
    })
    new Carousel(document.querySelector("#animation"), {
        slidesToScroll: 1,
        slidesVisible: 5,
        loop: false
    })
    new Carousel(document.querySelector("#thriller"), {
        slidesToScroll: 1,
        slidesVisible: 5,
        loop: false
    })
    new Carousel(document.querySelector("#family"), {
        slidesToScroll: 1,
        slidesVisible: 5,
        loop: false
    })

    // listen for modal
    let images = document.getElementById("categories").getElementsByTagName("img");
    for (image of images) {
        image.addEventListener("click", function (e) {
            const imageClique = e.target;  // recupération de l'objet cliqué
            displayModal(parseInt(imageClique.getAttribute("id")))
        });
    }
    for (image of images) {
        image.addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
                const imageClique = e.target;  // recupération de l'objet cliqué
                displayModal(parseInt(imageClique.getAttribute("id")));
            } else {
                return;
            }
        });
    }
    document.getElementById("bestFilmButton").addEventListener("click", function() {
        displayModal(allFilms["best"][0][0]);
    })
    closeModal();
});


//    --- creation des modales

async function displayModal (idFilm) {
    let findedFilm = await searchFilm(idFilm);
    // put element in DOM
    modifyElementInDom("modal__content_title", findedFilm.title + "(" + findedFilm.year + ")"); //title
    createElementInDom("modal__content_mainInformations", "p", "year"); //year
    modifyElementInDom ("year", "|" + findedFilm.genres + "|" + findedFilm.countries + "(" + findedFilm.year + ")");
    createElementInDom("modal__content_mainInformations", "p", "directors"); // directors
    modifyElementInDom ("directors", "Réalisé par " + findedFilm.directors);
    createElementInDom("modal__content_actors", "p", "actors");
    modifyElementInDom ("actors", "Acteurs: " + findedFilm.actors);

    createElementInDom("modal__content_scores", "p", "duration");
    modifyElementInDom ("duration", "Durée(min) " + findedFilm.duration);
    createElementInDom("modal__content_scores", "p", "rated");
    modifyElementInDom ("rated", "Rated: " + findedFilm.rated);
    createElementInDom("modal__content_scores", "p", "imdb");
    modifyElementInDom ("imdb", "Score Imdb: " + findedFilm.imdb_score);
    createElementInDom("modal__content_scores", "p", "worldwide_gross_income");
    modifyElementInDom ("worldwide_gross_income", "BoxOffice: " + findedFilm.worldwide_gross_income);

    createElementInDom("modal__content_resume", "p", "description");
    modifyElementInDom ("description", findedFilm.long_description);

    createElementInDom("modal__header_img", "img", "imageModal");
    document.getElementById("imageModal").src = findedFilm.image_url;

    document.getElementById("modalFilm").style.display = "block";
    document.getElementById("closeModal").focus();

}
function createElementInDom (idParent, element, idElement) {
    const parent = document.getElementById (idParent);
    const newElement = document.createElement(element);
    newElement.setAttribute("id", idElement);
    parent.appendChild(newElement);
}

function modifyElementInDom (element, modification) {
    let id = document.getElementById(element);
    id.textContent = modification;
}

function closeModal () {
    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("modalFilm").style.display = "none";
    })
    document.getElementById("closeModal").addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            document.getElementById("modalFilm").style.display = "none";
        } else {
            return
        }

    })
}
