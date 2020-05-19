const argv = require('yargs').argv;
const crypto = require('crypto-js');
const request = require('request')

//Tenant name from args
const tenant = argv['tenant']

//Private Key from args
const private_key = argv['secret']

//Get domain name
const hostName = argv['domain'] || 'https://api.fintechprimitives.com'

const path = '/api/auth/tenant/login';
const requesttime = new Date().toISOString().replace(/[-:]/g, '').replace(/\.{1}\d*/g, '');


const body = hmacBody();
const signedKey = signBody(private_key, body);
const time = new Date().toISOString().replace(/-/g, '').replace(/T.*Z/g, '');
const signedDate = signBody(signedKey, time);
const signedTenant = signBody(signedDate, tenant);
const hmacToken = signBody(signedTenant, 'mfprocybrilla');


const httpHeaders = { 
    'content-type': 'application/json',
    'Authorization': tenant+":"+hmacToken,
    'MFProDate': requesttime,
    'x-tenant-id': tenant
}

const httpOptions = {
    url: hostName + path,
    headers: httpHeaders,
    method: 'POST'
}
request(httpOptions, function(err, res, body) {
    let json = JSON.parse(body);
    console.log(json);
})

function signBody(key, body) {
    return crypto.enc.Base64.stringify(crypto.HmacSHA256(body, key));
}

//Build hmac body
function hmacBody(){
    const time = requesttime;
    const requestMethod = 'POST';
    const digest = crypto.MD5("").toString();
    const contentType = 'application/json';
    return (requestMethod + "\n" + digest + "\n" + contentType + "\n" +
           time + "\n" + path);
}