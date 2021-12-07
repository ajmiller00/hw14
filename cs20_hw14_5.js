var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://amille26:cs20hw14@cluster0.ocphp.mongodb.net/stockticker?retryWrites=true&w=majority";

var port = process.env.PORT || 3000;
// var port = 8080;
  
http.createServer(function (req, res) {
    adr = req.url
    
    if (adr == "/")
    {
      file = 'cs20_hw14_2.html';
      fs.readFile(file, function(err, txt) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(txt);
      // res.end();
      });
//     }
//     else if (adr.startsWith('/process'))
//     {
//       file1 = 'cs20_hw14_2.html';
//       fs.readFile(file1, function(err, txt) {
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(txt);

        pdata = "";
        req.on('data', data => {
             pdata += data.toString();
        });

        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if(err) { console.log("Connection err: " + err); return; }
            
            var dbo = db.db("stockticker");
            var coll = dbo.collection('companies');

			

	            theQuery = "";
	            if (pdata['rad'] == 'symbol' && input != "") {
	              theQuery = {ticker: input};
	            }
	            else if (pdata['rad'] == 'name' && input != "") {
	              theQuery = {company: input};
	            }
	            if (theQuery != "") {
	              coll.find(theQuery).toArray(function(err, items) {
	                if (err) {
	                  console.log("Error: " + err);
					  res.end();
			  		  db.close();
	                } 
	                else 
	                {
	                for (i=0; i<items.length; i++)
	                  res.write("<br>" + (i+1) + ". <br>Company Name: " + items[i].company + "<br>Ticker Symbol: " + items[i].ticker + "<br>");      
	                }
	                if (items.length == 0) {
	                  res.write("<br>No match for input");
	                }
					res.end();
		  			db.close(); 
	              });
			
	            } else {
					res.end();
		  			db.close(); 

				}
				
        });

        req.on('end', () => {
          pdata = qs.parse(pdata);
          global.input = pdata['user_input'];
        });
      
    
    }
    else 
    {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write ("Unknown page request");
      res.end();
    }

}).listen(port);
