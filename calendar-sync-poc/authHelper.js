const e = require('express');
const { AuthorizationCode } = require('simple-oauth2');

const clientId = '621fd03a-8d31-4055-9c95-8468a7748e07';
const clientSecret = 'ojs8Q~bQ0Gglzi5BL5xWtdBOOzRuNargAY2ZmaEJ';
const redirectUrl = 'http://localhost:3000/authorize';

const scopes = [
    'openid',
    'email',
    'profile',
    'offline_access',
    'https://graph.microsoft.com/Calendars.ReadWrite' // Added scope for calendar read/write access
];
  
const credentials = {
    client: {
        id: clientId,
        secret: clientSecret
    },
    auth: {
        tokenHost: 'https://login.microsoftonline.com',
        authorizePath: '/common/oauth2/v2.0/authorize',
        tokenPath: '/common/oauth2/v2.0/token'
    }
};


const oauth2 = new AuthorizationCode(credentials);

module.exports = {
    getAuthUrl: function() {
        const returnVal = oauth2.authorizeURL({
            redirect_uri: redirectUrl,
            scope: scopes.join(' ')
        });
        console.log(``);
        console.log('Generated auth url: ' + returnVal);
        return returnVal;
    },
    getTokenFromCode: async function(auth_code, callback, request, response) {
        try {
            const result = await oauth2.getToken({
                code: auth_code,
                redirect_uri: redirectUrl,
                scope: scopes.join(' ')
            });
            const token = oauth2.createToken(result.token);
            console.log(``);
            console.log('Token created: ', token.token);
            callback(request, response, null, token);
        } catch (error) {
            console.log('Access token error: ', error.message);
            callback(request, response, error, null);
        }
    },
    getEmailFromIdToken: function(id_token) {
        const token_parts = id_token.split('.');
        const encoded_token = Buffer.from(token_parts[1].replace('-', '+').replace('_', '/'), 'base64');
        const decoded_token = encoded_token.toString();
        const jwt = JSON.parse(decoded_token);
        return jwt.preferred_username;
    },  
    getTokenFromRefreshToken: async function(refresh_token, callback, request, response) {
        try {
            const token = oauth2.createToken({ refresh_token: refresh_token});
            const refreshedToken = await token.refresh();
            console.log('New token: ', refreshedToken.token);
            callback(request, response, null, refreshedToken);
        } catch (error) {
            console.log('Refresh token error: ', error.message);
            callback(request, response, error, null);
        }
    }
};
