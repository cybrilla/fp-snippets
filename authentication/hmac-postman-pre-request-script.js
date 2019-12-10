/**
 *  https://fintechprimitives.com/api/#hmac-token-generation
 *  
 *  This is mainly used as a pre-request-script in postman and uses postman sandbox apis and postman sandbox supported 
 *  node modules.
 * 
 *  This script will not work as such in node js or javascript environment, without modifications of this script
 * 
 */
const crypto = require('crypto-js');
const url = pm.request.url.getPath();
// Tenant name shared with the client
const tenant="<tenant_name>";

// Private api key shared with the client
const privatekey = "<private api key>";

// This date will be in this format `20150830T123600Z`. Check the api doc for more details
const requesttime = new Date().toISOString().replace(/[-:]/g, '').replace(/\.{1}\d*/g, '');

const body = hmacBody();
console.log("Body = ", body);
const signedKey = signBody(privatekey, body);
const time = new Date().toISOString().replace(/-/g, '').replace(/T.*Z/g, '');
const signedDate = signBody(signedKey, time);
const signedTenant = signBody(signedDate, tenant);
const hmacToken = signBody(signedTenant, 'mfprocybrilla');

console.log("Hmac Token = ", hmacToken);  
console.log(requesttime)

// Add Basic Header
pm.request.headers.add({
    key: 'Authorization',
    value: tenant+":"+hmacToken
});

pm.request.headers.add({
    key: 'MFProDate',
    value: requesttime
});

pm.request.headers.add({
    key: 'Content-Type',
    value: 'application/json'
});

// console.log(pm.request.headers)

function signBody(key, body) {
    return crypto.enc.Base64.stringify(crypto.HmacSHA256(body, key));
}

function hmacBody(){
    const time = requesttime;
    const requestMethod = 'POST';
    console.log(crypto.MD5)
    const digest = crypto.MD5("").toString();
    const contentType = 'application/json';
    return (requestMethod + "\n" + digest + "\n" + contentType + "\n" +
           time + "\n" + url);
}