var mws         = require("../lib/index.js");
var sku         = "TM-201705-037";

mws.products.GetProductCategoriesForSKU({
    SellerSKU: sku
  }, function(err, data){
    console.log(data);
  }
);

