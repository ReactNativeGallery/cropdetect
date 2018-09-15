#!/bin/sh

DATA=$(base64 "$1")

curl -H "Content-Type: application/json" -X POST -d @- https://fathomless-reaches-81855.herokuapp.com/ <<CURL_DATA
{"data": "$DATA"}
CURL_DATA