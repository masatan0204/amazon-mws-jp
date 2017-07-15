var mws         = require("../lib/index.js");
var isbn        = "4320026926";

mws.products.GetMatchingProductForId({
    IdType:"ISBN",
    IdList: {"IdList.Id.1": isbn}
  }, function(err, data){
    console.log(data);
  }
);

