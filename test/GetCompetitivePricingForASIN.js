var mws         = require("../lib/index.js");
var asin        = "B015CPT37I";

mws.products.GetCompetitivePricingForASIN({
    ASINList: {"ASINList.ASIN.1": asin}
  }, function(err, data){
    console.log(data);
  }
);

