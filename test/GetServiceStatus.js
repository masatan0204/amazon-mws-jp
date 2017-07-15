var mws         = require("../lib/index.js");
var asin        = "B015CPT37I";

mws.products.GetServiceStatus(
  function(err, data){
    console.log(data);
  }
);

