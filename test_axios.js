const axios = require('axios');

axios.get("http://localhost:8000/api/v1/genres/")
    .then(function(response) {
        console.log(response.data.results[0].name);
        console.log(response.data.results[1].name);
    })
    .catch(function(error) {
        // Une erreur est survenue
        console.log(error);
    })
    .then(function() {
        console.log("toujous exécuté");
    });


