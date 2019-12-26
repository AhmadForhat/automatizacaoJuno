const express = require('express')
const app = express()
const rp = require('request-promise-native')

app.post('/', async (req,res) => {
    const url = ""
    let options = {
        method: 'GET',
        url:url,
        body: {

        },
        json: true
    };

    try {
        let data = await rp(options)
        res.json({data})

    } catch (err) {
        res.json(err)
    }
}