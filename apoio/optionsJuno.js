const optionsJuno = () => {
        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat)
            return [d.getFullYear(),pad(d.getMonth()+1), pad(d.getDate())].join('-')
        }
        const date = new Date()
        const dateHoje = convertDate(date.setDate(date.getDate()))
        const dateOntem = convertDate(date.setDate(date.getDate()-1))
        const urlJuno = `https://ziro-app-juno.herokuapp.com/listar-cobrancas?paymentDateStart=${dateOntem}&paymentDateEnd=${dateHoje}`
        const usernameJuno = process.env.userJuno
        const passwordJuno = process.env.pdwJuno
        const authJuno = "Basic " + new Buffer.from(usernameJuno + ":" + passwordJuno).toString("base64");
        return {
            method: "GET",
            url:urlJuno,
            headers:{
                "token": process.env.tokenNosso,
                "Authorization": authJuno
            },
            json: true
    }
}

module.exports = optionsJuno