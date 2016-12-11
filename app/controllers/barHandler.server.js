'use strict';

var Q = require('q');
var request = require('request');

function BarHandler () {
    this.yelpGetAccessToken = function (req, res, next) {
        request.post(
            {
                url:'https://api.yelp.com/oauth2/token', 
                form: {
                    grant_type: 'client_credentials',
                    client_id: process.env.YELP_ID,
                    client_secret: process.env.YELP_SECRET
                },
                json: true
            }, 
            function (error, response, body){ 
                if (!error && response.statusCode == 200) {
                    req.yelpResponse = body;
                    
                    next();
                } else {
                    console.log('yelpGetAccessToken request.post ERROR', error)
                }
            }
        );
    };
    
    this.searchBarById = function (req, res) {
        
    };
    
    this.searchBarByName = function (req, res) {
        var data = req.query;
        
        // get bars base on search text
        request.get('https://api.yelp.com/v3/businesses/search', {
            auth: {
                'bearer':  req.yelpResponse.access_token
            },
            qs: {
                location: data.searchTxt,
                categories: 'bars'
            },
            json: true
        }, function (error, response, body) {
            
            if (!error && response.statusCode == 200) {
                var reviewsCounter = 0;
                
                // loop through each bar
                body.businesses.forEach(function (item, index) {
                    
                    request.get('https://api.yelp.com/v3/businesses/' + item.id + '/reviews', {
                        auth: {
                            'bearer':  req.yelpResponse.access_token
                        },
                        json: true
                    }, function (error2, response2, body2) {
                        reviewsCounter++;
                        
                        if (!error2 && response2.statusCode == 200) {
                            body.businesses[index].review = body2.reviews[0].text;
                        } else {
                            // console.log('body.businesses.forEach ERROR ' + index, body2.error)
                        }
                        
                        // console.log(reviewsCounter)
                        
                        if (reviewsCounter == body.businesses.length)
                            res.send(body);
                        
                    });
                    
                });
                
                // res.send(body);
                
                
            } else {
                console.log('searchBarByName request.get ERROR', error)
            }
        });
        
    };
    
    function getReviews (id) {
        
    }
}

module.exports = BarHandler;