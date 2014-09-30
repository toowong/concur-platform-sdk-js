var concur = require('../'),
    config = require('config'),
    expect = require('chai').expect;



var username = config.get('username');
var password = config.get('password');
var consumerKey = config.get('consumerKey');

describe('Concur Native Flow oAuth Tests', function(){
    it('should validate the server returned a valid payload', function(done) {
        var parameters = {
            username:username,
            password:password,
            consumerKey:consumerKey
        }
        concur.oauth.native(parameters)
        .then(function(token) {
            expect(token).to.have.property('value');
            expect(token).to.have.property('refreshToken');
            expect(token).to.have.property('instanceUrl');
            expect(token).to.have.property('expiration');
            done();
        })
        .fail(function(error) {
            console.log("Getting an OAuth token failed: ", error);
        });
    });

    it('should fail if the username is incorrect', function(done) {
        var parameters = {
            username:'NOBODY!',
            password:password,
            consumerKey:consumerKey
        }
        concur.oauth.native(parameters)
            .then({})
            .fail(function(rejected){
                expect(rejected.error).to.contain('403');
                done();
            });
    });

    it('should fail if the password is incorrect', function(done) {
        var parameters = {
            username:username,
            password:'BLURGH!',
            consumerKey:consumerKey
        }
        concur.oauth.native(parameters)
            .then({})
            .fail(function(rejected) {
                expect(rejected.error).to.contain('403');
                done();
            });
    });

    it('should fail if the consumer key is incorrect', function(done) {
        var parameters = {
            username:username,
            password:password,
            consumerKey:'INVALIDCONSUMERKEY!'
        }
        concur.oauth.native(parameters)
            .then({})
            .fail(function(rejected){
                expect(rejected.error).to.contain('403');
                done();
            });
    });
});