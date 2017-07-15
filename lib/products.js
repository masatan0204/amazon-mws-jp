/**
 * MWS 商品API 商品 - バージョン2011-10-01　
 *
 * @author Masayuki Tanabe
 */

var mws = require('./mws');
var _ = require('underscore');
var config = require("../config/config.json");

module.exports = {

    ItemCondition: [
        'Any', 'New', 'Used', 'Collectible', 'Refurbished', 'Club'
    ],

    /**
     * function    : GetServiceStatus
     * description : 商品APIセクションの動作ステータスを返します。
     *   GetServiceStatusオペレーションは、AmazonマーケットプレイスWebサービス(Amazon MWS)の商品APIセクションのオペレーションステータスを返します。ステータス値はGREEN、GREEN_I、YELLOW、REDです。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetServiceStatus.html
     *
     * param cb    : callback function
     * return      : MWS API result (xml)
     *
     * example of execution.
     * GetServiceStatus(function(err, result){
     *   console.log(result);
     * });
     */
    GetServiceStatus: function (cb) {
        mws.createRequest({
            'action': 'GetServiceStatus',
            'parameters': {},
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : ListMatchingProducts
     * description : 検索クエリに応じた、商品およびその属性のリストを返します。
     *   ListMatchingProductsオペレーションは、指定した検索クエリに応じた、商品およびその属性のリストを関連性の高い順に返します。検索クエリには、商品を表す文字列、またはGCID、UPC、EAN、ISBN、JANなどの商品IDを指定できます。商品のASINが分かっている場合は、GetMatchingProductオペレーションを使用します。商品IDとしてSellerSKUは指定できません。条件に一致する商品がない場合、キーワードのスペルを訂正するかキーワードを減らすことでクエリの検索対象が拡大されます。最大で10商品を返し、購入不可商品は含まれません。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_ListMatchingProducts.html
     *
     * param params : query string
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("star"という文字列で検索する場合)
     * ListMatchingProducts({
     *   Query:"star"
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    ListMatchingProducts: function (params, cb) {
        var parameters = {
            'MarketplaceId': config.MarketplaceId,
            'Query': params['Query']
        };
        if (_.has(params, 'QueryContextId')) {
            parameters['QueryContextId'] = params['QueryContextId'];
        }
        mws.createRequest({
            'action': 'ListMatchingProducts',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : GetMatchingProduct
     * description : ASINのリストに応じた、商品およびその属性のリストを返します。
     *   GetMatchingProductオペレーションは、指定したASINのリストに応じた、商品およびその属性のリストを返します。このオペレーションは最大10商品を返します。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetMatchingProduct.html
     *
     * param params : ASINList
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("B015CPT37I"というASINの商品を情報を取得する場合)
     * GetMatchingProduct({
     *   ASINList: {"ASINList.ASIN.1": "B015CPT37I"},
     *     ItemCondition : 'New'
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetMatchingProduct: function (params, cb) {
        var parameters = {
            'MarketplaceId': config.MarketplaceId
        };

        for (var key in params['ASINList']) {
            if (/ASINList.ASIN.[1-5]{1}/.test(key)) {
                parameters[key] = params['ASINList'][key];
            }
        }
        mws.createRequest({
            'action': 'GetMatchingProduct',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : GetMatchingProductForId
     * description : ASIN、GCID、SellerSKU、UPC、EAN、ISBN、およびJANのリストに応じた、商品およびその属性のリストを返します。
     *   GetMatchingProductForIdオペレーションは、指定した商品IDのリストに応じた商品およびその属性のリストを返します。商品IDには、ASIN、GCID、SellerSKU、UPC、EAN、ISBN、JANがあります。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetMatchingProductForId.html
     *
     * param params : IdType, IdList
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("4320026926"というISBNの商品を情報を取得する場合)
     * GetMatchingProductForId({
     *     IdType:"ISBN",
     *     IdList: {"IdList.Id.1": "4320026926"}
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetMatchingProductForId: function (params, cb) {
        if (params['IdType'] !== 'ASIN' && params['IdType'] !== 'GCID' && params['IdType'] !== 'SellerSKU' && params['IdType'] !== 'UPC' && params['IdType'] !== 'EAN' && params['IdType'] !== 'JAN' && params['IdType'] !== 'ISBN') {
            cb({
                'Error': "unknown IdType. Allowed are ASIN, GCID, SellerSKU, UPC, EAN, ISBN, JAN"
            }, null);
            return;
        }

        var parameters = {
            'MarketplaceId': config.MarketplaceId,
            'IdType': params['IdType']
        };

        for (var key in params['IdList']) {
            if (/IdList.Id.[1-5]{1}/g.test(key)) {
                parameters[key] = params['IdList'][key];
            }
        }
        mws.createRequest({
            'action': 'GetMatchingProductForId',
            'config': config,
            'parameters': parameters,
            'type': 'Products',
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : GetCompetitivePricingForSKU
     * description : SellerSKUに応じた、商品の現在の競合価格を返します。
     *   GetCompetitivePricingForSKUオペレーションは、指定したSellerSKUおよびMarketplaceIdに応じた、商品の現在の競合価格を返します。
     *   SellerSKUは、出品者のSellerIdにより限定されます。SellerIdは、送信する各AmazonマーケットプレイスWebサービス(Amazon MWS)オペレーションに含まれます。
     *   このオペレーションは、「ショッピングカートボックスを獲得した新品の価格」と「ショッピングカートボックスを獲得した中古品の価格」の2種類の価格モデルに応じたアクティブな出品一覧を返します。
     *   これらの価格モデルは、AmazonマーケットプレイスWebサイトの商品詳細ページ上の、主要ショッピングカートボックス獲得価格とその下位の獲得価格にそれぞれ相当します。
     *   アクティブな出品一覧の商品が、このどちらの価格も返さない場合があります。たとえば、ある商品を出品しているすべての出品者が、新品または中古品のショッピングカートボックスを獲得する要件を満たしていない場合などです。
     *   また、指定したSellerSKUに対する出品者自身の価格もレスポンスに含まれるため、それが最低の出品価格である場合、出品者自身の価格が返されます。
     *   指定したSellerSKUに対する出品一覧数やtrade-in値(使用可能な場合)、売上ランキング情報も返されます。
     *
     *   注: バリエーションの親商品のSellerSKUを指定した場合、エラーが返されます。バリエーションの親商品は一般的な商品概要を表し、販売できません。
     *   バリエーションの子商品は商品の特性(サイズや色など)を表し、販売可能です。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetCompetitivePricingForSKU.html
     *
     * param params : SellerSKUList
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("TM-201705-037"というSKUの商品を情報を取得する場合)
     * GetCompetitivePricingForSKU({
     *     SellerSKUList: {"SellerSKUList.SellerSKU.1": "TM-201705-037"}
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetCompetitivePricingForSKU: function (params, cb) {

        var parameters = {
            'MarketplaceId': config.MarketplaceId
        };

        var counter = 1;
        for (var key in params['SellerSKUList']) {
            if (/SellerSKUList.SellerSKU.[1-9]{1}[1-9]*/.test(key)) {
                parameters[key] = params['SellerSKUList'][key];
            }
            counter++;
            if (counter > 20) {
                break;
            }
        }
        mws.createRequest({
            'action': 'GetCompetitivePricingForSKU',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : GetCompetitivePricingForASIN
     * description : ASINに応じた、商品の現在の競合価格を返します。
     *   GetCompetitivePricingForASINオペレーションは、商品を一意に識別するためにMarketplaceIdとASINを指定する点と、SKUIdentifier要素を返さない点を除き、GetCompetitivePricingForSKUオペレーションと同様です。商品のASINが不明な場合、それを明らかにするため、まず始めにListMatchingProductsオペレーションを送信する必要があります。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetCompetitivePricingForASIN.html
     *
     * param params : ASINList
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("B015CPT37I"というASINの商品を情報を取得する場合)
     * GetCompetitivePricingForASIN({
     *     ASINList: {"ASINList.ASIN.1": "B015CPT37I"}
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetCompetitivePricingForASIN: function (params, cb) {
        var parameters = {
            'MarketplaceId': config.MarketplaceId
        };

        var counter = 1;
        for (var key in params['ASINList']) {
            if (/ASINList\.ASIN\.[1-9]{1}[1-9]*/.test(key)) {
                parameters[key] = params['ASINList'][key];
            }
            counter++;
            if (counter > 20) {
                break;
            }
        }
        mws.createRequest({
            'action': 'GetCompetitivePricingForASIN',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : GetLowestOfferListingsForSKU
     * description : SellerSKUに応じた、最低価格のアクティブな出品の価格情報を最大20個まで返します。
     *   GetLowestOfferListingsForSKUオペレーションは、指定した商品の最低価格の出品一覧(コンディション別)を返します。指定した商品およびItemConditionの一覧は、以下の6つの条件の組み合わせで定義される、出品一覧グループに分類されます。
     *
     *   ItemCondition (New、 Used、 Collectible、 Refurbished、 Club)
     *   ItemSubcondition (New、Mint、Very Good、Good、Acceptable、Poor、Club、OEM、Warranty、Refurbished Warranty、Refurbished、Open Box、 またはOther)
     *   FulfillmentChannel (AmazonまたはMerchant)
     *   ShipsDomestically (True、False、またはUnknown) – リクエストに指定されているマーケットプレイスと、商品の発送元国が同じかどうかを示す。
     *   ShippingTime (0-2 days、3-7 days、8-13 days、または14 or more days) – 注文されてから商品が出荷されるまでの通常の最長準備期間を表す。
     *   SellerPositiveFeedbackRating (98-100%、95-97%、90-94%、80-89%、70-79%、Less than 70%、またはJust launched) – 過去12か月以上の良い評価の割合を%で表す。
     *   指定した商品およびItemConditionに対する一部の(必ずしも全部ではない)アクティブな出品一覧は、まず配送料を含む最低価格でソートされ、対応する出品一覧グループに分類され、グループごとの最低価格を返します。グループ内に最低価格で出品している出品者が複数いる場合は、フィードバック数が最も多い出品者の出品一覧が返されます。出品一覧が存在しないグループは返されません。
     *
     *   このオペレーションは、レスポンス要素AllOfferListingsConsideredを返します。この要素は、指定した商品およびItemConditionに応じたアクティブな出品一覧のすべてが、対応する出品一覧グループに分類される際に考慮されたかどうかを示します。もしすべてが考慮されなかった場合でも、以下の結果が期待できます。
     *
     *   返された最低価格は、対応する出品一覧グループにおける最低配送料込み価格である。
     *   返された最低価格は、考慮されなかったすべての出品の最低配送料込み価格より低い。
     *   注: GetLowestOfferListingsForSKUオペレーションを送信した場合、ExcludeMeリクエストパラメーターをTrueの値で使用しない限り、出品者の出品商品もレスポンスに含まれます。
     *   注: 指定した商品の最低価格の出品(コンディション別)を取得するには、GetLowestOfferListingsForSKUオペレーションの代わりにGetLowestPricedOffersForSKUオペレーションを呼び出してみてください。
     *   また、サブスクリプションAPIセクションを使ってAnyOfferChanged通知をサブスクライブします。この通知をサブスクライブすると、出品している商品について、コンディション(新品または中古品)別の上位20の出品に価格変更または出品情報の変更があるたびに通知が送信されます。
     *   
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetLowestOfferListingsForSKU.html
     *
     * param params : SellerSKUList
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("TM-201705-037"というSKUの商品を情報を取得する場合)
     * GetLowestOfferListingsForSKU({
     *     SellerSKUList: {"SellerSKUList.SellerSKU.1": "TM-201705-037"},
     *     ItemCondition : 'New'
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     *
     */
    GetLowestOfferListingsForSKU: function (params, cb) {
        var parameters = {
            'MarketplaceId': config.MarketplaceId
        };

        var counter = 1;
        for (var key in params['SellerSKUList']) {
            if (/SellerSKUList.SellerSKU.[1-9]{1}[1-9]*/.test(key)) {
                parameters[key] = params['SellerSKUList'][key];
            }
            counter++;
            if (counter > 20) {
                break;
            }
        }
        if (_.has(params, 'ItemCondition')) {
            parameters['ItemCondition'] = params['ItemCondition'];
        }

        if (_.has(params, 'ExcludeMe') && (params['ExludeMe'] === 'True' || params['ExludeMe'] === 'False')) {
            parameters['ExcludeMe'] = params['ExcludeMe'];
        }

        mws.createRequest({
            'action': 'GetLowestOfferListingsForSKU',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : GetLowestOfferListingsForASIN
     * description : SINに応じた、最低価格のアクティブな出品の価格情報を最大20個まで返します。
     *   GetLowestOfferListingsForASINオペレーションは、商品を一意に識別するためにMarketplaceIdとASINを指定する点と、SKUIdentifier要素を返さない点を除き、GetLowestOfferListingsForSKUオペレーションと同様です。
     *   注: 指定した商品の最低価格の出品一覧(コンディション別)を取得するには、GetLowestOfferListingsForASINオペレーションの代わりにGetLowestPricedOffersForASINオペレーションを呼び出すことをご検討ください。
     *   また、サブスクリプションAPIセクションを使ってAnyOfferChanged通知のサブスクライブも可能です。この通知をサブスクライブすると、出品している商品について、コンディション(新品または中古品)別の上位20の出>品に価格変更または出品情報の変更があるたびに通知が送信されます。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetLowestOfferListingsForASIN.html
     *
     * param params : ASINList
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("B015CPT37I"というASINの商品を情報を取得する場合)
     * GetLowestOfferListingsForASIN({
     *     ASINList: {"ASINList.ASIN.1": "B015CPT37I"},
     *     ItemCondition : 'New'
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetLowestOfferListingsForASIN: function (params, cb) {
        var parameters = {
            'MarketplaceId': config.MarketplaceId
        };

        var counter = 1;
        for (var key in params['ASINList']) {
            if (/ASINList.ASIN.[1-9]{1}[1-9]*/.test(key)) {
                parameters[key] = params['ASINList'][key];
            }
            counter++;
            if (counter > 20) {
                break;
            }
        }

        if (_.has(params, 'ItemCondition')) {
            parameters['ItemCondition'] = params['ItemCondition'];
        }

        if (_.has(params, 'ExcludeMe') && (params['ExludeMe'] === 'True' || params['ExludeMe'] === 'False')) {
            parameters['ExcludeMe'] = params['ExcludeMe'];
        }

        mws.createRequest({
            'action': 'GetLowestOfferListingsForASIN',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : GetMyPriceForSKU
     * description : SellerSKUに応じた、出品者自身の出品の価格情報を返します。
     *   GetMyPriceForSKUオペレーションは、指定したSellerSKUとMarketplaceIdにマッピングされているASINに基づき、出品者自身の出品の価格設定情報を返します。出品していない商品のSellerSKUを送信した場合は、Offers要素が空の状態で返されます。このオペレーションは、商品の価格情報を最大20件返します。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetMyPriceForSKU.html
     *
     * param params : SellerSKUList'
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("TM-201705-037"というSKUの商品を情報を取得する場合)
     * GetMyPriceForSKU({
     *     SellerSKUList: {"SellerSKUList.SellerSKU.1": "TM-201705-037"},
     *     ItemCondition : 'New'
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetMyPriceForSKU: function (params, cb) {
        var parameters = {
            'MarketplaceId': config.MarketplaceId
        };

        var counter = 1;
        for (var key in params['SellerSKUList']) {
            if (/SellerSKUList.SellerSKU.[1-9]{1}[1-9]*/.test(key)) {
                parameters[key] = params['SellerSKUList'][key];
            }
            counter++;
            if (counter > 20) {
                break;
            }
        }
        if (_.has(params, 'ItemCondition')) {
            parameters['ItemCondition'] = params['ItemCondition'];
        }

        mws.createRequest({
            'action': 'GetMyPriceForSKU',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * function    : GetMyPriceForASIN
     * description : ASINに応じた、出品者自身の出品の価格情報を返します。
     *   GetMyPriceForASINオペレーションは、商品を一意に識別するためにMarketplaceIdとASINを指定する点と、SKUIdentifier要素を返さない点を除き、GetMyPriceForSKUオペレーションと同様です。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetMyPriceForASIN.html
     *
     * param params : ASINList'
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("B015CPT37I"というASINの商品を情報を取得する場合)
     * GetMyPriceForASIN({
     *     ASINList: {"ASINList.ASIN.1": "B015CPT37I"},
     *     ItemCondition : 'New'
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetMyPriceForASIN: function (params, cb) {
        var parameters = {
            'MarketplaceId': config.MarketplaceId
        };

        var counter = 1;
        for (var key in params['ASINList']) {
            if (/ASINList.ASIN.[1-9]{1}[1-9]*/.test(key)) {
                parameters[key] = params['ASINList'][key];
            }
            counter++;
            if (counter > 20) {
                break;
            }
        }
        if (_.has(params, 'ItemCondition')) {
            parameters['ItemCondition'] = params['ItemCondition'];
        }

        mws.createRequest({
            'action': 'GetMyPriceForASIN',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },

    /**
     * @absract Returns the parent product categories that a product belongs to, based on SellerSKU.
     * @description The GetProductCategoriesForSKU operation returns the product category name and identifier that a product belongs to, including parent categories back to the root for the marketplace.
     * @param {Object} config Configuration file
     * @param {Object} params Required: MarketplaceId, SellerSKU
     * @param {Boolean} xml flag. If true, returns raw xml although returns object
     * @param {Function} cb Callback function
     * @see http://docs.developer.amazonservices.com/en_US/products/Products_GetProductCategoriesForSKU.html
     */
    GetProductCategoriesForSKU: function (config, params, xml, cb) {
        if (typeof xml == 'function') {
            cb = xml;
            xml = false;
        } else if (typeof xml == 'undefined') {
            console.warn("No callback provided. Throwing the request");
            return;
        }

        if (!_.has(params, 'MarketplaceId') || !_.has(params, 'SellerSKU')) {
            cb({
                "Error": "You need to pass parameter MarketplaceId and SellerSKU"
            }, null);
            return;
        }
        var parameters = {
            'MarketplaceId': params['MarketplaceId'],
            'SellerSKU': params['SellerSKU']
        };

        mws.createRequest({
            'action': 'GetProductCategoriesForSKU',
            'config': config,
            'parameters': parameters,
            'type': 'Products',
            'xml': xml
        }, function (err, data) {
            cb(err, data);
        });

    },
    /**
     * function    : GetProductCategoriesForASIN
     * description : ASINに応じた、商品の親カテゴリーを返します。
     *   GetProductCategoriesForASINオペレーションは、商品を一意に識別するためにMarketplaceIdとASINを指定する点を除き、GetProductCategoriesForSKUオペレーションと同様です。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetProductCategoriesForASIN.html
     *
     * param params : ASINList'
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("B015CPT37I"というASINの商品を情報を取得する場合)
     * mws.products.GetProductCategoriesForASIN({
     *     ASIN: "B015CPT37I"
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetProductCategoriesForASIN: function (params, cb) {
        var parameters = {
            'MarketplaceId': config.MarketplaceId,
            'ASIN': params['ASIN']
        };

        mws.createRequest({
            'action': 'GetProductCategoriesForASIN',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });

    },
    /**
     * function    : GetLowestPricedOffersForSKU
     * description : SellerSKUに応じた、単一の商品の最低価格の出品情報を返します。
     *   GetLowestPricedOffersForSKUオペレーションは、指定した特定のMarketplaceId、SellerSKU、ItemConditionの、上位20の商品を返します。上位20の商品は、配送料込みの価格(価格+配送料)がどれだけ安いかによって決まります。複数の出品者が同じ配送料込み価格を設定している場合、結果は順不同で返されます。
     *   価格モデル
     *   このオペレーションは、「ショッピングカートボックスを獲得した新品の価格」と「ショッピングカートボックスを獲得した中古品の価格」の2種類の価格モデルに応じたアクティブな出品の価格設定を返します。これらの価格モデルは、AmazonマーケットプレイスWebサイトの商品詳細ページ上の、主要ショッピングカートボックス獲得価格とその下位の獲得価格にそれぞれ相当します。アクティブな出品のある商品が、このどちらの価格も返さない場合があります。たとえば、ある商品を出品しているすべての出品者が、新品または中古品のショッピングカートボックスを獲得する要件を満たしていない場合などです。指定したSellerSKUに対する出品者自身の価格もレスポンスに含まれるため、それが最低の出品価格である場合、出品者自身の価格が返されます。指定したSellerSKUに対する出品一覧数やtrade-in値(使用可能な場合)、売上ランキング情報も返されます。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetLowestPricedOffersForSKU.html
     *
     * param params : SellerSKU, ItemCondition'
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("TM-201705-037"というSKUの商品を情報を取得する場合)
     * var sku        = "TM-201705-037";
     *
     * GetLowestPricedOffersForSKU({
     *     SellerSKU: "TM-201705-037",
     *     ItemCondition : 'New'
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetLowestPricedOffersForSKU: function (params, cb) {
        var parameters = {
            "MarketplaceId": config.MarketplaceId,
            "SellerSKU": params['SellerSKU']
        };
        if (_.has(params, 'ItemCondition')) {
          parameters['ItemCondition'] = params['ItemCondition'];
        }
        mws.createRequest({
            'action': 'GetLowestPricedOffersForSKU',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },
    /**
     * function    : GetLowestPricedOffersForASIN
     * description : ASINに応じた、単一の商品の最低価格の出品情報を返します。
     *   GetLowestPricedOffersForASINオペレーションは、商品を一意に識別するためにMarketplaceIdとASINを指定する点と、MyOffer要素を返さない点を除き、GetLowestPricedOffersForSKUオペレーションと同様です。商品のASINが不明な場合は、ListMatchingProductsオペレーションを使ってASINを検索できます。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetLowestPricedOffersForASIN.html
     *
     * param params : ASIN, ItemCondition
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("B015CPT37I"というASINの商品を情報を取得する場合)
     * GetLowestPricedOffersForASIN({
     *     ASIN: "B015CPT37I",
     *     ItemCondition : 'New'
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetLowestPricedOffersForASIN: function (params, cb) {
        var parameters = {
            "MarketplaceId": config.MarketplaceId,
            "ASIN": params['ASIN']
        };
        if (_.has(params, 'ItemCondition')) {
            parameters['ItemCondition'] = params['ItemCondition'];
        }
        mws.createRequest({
            'action': 'GetLowestPricedOffersForASIN',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    },
    /**
     * function    : GetMyFeesEstimate
     * description : 商品リストの見積もり手数料を返します。
     *   GetMyFeesEstimateオペレーションは、商品とマーケットプレイスのリストを与えることで、そのマーケットプレイスでの商品の手数料を返します。商品価格を設定する前に、その商品に対してGetMyFeesEstimateを呼び出すことができます。その手数料見積り額を考慮した上で価格を設定できます。商品は、ASINまたはSKUで指定する必要があります(UPCやISBNなどは使用できません)。
     *
     *   商品手数料のリクエストでは、オリジナルのIDを毎回入力する必要があります。このIDは手数料見積り額とともに返されるので、手数料見積り額とオリジナルのリクエストを照合できます。
     *
     *   このオペレーションでは、一度に最大20個の商品をリクエストできます。結果の処理について詳しくは、一括オペレーションリクエストを実行するを参照してください。
     *
     *   注: このAPIで返された手数料見積り額は確定された金額ではありません。実際の手数料は異なる場合があります。
     *   手数料の詳細については、セラーセントラルの手数料見積り額とFBA - 機能と手数料を参照してください。
     * see         : http://docs.developer.amazonservices.com/ja_JP/products/Products_GetMyFeesEstimate.html
     *
     * param params : IdType, ASIN, IsAmazonFulfilled, price, shipping
     * param cb     : callback function
     * return       : MWS API result (xml)
     *
     * example of execuion. ("B015CPT37I"というASINの商品を、3000円+送料0円でFBAとして出品する場合の手数料を取得する)
     * mws.products.GetMyFeesEstimate({
     *     IdType:"ASIN",
     *     ASIN:"B015CPT37I",
     *     IsAmazonFulfilled:true,
     *     price:3000,
     *     shipping:0
     *   }, function(err, data){
     *     console.log(data);
     *   }
     * );
     */
    GetMyFeesEstimate: function (params, cb) {
        if (params['IdType'] !== 'ASIN' && params['IdType'] !== 'SellerSKU') {
            cb({
                'Error': "unknown IdType. Allowed are ASIN, SellerSKU"
            }, null);
            return;
        }
        var parameters = {
           "FeesEstimateRequestList.FeesEstimateRequest.1.MarketplaceId":config.MarketplaceId,
           "FeesEstimateRequestList.FeesEstimateRequest.1.IdType":params.IdType,
           "FeesEstimateRequestList.FeesEstimateRequest.1.IdValue":params.ASIN,
           "FeesEstimateRequestList.FeesEstimateRequest.1.IsAmazonFulfilled":params.IsAmazonFulfilled,
           "FeesEstimateRequestList.FeesEstimateRequest.1.Identifier":"ABCDE",
           "FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.ListingPrice.Amount":params.price,
           "FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.ListingPrice.CurrencyCode":"JPY",
           "FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Shipping.Amount":params.shipping,
           "FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Shipping.CurrencyCode":"JPY",
           "FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Points.PointsNumber":0,
           "FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Points.PointsMonetaryValue.Amount":0,
           "FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Points.PointsMonetaryValue.CurrencyCode":"JPY"
        };

        mws.createRequest({
            'action': 'GetMyFeesEstimate',
            'config': config,
            'parameters': parameters,
            'type': 'Products'
        }, function (err, data) {
            cb(err, data);
        });
    }
};
