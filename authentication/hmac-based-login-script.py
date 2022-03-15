from datetime import date,datetime
import requests
import base64
import hashlib
import hmac

#provide base url here
base_url =  "<base_url>"
# /provide tenant name here
tenant = "<tenant_name>"
# /provide api key id  here
api_key_id =  "<tenant_api_key_id>"
# /provide api key secret  here
api_key_secret = "<private_api_secret>"

login_end_point = "/api/auth/tenant/login"
# / This date will be in this format `20150830T123600Z`. Check the api doc for more details

dateTimeValue=datetime.now()
request_time = dateTimeValue.strftime("%Y%m%dT%H%M%SZ")
current_date = dateTimeValue.strftime("%Y%m%d")


#//This function used to call tenant login api
def http_post(tenant, api_key_id, request_url, hmac_token, request_time):

    payload={}

    headers={
        "Authorization":api_key_id+ ":" + hmac_token,
        "MFProDate" :request_time,
         "Content-Type": "application/json",
         "x-tenant-id" : tenant
    }
    output = requests.request("POST", request_url, files=payload, headers=headers)
    print(output.json())
    return output


def generate_body(request_time, login_end_point):
    encoded= "POST" + "\n" + (hashlib.md5(("").encode())).hexdigest() + "\n" + "application/json" + "\n" + request_time + "\n" + login_end_point
    return encoded

def sign_body(key, body):
    hmac_hash=hmac.new(key, body, digestmod = hashlib.sha256).digest()    
    return base64.b64encode(hmac_hash)

#/This function used to generate hmac token 
def generate_hmac_token(api_key_secret, body, current_date,tenant): 
    signed_key= sign_body(bytes(api_key_secret,'utf-8'), bytes(body,'utf-8'))
    signed_date = sign_body(signed_key,bytes(current_date,'utf-8'))
    signed_tenant = sign_body(signed_date, bytes(tenant,'utf-8'))
    return sign_body(signed_tenant,bytes("mfprocybrilla",'utf-8')).decode("utf-8")


body = generate_body(request_time, login_end_point)
hmac_token = generate_hmac_token(api_key_secret,body,current_date,tenant)
request_url = base_url+login_end_point
#//here you will get login token 
http_post(tenant,api_key_id,request_url,hmac_token,request_time)

