const rp = require('request-promise-native')

const main = async function() {
    require('dotenv').config()
    // Requisição get Juno consulta
    function convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat)
        return [d.getFullYear(),pad(d.getMonth()+1), pad(d.getDate())].join('-')
      }
    const date = new Date()
    const dateHoje = convertDate(date.setDate(date.getDate()))
    const dateOntem = convertDate(date.setDate(date.getDate()-1))
    console.log(dateHoje, dateOntem)
    const urlJuno = `https://ziro-app-juno.herokuapp.com/listar-cobrancas?paymentDateStart=${dateOntem}&paymentDateEnd=${dateHoje}`
    const usernameJuno = process.env.userJuno
    const passwordJuno = process.env.pdwJuno
    const authJuno = "Basic " + new Buffer.from(usernameJuno + ":" + passwordJuno).toString("base64");
    let optionsJuno = {
        method: "GET",
        url:urlJuno,
        headers:{
            "token": process.env.tokenNosso,
            "Authorization": authJuno
        },
        json: true
    }
    let dataJuno = await rp(optionsJuno)

    // Tratativa do array para puxar somente o necessário -- > Mudar os parametros do loop para charges.id, charges.code e charges.dueDate
    let arrayID = []
    let charges = dataJuno._embedded.charges

    for (i = 0; i< charges.length; i++){
        arrayID.push([dataJuno._embedded.charges[i].id, dataJuno._embedded.charges[i].code, dataJuno._embedded.charges[i].dueDate]);
    }
    // Requisição POST googlesheets
    const url = "https://sheets.ziro.app/.netlify/functions/api"
    const username = process.env.userSheets
    const password = process.env.pdwSheets
    const auth = "Basic " + new Buffer.from(username + ":" + password).toString("base64");

    let optionsGoogle = {
        method: "POST",
        url:url,
        headers: {
            "Origin": "https://ziro.app",
            "Content-type": "application/json",
            "Authorization": auth
        },
        body : {
            
            "apiResource": "values",
            "apiMethod": "append",
            "spreadsheetId": process.env.sheetsId,
            "range": "BoletosPag!A2",
            "resource": {
                "values": arrayID
            },
            "valueInputOption": "raw"
        },
        json: true
    }
    let now = new Date();
    let hora = now.getUTCHours()
    if(hora = 10){
        try {
            let data = await rp(optionsGoogle)
            console.log("Informações do POST", data, "Array Postado", optionsGoogle.body.resource.values)
        } catch (error) {
            console.log(error)
        }
    }else{
        console.log('Hora errada')
    }
}

main();