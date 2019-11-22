const express = require('express')
const app = new express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));


app.get('/', function(req, res){
    res.sendFile(__dirname + "/views/index.html");
});

app.post('/convert', function(req, res){
    var file = req.body.file
    var convert = req.body.convert

    switch (convert) {
        case "0":
            var doc = JsonToCSV(file)
            res.sendFile(doc)
            break;
        case "1":
            var doc = csvToJSON(file)
            res.send(doc)
            break;
        default:
        console.log('ouve um erro na sua requisição!')
            res.send(req.body);
            break;
    }
    res.sendFile(__dirname + "/views/json.html");
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
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
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
function csvToJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }
  
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

/**
 * retora a conexao
 */
app.listen(5000, function(){
    console.log('servidor conectado')
})