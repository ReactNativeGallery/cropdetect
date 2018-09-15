#!/bin/sh

DATA=$(base64 "$1")

curl -H "Content-Type: application/json" -X POST -d @- http://localhost:3000 <<CURL_DATA
{"data": "$DATA"}
CURL_DATA