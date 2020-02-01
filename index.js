const express = require('express')
const app = new express()
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp/'
}));
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');

app.use('/exports', express.static(process.cwd() + '/exports'))
app.use('/tmp', express.static(process.cwd() + '/tmp'))


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.post('/convert', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    doc = req.files.file

    var name = req.files.file.name

    if (name.indexOf(".json") != -1) {
        var docs = JsonToCSV(doc.tempFilePath)
        console.log(docs)
        res.send(docs)
    } else if (name.indexOf(".csv") != -1) {
        var docs = csvToJSON(doc.tempFilePath)
        res.send(docs)
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
    let json
    let rawdata = fs.readFileSync(objArray, (erro, data) => {
        json = JSON.parse(data.toString());
        console.log(data)

         const csv = new ObjectsToCsv(json);

        const filename = uuid.v4() + ".csv"
        fs.writeFile('./exports/' + filename, csv, function (err,data) {
            if (err) throw err;
            console.log('file saved');
        });

        // Return the CSV file as string:
        return  data
    });

 
       
    
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

    var lines = csv.toString().split("\n");

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