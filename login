$ curl -s -c cookies.txt -X POST localhost:5000/customer/login -H 'Content-Type: application/json' -d '{"username":"nurasyl","password":"pass123"}'
{"message":"User successfully logged in","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibnVyYXN5bCIsImlhdCI6MTc5Mzk2NTI2NSwiZXhwIjoxNzkzOTY4ODY1fQ.-o-5ISpL-cVN2qmwYzRV6TgbW47w4TgIbN8dC7-Yz80"}
