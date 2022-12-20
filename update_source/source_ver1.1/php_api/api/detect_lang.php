<?php
header("Content-Type: application/json; charset=UTF-8");
$url = "https://detectlanguage.com/demo";

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$headers = array(
   "authority: detectlanguage.com",
   "accept: */*",
   "accept-language: vi,en;q=0.9,en-US;q=0.8",
   "content-type: application/json",
   "origin: https://detectlanguage.com",
   "referer: https://detectlanguage.com/",
   "sec-fetch-dest: empty",
   "sec-fetch-mode: cors",
   "sec-fetch-site: same-origin",
   "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54",
);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$data = '{"q":"'.$_GET["content"].'"}';

curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

//for debug only!
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$resp = curl_exec($curl);
curl_close($curl);
$out = explode('</pre>', explode('<pre>', $resp)[1])[0];
die($out);
?>
