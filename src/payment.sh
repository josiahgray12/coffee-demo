#!/bin/bash

cardId=$1
customerFirstName=$2
customerLastName=$3

echo "in script cardId: $cardId"

if [ -z "$cardId" ]; then
  echo "Error: cardId is required"
  exit 1
fi

echo "Starting payment script with cardId: $cardId..."

curl 'https://api.publicsquare.com/payments' \
-X 'POST' \
-H 'X-API-KEY: sk_test_ML48DLbFsvufkVJU9TkiUd' \
-H 'IDEMPONTENCY-KEY: 09ec2c87-7fb8-44ca-bb18-5c71a76974da' \
-H 'Content-Type: application/json' \
-d '{
  "amount": 1000,
  "currency": "USD",
  "payment_method": {
    "card": "'$cardId'"
  },
  "customer": {
    "first_name": "'$customerFirstName'",
    "last_name": "'$customerLastName'",
    "email": "'$customerFirstName'.'$customerLastName'@email.com"
  },
  "billing_details": {
    "address_line_1": "111 Test St.",
    "city": "Des Moines",
    "state": "IA",
    "postal_code": "51111",
    "country": "US"
  }
}'

echo "Payment script completed."