At the root dir, run `zip -r9 -D ../periodicPush.zip *` to generate the zip file and upload it to AWS Lambda

API gateway CORS error:
- We need to include the response ourselves from the code as AWS
returns whatever header we return.
https://stackoverflow.com/questions/35190615/api-gateway-cors-no-access-control-allow-origin-header
