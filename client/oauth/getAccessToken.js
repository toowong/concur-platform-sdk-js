var request = require('request'),
    Q = require('q'),
    util = require('util'),
    config = require('config');



module.exports = {
    accessToken: function(parameters) {
        var deferred = Q.defer();

        var concurAccessTokenURL = util.format('%s/net2/oauth2/getaccesstoken.ashx?code=%s&client_id=%s&client_secret=%s',
            config.get('productionURL'),
            parameters.code,
            parameters.client_id,
            parameters.client_secret);

        var headers = {
            'Accept' : 'application/json'
        };

        request({url:concurAccessTokenURL, headers:headers}, function(error, response, body){
            // Error with the actual request
            if (error){
                return deferred.reject(error);
            }

            // Non-200 HTTP response code
            if (response.statusCode != 200){
                return deferred.reject({'error':'Auth URL ('+concurAccessTokenURL+') returned HTTP status code '+response.statusCode});
            }

            var bodyJSON = JSON.parse(body);

            // 200, but Error in token payload
            if (bodyJSON.Error) return deferred.reject({'error':bodyJSON.Message});
            // parse and map access token
            var token = {};
            token.value = bodyJSON['Access_Token'].Token;
            token.instanceUrl = bodyJSON['Access_Token'].Instance_Url;
            token.expiration = bodyJSON['Access_Token'].Expiration_date;
            token.refreshToken = bodyJSON['Access_Token'].Refresh_Token;
            deferred.resolve(token);
        });
        return deferred.promise;
    }
};