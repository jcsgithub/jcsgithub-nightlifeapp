'use strict';

var Q = require('q');
var rp = require('request-promise');
// var Yelp = require('yelp-api-v3');
var Yelp = require('yelp');

var Bars = require('../models/bars.js');

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
    this.addOrUpdateBarAttendees = function (req, res) {
        var data = req.body;
        
        Bars
            .findOne({ 'barId': data.barId }, function (err, result) {
                if (err) { throw err; }
                
                if (result) {
                    // update the bar attendees
                    result.attendees.push(data.userId);
                    result.save();
                    res.sendStatus(200);
                } else {
                    // create new bar document
                    var newBar = new Bars();

					newBar.attendees = [data.userId];
					newBar.barId = data.barId;

					newBar.save(function (err) {
						if (err) { throw err; }
						
						res.sendStatus(200);
					});
                }
            });
    };
    
    this.deleteBarAttendee = function (req, res) {
        var data = req.body;
        
        Bars
            .findOne({ 'barId': data.barId }, function (err, result) {
                if (err) { throw err; }
                
                if (result) {
                    // delete the userId in the bar's attendees
                    var userIdIndex = result.attendees.indexOf(userIdIndex);
                    result.attendees.splice(userIdIndex, 1);
                    result.save();
                    res.sendStatus(200);
                } else {
                    res.status(404).send('BAR DOCUMENT NOT FOUND');
                }
            });
    };
    
    this.getBarById = function (req, res) {
        var data = req.params;
        
        Bars
            .findOne({ 'barId': data.id }, function (err, result) {
                if (err) { throw err; }
                
                if (result)
                    res.status(200).send(result);
                else
                    res.status(404).send('BAR DOCUMENT NOT FOUND')
            });
    };
    
    this.getBars = function (req, res) {
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
        
        yelp.search({ location: data.location, category_filter: 'bars' })
            .then(function (data) {
                var finalData = data.businesses.map(function (item) {
                    return {
                        id: item.id,
                        name: item.name,
                        url: item.url,
                        image_url: item.image_url,
                        review: item.snippet_text,
                        attendees: []
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
    
    this.getYelpBusiness = function (req, res) {
        var data = req.params;
        
        yelp.business(data.id)
            .then(function (data) {
                var finalData = {
                    id: data.id,
                    name: data.name,
                    url: data.url,
                    image_url: data.image_url,
                    review: data.snippet_text,
                    attendees: []
                };
                
                res.status(200).json(finalData);
            })
            .catch(function (err) {
                console.error('yelp.business', err);
            });
    };
}

module.exports = BarHandler;