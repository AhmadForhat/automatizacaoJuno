const optionsSheets = (dataJuno) =>{
    let arrayID = []

    let charges = dataJuno._embedded.charges
    for (i = 0; i< charges.length; i++){
        arrayID.push([dataJuno._embedded.charges[i].id, dataJuno._embedded.charges[i].code, dataJuno._embedded.charges[i].dueDate]);
    }

    const url = "https://sheets.ziro.app/.netlify/functions/api"
    const username = process.env.userSheets
    const password = process.env.pdwSheets
    const auth = "Basic " + new Buffer.from(username + ":" + password).toString("base64");

    return {
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
}

module.exports = optionsSheets