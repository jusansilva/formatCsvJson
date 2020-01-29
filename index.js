const express = require('express')
const app = new express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var multer = require('multer')
var upload = multer({ dest: 'temp/' })
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.post('/convert', upload.single('file'), function (req, res) {
    var file = req.file.originalname

    if (file.indexOf(".json") != -1) {
        var doc = JsonToCSV(req.file.path)
        res.send(doc)
    } else if (file.indexOf(".csv") != -1) {
        var doc = csvToJSON(req.file)
        res.send(doc)
    } else {
        console.log('ouve um erro na sua requisição!')
        res.send(req.file);
    }
});

/**
 * Json to Csv
 *  
 * Pega um objeto Json e transforma em Csv.
 * 
 * @param {*} objArray 
 * 
 * @return {*} Json 
 */
function JsonToCSV(objArray) {
    let rawdata = fs.readFileSync(objArray);
    var array = JSON.parse(rawdata.toString());

    async () => {
        const csv = new ObjectsToCsv(objArray);

        // Save to file:
        await csv.toDisk('./test.csv');

        // Return the CSV file as string:
        return await csv.toString();
    };
}

/**
 * Csv to Json
 * 
 * Pega um arquivo Csv e codifica para Json
 * 
 * @param {*} csv 
 * 
 * @return csv 
 */
function csvToJSON(csv) {

    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}


function typeOf(obj) {
    return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

/**
 * retora a conexao
 */
app.listen(5000, function () {
    console.log('servidor conectado')
})