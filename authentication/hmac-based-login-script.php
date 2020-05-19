<?php

//provide base url here
$base_url =  "<base_url>";
//provide tenant name here
$tenant = "<tenant_name>";
//provide api key id  here
$api_key_id =  "<tenant_api_key_id>";
//provide api key secret  here
$api_key_secret = "<private_api_secret>";



$login_end_point = "/api/auth/tenant/login";
// This date will be in this format `20150830T123600Z`. Check the api doc for more details
$request_time = date('Ymd') . 'T' . date('Hms') . 'Z';
$current_date = date('Ymd');

$body = generate_body($request_time, $login_end_point);
$hmac_token = generate_hmac_token($api_key_secret,$body,$current_date,$tenant);

$request_url = $base_url.$login_end_point;
//here you will get login token 
var_dump(http_post($tenant,$api_key_id,$request_url,$hmac_token,$request_time));

//This function used to generate hmac token 
function generate_hmac_token($api_key_secret, $body, $current_date,$tenant) 
{
    $signed_key = signBody($api_key_secret, $body);
    $signed_date = signBody($signed_key, $current_date);
    $signed_tenant = signBody($signed_date, $tenant);
    return  signBody($signed_tenant, "mfprocybrilla");
}

//This function used to call tenant login api
function http_post($tenant, $api_key_id, $request_url, $hmac_token, $request_time)
{
    $ch = curl_init();

    $headers = array();
    $headers[] = "Authorization: " . $api_key_id . ":" . $hmac_token;
    $headers[] = "MFProDate: " . $request_time;
    $headers[] = "Content-Type: application/json";
    $headers[] = "x-tenant-id: " . $tenant;

    curl_setopt($ch, CURLOPT_URL, $request_url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

function generate_body($request_time, $login_end_point)
{
    return
        "POST" .
        "\n" .
        md5("") .
        "\n" .
        "application/json" .
        "\n" .
        $request_time.
        "\n" .
        $login_end_point;

}

function signBody($key, $body)
{
    return base64_encode(hash_hmac('sha256', $body, $key, true));
}
