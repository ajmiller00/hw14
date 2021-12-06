var MongoClient = require('mongodb').MongoClient;
var fs = require('fs'); 
var csv = require('csv-parser');
var url = "mongodb+srv://amille26:cs20hw14@cluster0.ocphp.mongodb.net/stockticker?retryWrites=true&w=majority";

function main() 
{
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  if(err) { return console.log(err); }
  
  var dbo = db.db("stockticker");
  var collection = dbo.collection('companies');

  fs.createReadStream('./companies.csv') // change for other data
  .pipe(csv())
  .on('data', function(data){
      try {
        var newData = {"company" : data.Company, "ticker" : data.Ticker};
        collection.insertOne(newData, function(err, res) {
          if(err) { console.log("query err: " + err); return; }
        });
      }
      catch(err) {
          return console.log("catch err: " + err);
      }
  })
  console.log("Success!");
});
}

main();