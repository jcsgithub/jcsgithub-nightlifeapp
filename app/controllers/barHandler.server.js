'use strict';

var Q = require('q');
var rp = require('request-promise');
// var Yelp = require('yelp-api-v3');
var Yelp = require('yelp');

// var yelp = new Yelp({
//     app_id: process.env.YELP_ID,
//     app_secret: process.env.YELP_SECRET
// });

var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET,
});

function BarHandler () {
    this.searchBarById = function (req, res) {
        
    };
    
    this.searchBarByName = function (req, res) {
        var data = req.query;
        
        // ****************************************************************
        // YELP API V3 START
        // ****************************************************************
        
        // yelp.search({ location: data.searchTxt.toLowerCase(), categories: 'bars' }).then(function (data) {
        //     var initialData = JSON.parse(data);
        //     var promises = [];
            
        //     // get a review for each bar
        //     initialData.businesses.forEach(function (item, index) {
        //         var options = {
        //             uri: 'https://api.yelp.com/v3/businesses/' + item.id + '/reviews',
        //             auth: { 'bearer': yelp.accessToken },
        //             qs: { 'locale': 'en_CA' },
        //             json: true
        //         };
                
        //         var promise = rp(options).then(function (data) {
        //             initialData.businesses[index].review = data.reviews[0].text;
        //             return Q(true);
        //         })
        //         .catch(function (err) {
        //             // no review found
        //             return Q(false);
        //         });
    
        //         // array of promises for Q.all
        //         promises.push(promise);
        //     });
            
        //     // wait for all reviews to be loaded
        //     Q.all(promises).then(function (data){
        //         res.send(initialData);
        //     });
            
        // })
        // .catch(function (err) {
        //     console.error('yelp.search', err);
        // });
        
        // ****************************************************************
        // YELP API V3 END
        // ****************************************************************
        
        
        // ****************************************************************
        // YELP API V2 START
        // ****************************************************************
        
        yelp.search({ location: data.searchTxt, category_filter: 'bars' }).then(function (data) {
            var finalData = data.businesses.map(function (item) {
                return {
                    name: item.name,
                    url: item.url,
                    image_url: item.image_url,
                    review: item.snippet_text,
                    attending: []
                };
            });
            res.status(200).json({ bars: finalData });
        })
        .catch(function (err) {
            console.error('yelp.search', err);
        });
        
        // ****************************************************************
        // YELP API V2 END
        // ****************************************************************
        
    };
}

module.exports = BarHandler;