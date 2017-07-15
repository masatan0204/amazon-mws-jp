var mws         = require("../lib/index.js");

mws.products.ListMatchingProducts({
    Query:"star"
  }, function(err, data){
    console.log(data);
  }
);

