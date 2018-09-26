#!/bin/sh

DATA='https://thumbs.gfycat.com/AbsoluteSadDobermanpinscher-size_restricted.gif'

curl -H "Content-Type: application/json" -X POST -d @- https://fathomless-reaches-81855.herokuapp.com/ <<CURL_DATA
{"url": "$DATA"}
CURL_DATA