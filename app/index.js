// ============================== Class ==========================================================
class Film {
/**
 * Represents a film.
 * @constructor
 * @param {string} id - The id of the film.
 * @param {string} title - The title of the film.
 * @param {number} year - The year of the released of the film.
 * @param {number} duration - The duration of the film.
 * @param {string} description - A short description of the film
 * @param {string} long_description - A long description of the film
 * @param {string} imdb_score - The score of the film.
 * @param {string} image_url - The url of the image of the film.
 * @param {string[]} actors - A list of the actors of the film.
 * @param {string|string[]} directors - The directors of the film.
 * @param {string|string[]} genres - The genres of the film.
 * @param {string} countries - The origin of the film.
 * @param {number} rated - The rated of the film.
 * @param {number} world_wide_gross_income - The box-office of the film.
 */

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

class Carousel {
    /**
    * represent a Carousel
    * @param {HTMLElement} element
    * @param {Object} options
    * @param {Object} [options.slidesToScroll=1] Number of elements to scroll
    * @parma {Object} [options.slidesVisible=1] Number of elements visible in a slide
    * @parma {boolean} [options.loop=false] should we make a loop at the end of the slide
    */
    constructor (element, options = {}) {
        this.element = element
        /** Object.assign allows you to merge with the object passed as parameters
        The first parameter creates the empty options array, the second one sets default options
        and the 3rd puts the options passed in parameter
        */
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)
        // freezes the number of children of the element at the start (before the creation of the new child)
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.moveCallBacks = []

        // Modification of DOM
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

        // display
        this.setStyle()
        this.createNavigation()

        // Events
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
    * Applies proper dimensions to carousel elements
    */
    setStyle () {
         let ratio = this.items.length / this.slidesVisible
         this.container.style.width = (ratio * 100) + "%"
         this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }

