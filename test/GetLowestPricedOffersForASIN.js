var mws         = require("../lib/index.js");
var asin        = "B015CPT37I";

mws.products.GetLowestPricedOffersForASIN({
    ASIN: asin,
    ItemCondition : 'New'
  }, function(err, data){
    console.log(data);
  }
);

