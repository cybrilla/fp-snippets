const argv = require('yargs').argv;
const crypto = require('crypto-js');
const request = require('request')

//Tenant name from args
const tenant = argv['tenant']

//Private Key from args
const apiKeySecret = argv['apiKeySecret']
const apiKeyId = argv['apiKeyId']

//Get domain name
const hostName = argv['domain'] || 'https://api.fintechprimitives.com'

const path = '/api/auth/tenant/login';
const requesttime = new Date().toISOString().replace(/[-:]/g, '').replace(/\.{1}\d*/g, '');


const body = hmacBody();
const signedKey = signBody(apiKeySecret, body);
const time = new Date().toISOString().replace(/-/g, '').replace(/T.*Z/g, '');
const signedDate = signBody(signedKey, time);
const signedTenant = signBody(signedDate, tenant);
const hmacToken = signBody(signedTenant, 'mfprocybrilla');


const httpHeaders = { 
    'content-type': 'application/json',
    'Authorization': apiKeyId+":"+hmacToken,
    'MFProDate': requesttime,
    'x-tenant-id': tenant
}

const httpOptions = {
    url: hostName + path,
    headers: httpHeaders,
    method: 'POST'
}
request(httpOptions, function(err, res, requestBody) {
    let json = JSON.parse(requestBody);
    console.log(json);
})

function signBody(key, requestBody) {
    return crypto.enc.Base64.stringify(crypto.HmacSHA256(requestBody, key));
}

//Build hmac body
function hmacBody(){
    const currentTime = requesttime;
    const requestMethod = 'POST';
    const digest = crypto.MD5("").toString();
    const contentType = 'application/json';
    return (requestMethod + "\n" + digest + "\n" + contentType + "\n" +
        currentTime + "\n" + path);
}
