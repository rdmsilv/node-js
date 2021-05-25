const axios = require('axios');
const URL = `https://swapi.dev/api/people`

async function obterPesssoas (nome) {
    const url = `${URL}?search=${nome}&format=json`
    const response = await axios.get(url)
    return response.data
}

/* obterPesssoas('r2')
    .then(function (resultado) {
        console.log('Resultado', resultado)
    })
    .catch(function (error) {
        console.error('DEU RUIM', error)
    }) */

module.exports = {
    obterPesssoas
}
