const rp = require('request-promise-native')
const optionsJuno = require('./apoio/optionsJuno')
const optionsSheets = require('./apoio/optionsSheets')

const main = async function() {
    require('dotenv').config()
    let now = new Date();
    let hora = now.getUTCHours()
    if(hora == 10){
        try {
            let dataJuno = await rp(optionsJuno())
            let data = await rp(optionsSheets(dataJuno))
            console.log("Informações do POST", data, "Array Postado", optionsSheets(dataJuno).body.resource.values)
        } catch (error) {
            console.log("Deu erro", error)
        }
    }
}

main();