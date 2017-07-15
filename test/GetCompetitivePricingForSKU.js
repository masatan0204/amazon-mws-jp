var mws         = require("../lib/index.js");
var sku         = "TM-201705-037";

mws.products.GetCompetitivePricingForSKU({
    SellerSKUList: {"SellerSKUList.SellerSKU.1": sku}
  }, function(err, data){
    console.log(data);
  }
);

