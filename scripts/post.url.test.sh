#!/bin/sh

DATA='https://thumbs.gfycat.com/AbsoluteSadDobermanpinscher-size_restricted.gif'

curl -H "Content-Type: application/json" -X POST -d @- http://localhost:3000 <<CURL_DATA
{"url": "$DATA"}
CURL_DATA