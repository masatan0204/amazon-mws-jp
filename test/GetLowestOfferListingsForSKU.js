var mws         = require("../lib/index.js");
var sku        = "TM-201705-037";

mws.products.GetLowestOfferListingsForSKU({
    SellerSKUList: {"SellerSKUList.SellerSKU.1": sku},
    ItemCondition : 'New'
  }, function(err, data){
    console.log(data);
  }
);

