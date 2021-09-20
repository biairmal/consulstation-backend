const express = require('express')
const app = express()

const port = 8000

app.get('/', (req,res) => {
    res.send("Test asdasdsad")
})

app.listen(port, ()=> {
    console.log(`LISTENING ON PORT:${port}`)
})

