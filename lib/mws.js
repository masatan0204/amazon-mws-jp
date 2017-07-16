/**
 * MWS API request module
 *
 * @author Masayuki Tanabe
 */
var crypto = require('crypto');
var qs     = require("querystring");
var https  = require("https");
var _      = require('underscore');
var config = require("../config/config.json");

var url = "mws.amazonservices.jp";
var endpoint = {
    'Products': {
        'type': '/Products/',
        'version': '2011-10-01'
    },
    "Sellers": {
        type: "/Sellers/",
        version: "2011-07-01"
    },
    'Orders': {
        'type': /Orders/,
        'version': '2013-09-01'
    },
    'Feeds': {
        'type': '/',
        'version': '2009-01-01'
    },
    'Reports': {
        'type': '/',
        'version': '2009-01-01'
    },
    'FullFillment': {
        'type': '/',
        'version': '2010-10-01'
    },
    'Finances': {
        'type': '/Finances/',
        'version': '2015-05-01'
    }
};
module.exports = {

    createRequest: function (params, cb) {
        var tstamp = new Date().toISOString();
        tstamp = tstamp.replace(/\..+/, '') + 'Z';
        params["timestamp"] = tstamp;
        var paramObj = {
            'AWSAccessKeyId': config.AWSAccessKeyId,
            'Action': params.action,
            'SellerId': config.SellerId,
            'SignatureVersion': '2',
            'SignatureMethod': 'HmacSHA256',
            'Timestamp': tstamp,
            'Version': endpoint[params.type].version
        };

        _.extend(paramObj, params.parameters);

        paramObj['Signature'] = this.generateSignature(config, paramObj, params.type);

        var body = qs.stringify(paramObj);
        body = body.replace(/%253A/g, "%3A");

        var headers = {
            'Host': url,
            'User-Agent': 'mws-jsr/0.1.0 (Language=Javascript)',
            'Content-Type': 'text/xml'
        };

        var endpointStr = endpoint[params.type].type + endpoint[params.type].version;
        if(params.type == "FullFillment"){
          endpointStr = '/FulfillmentInventory/' + endpoint[params.type].version;
        }

        var options = {
            host: url,
            port: 443,
            //path: endpoint[params.type].type + endpoint[params.type].version + "?" + body,
            path: endpointStr + "?" + body,
            method: "POST",
            headers: headers
        };

        // debug
        //console.log("request=" + options.path);
        var req = https.request(options, function (res) {
            var data = '';
            // Append each incoming chunk to data variable
            res.addListener('data', function (chunk) {
                data += chunk.toString();
            });
            // When response is complete, parse the XML and pass it to callback
            res.addListener('end', function () {
                    cb(null, data);
            });
        });
        req.write(body);
        req.end();
    },

    generateSignature: function (config, params, ep) {
        hmac = crypto.createHmac("sha256", config.SecretKey);

        var keys = [];
        for (var key in params) {
            keys.push(key);
        }
        keys.sort();
        var sorted = {};
        for (var i = 0; i < keys.length; i++) {
            sorted[keys[i]] = params[keys[i]];
        }
        sorted.Timestamp = params.Timestamp.replace(/:/g, "%3A");
        joinedParameters = [];
        for (var key in sorted) {
            if (/.*Date.*/g.test(key)) {
                sorted[key] = sorted[key].replace(/:/g, "%3A");
            }
            joinedParameters.push(key + "=" + sorted[key]);
        }
        var strParams = joinedParameters.join('&');
        if(ep == 'FullFillment'){
          var queryRequest = ['POST', url, ('/FulfillmentInventory/' + endpoint[ep].version), strParams].join('\n');
        }else{
          var queryRequest = ['POST', url, endpoint[ep].type + endpoint[ep].version, strParams].join('\n');
        }

        var stringToSign = queryRequest;
        stringToSign = stringToSign.replace(/'/g, "%27");
        stringToSign = stringToSign.replace(/\*/g, "%2A");
        stringToSign = stringToSign.replace(/\(/g, "%28");
        stringToSign = stringToSign.replace(/\)/g, "%29");
        stringToSign = stringToSign.replace(/ /g, "%20");
        queryRequest = stringToSign;
        var result = hmac.update(queryRequest).digest("base64");

        return result;

    },

    checkConfig: function() {
      if(!config.SellerId){
        console.log("please input SellerId. (config/config.json) ");
        return false;
      }
      if(!config.DeveloperAccountNumber){
        console.log("please input DeveloperAccountNumber. (config/config.json) ");
        return false;
      }
      if(!config.AWSAccessKeyId){
        console.log("please input AWSAccessKeyId. (config/config.json) ");
        return false;
      }
      if(!config.SecretKey){
        console.log("please input SecretKey. (config/config.json) ");
        return false;
      }
      if(!config.MarketplaceId){
        console.log("please input MarketplaceId. (config/config.json) ");
        return false;
      }
              
      return true;
    }

};
