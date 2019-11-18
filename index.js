const express = require('express')
const app = new express()

app.get('/', function(req, res){
    res.send("app conectado");
});

app.listen(3000, function(){
    console.log('servidor conectado')
})