const crypto = require('crypto-js');
const url = pm.request.url.getPath();
// tenant name provided
const tenant="<tenant_name>";
// secret key provided
const encryptkey = "<secret_key>";
const apikey = tenant;

const env = pm.environment.get("environment");
let key = `${env}-secret`;

console.log(`Env = ${pm.environment.get(key)}`);

const requesttime = new Date().toISOString().replace(/[-:]/g, '').replace(/\.{1}\d*/g, '');

const body = hmacBody();
console.log("Body = ", body);
const signedKey = signBody(apikey, body);
const time = new Date().toISOString().replace(/-/g, '').replace(/T.*Z/g, '');
const signedDate = signBody(signedKey, time);
const signedTenant = signBody(signedDate, tenant);
const hmacToken = signBody(signedTenant, encryptkey);


console.log("Hmac Token = ", hmacToken);

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

function signBody(key, body) {
    return crypto.enc.Base64.stringify(crypto.HmacSHA256(body, key));
}

function hmacBody(){
    const time = requesttime;
    const requestMethod = 'POST';
    const digest = crypto.MD5("").toString();
    const contentType = 'application/json';
    return (requestMethod + "\n" + digest + "\n" + contentType + "\n" +
           time + "\n" + url);
}
