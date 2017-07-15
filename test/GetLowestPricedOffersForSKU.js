var mws         = require("../lib/index.js");
var sku        = "TM-201705-037";

mws.products.GetLowestPricedOffersForSKU({
    SellerSKU: sku,
    ItemCondition : 'New'
  }, function(err, data){
    console.log(data);
  }
);