    createNavigation () {
        let nextButton = this.createDivWithClass("carousel__next")
        let prevButton = this.createDivWithClass("carousel__prev")
        this.root.parentNode.appendChild(nextButton)
        this.root.parentNode.appendChild(prevButton)
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
    * Moves the carousel to the targeted elements
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

    /**
     * add move to a list
     * @param {string} cb - callBack of move
    */
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

// ========================= functions ==========================================================

/**
 * @function getData - Get data with a fetch request from the API
 * @param {string} request - The url used for the request to the API.
 * @returns {Object json}
*/
async function getData(request) {
    let response = await fetch(request);
    if (!response.ok) {
    throw new Error(`Erreur HTTP ! statut: ${response.status}`);
    }
    return await response.json();
}

/**
 * @function getFilms - Add informations of a choosed number of films of one category a list AllFilms
 * @param {Object} data - data of films of the API
 * @param {string} data[].id - The id of a film.
 * @param {string} data[].title - The title of a film.
 * @param {string} data[].image_url - The image_url of a film.
*/

async function getFilms(data, allFilms, numberFilms, category) {
    let i = 0
    while (i < numberFilms) {
        allFilms[category].push([data[i].id, data[i].title, data[i].image_url]);
        i++
    }
    return true;
}

/**
 * @function saveData - Add list of film's informations (id, title and url_image) in the allFilms dictionary
*/
async function saveData() {
    // get informations for number of films to display for each url
    for (let url of urls) {
        // not add the first film in best category, it is already display
        if (url[1] == "best") {
                number_of_films_to_display ++;
        }
        else {
            number_of_films_to_display = 7;
        }
        while (allFilms[url[1]].length < number_of_films_to_display) {
            // choose the right url (first page or next page
            if (allFilms[url[1]] == 0) {
                urlPage = url[0];
            } else {
                urlPage = nextUrl
            }
            // get informations :
            let dataJson = await getData(urlPage);
            nextUrl = dataJson.next;
            data = dataJson.results;
            // verification if the number of film in the page is bigger than the number of films to display
            let numberFilm = number_of_films_to_display - allFilms[url[1]].length;
            let numberFilmToSelect = 0;
            if (numberFilm > data.length) {
                numberFilmToSelect = data.length;
            } else {
                numberFilmToSelect = numberFilm;
            }
            // add informations films in allFilms
            await getFilms(data, allFilms, numberFilmToSelect, url['1']);
        }
    }
}

/**
 * @function addImages - Add images in the html in the section categories
*/
function addImages () {
    for (category of categories) {
        let i = 0;
        let lengthCategory = number_of_films_to_display;
        // not display the first film of best category, it is already display
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

/**
 * @function addBestFilm - Add all informations in the section bestFilm of html
*/
async function addBestFilm () {
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

/**
 * @function searchFilm - Verify if a film has been already clic and save in the informationsFilm dictionary
*/
async function searchFilm (idFilm) {
    let findedFilm = informationsFilm.find(item => item.id === idFilm);
    if (!findedFilm) {
            await saveInformationsFilm(idFilm);
            findedFilm = informationsFilm.find(item => item.id === idFilm);
        }
    return findedFilm;
}

/**
 * @function saveInformationFilm - Create a new object Film
*/
async function saveInformationsFilm (id) {
    url = "http://127.0.0.1:8000/api/v1/titles/" + id;
    let resp = await getData(url);

    film = new Film ( resp.id, resp.title, resp.year, resp.duration, resp.description, resp.long_description,
            resp.imdb_score, resp.image_url, resp.actors, resp.directors, resp.genres, resp.countries,
            resp.rated, resp.worldwide_gross_income);
        informationsFilm.push(film);
};

/**
 * @function displayFilmsCategory - launch the 3 function to modify html and display all images and informations
*/
async function displayFilmsCategory () {
    await saveData();
    addImages();
    addBestFilm();
}


/**
 * @function displayModal - Create all elements of the modal and add content
 * @param {number} idFilm - The id of a film.
*/
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
    modifyElementInDom ("duration", "Durée(min): " + findedFilm.duration);
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

/**
 * @function createElementInDom - Create a new element and add it in an other element
 * @param {string} idParent - The id of an element where to put the new element
 * @param {string} element - The name of the element to create
 * @param {string} idElement - The id to add to the new element
*/
function createElementInDom (idParent, element, idElement) {
    const parent = document.getElementById (idParent);
    const newElement = document.createElement(element);
    newElement.setAttribute("id", idElement);
    parent.appendChild(newElement);
}

/**
 * @function modifyElementInDom - Modify the content of an element of the Dom
 * @param {string} element - The element to be amended
 * @param {string} modification - The modifications
*/
function modifyElementInDom (element, modification) {
    let id = document.getElementById(element);
    id.textContent = modification;
}

/**
 * @function closeModal - Close the modal
*/
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

// ==================================== main program =================================================

// creating all necessary variables for the script
const categories = ["best", "Adventure", "Thriller", "Family"];
let number_of_films_to_display = 7;
let allFilms = {};
let urls = [];
let informationsFilm = []

// add in html the name of the chosen categories
let categoriesTitle = document.getElementsByClassName('category__title');
let i = 1;
while (i < categories.length) {
    categoriesTitle[i].textContent = categories[i];
    i ++;
}

// preparing url for requests
for (let category of categories) {
    // add to allFilms a key = name_category and values = empty list
    allFilms[category] = [];
    if (category == "best") {
        urls.push(["http://localhost:8000/api/v1/titles/?sort_by=-imdb_score", category]);
    } else {
        urls.push(["http://localhost:8000/api/v1/titles/?sort_by=-imdb_score" + "&genre=" + category, category]);
    }
}

// display all carousels and listen for modals
document.addEventListener("DOMContentLoaded", async function () {
    await displayFilmsCategory();
    new Carousel(document.querySelector("#best"), {
        slidesToScroll: 1,
        slidesVisible: 5,
        loop: false
    })
    new Carousel(document.querySelector("#adventure"), {
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
        // listen click
        image.addEventListener("click", function (e) {
            const imageClique = e.target;  // recupération de l'objet cliqué
            displayModal(parseInt(imageClique.getAttribute("id")))
        });
    }
    for (image of images) {
        // listen enter key
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


