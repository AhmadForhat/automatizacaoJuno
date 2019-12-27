const CronJob = require('cron').CronJob;
const rp = require('request-promise-native')

new CronJob('*/5 * * * * *', async function() {
    require('dotenv').config()
    // Requisição get Juno consulta
    function convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat)
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
      }
    const date = new Date()
    const dateHoje = convertDate(date.setDate(date.getDate()))
    const dateOntem = convertDate(date.setDate(date.getDate() - 1))
    const urlJuno = `https://ziro-app-juno.herokuapp.com/consulta-pagamentos?beginPaymentDate=${dateOntem}&endPaymentDate=${dateHoje}`
    const usernameJuno = process.env.userJuno
    const passwordJuno = process.env.pdwJuno
    const authJuno = "Basic " + new Buffer.from(usernameJuno + ":" + passwordJuno).toString("base64");
    let optionsJuno = {
        method: "GET",
        url:urlJuno,
        headers:{
            "token": "2sKUvYTceiMgDoSo3xTsXefMYUDACTU98Ryqh5ypByBU",
            "Authorization": authJuno
        },
        json: true
    }
    let dataJuno = await rp(optionsJuno)

    // Tratativa do array para puxar somente o necessário
    let arrayID = []
    let charges = dataJuno.data.data.charges

    for (i = 0; i< charges.length; i++){
        arrayID.push([dados.data.data.charges[i].payments[0].id, dados.data.data.charges[i].payments[0].date]);
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
            "range": "Test!A1:C1",
            "resource": {
                "values": arrayID
            },
            "valueInputOption": "raw"
        },
        json: true
    }
    try {
        let data = await rp(optionsGoogle)
        console.log("Informações do POST", data, "Array Postado", arrayID)
    } catch (error) {
        console.log(error)
    }
}, null, true, 'America/Sao_Paulo');