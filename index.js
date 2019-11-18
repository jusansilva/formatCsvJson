const express = require('express')
const app = new express()

app.get('/', function(req, res){
    res.sendFile(__dirname + "/views/index.html");
});

app.post('/forJson', function(req, res){
    res.sendFile(__dirname + "/views/json.html");
});

app.post('/forCsv', function(req, res){
    res.sendFile(__dirname + "/views/csv.html");
});


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


app.listen(5000, function(){
    console.log('servidor conectado')
})