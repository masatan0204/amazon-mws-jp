var mws         = require("../lib/index.js");
var asin        = "B015CPT37I";

mws.products.GetMyFeesEstimate({
    IdType:"ASIN",
    ASIN:asin,
    IsAmazonFulfilled:true,
    price:3000,
    shipping:0
  }, function(err, data){
    console.log(data);
  }
);

