var mws         = require("../lib/index.js");
var asin        = "B015CPT37I";

mws.products.GetProductCategoriesForASIN({
    ASIN: asin
  }, function(err, data){
    console.log(data);
  }
);

