## Energy Accounts & Payments — Full-Stack Code Challenge

A full-stack application that lists customer energy accounts, supports filtering/search, and lets a user make credit-card payments with a success flow and a payments history view.

### Tech Stack
- Frontend - React, TypeScript, React Router, Component library (e.g., MUI)
- Backend - Node/Express
  
### Steps to run the project
- Clone the github repository
- Open a terminal from the code challange folder
- Run the below command
```
npm start
```
- Access the http://localhost:5173/

### API calls

- Get the energy accounts

  ```
  curl --location 'http://localhost:4000/api/v1/accounts'
  ```

  Response
  ```
  [
    {
        "id": "A-0001",
        "type": "ELECTRICITY",
        "address": "1 Greville Ct, Thomastown, 3076, Victoria",
        "meterNumber": "1234567890",
        "balance": -5
    },
    {
        "id": "A-0002",
        "type": "GAS",
        "address": "74 Taltarni Rd, Yawong Hills, 3478, Victoria",
        "volume": 3034,
        "balance": -20
    }, ...
  ]
  ```
- Pay the due charges

  ```
  curl --location 'http://localhost:4000/api/v1/payments' \
  --header 'Content-Type: application/json' \
  --data '{
      "accountId": "A-0001",
      "amount": 20,
      "card": {
          "number": "4242424242424242",
          "expiry": "12/29",
          "cvc": "123"
      }
  }'
  ```

  Response

  ```
  {
    "id": "pay_yickmwyx",
    "accountId": "A-0001",
    "amount": 20,
    "last4": "4242",
    "createdAt": "2025-10-04T05:32:03.545Z",
    "status": "succeeded"
  }
  ```

- Get the Payments

  ```
  curl --location 'http://localhost:4000/api/v1/payments'
  ```

  Response

  ```
  [
    {
        "id": "pay_7pq6qnya",
        "accountId": "A-0001",
        "amount": 10,
        "last4": "9768",
        "createdAt": "2025-10-04T07:00:19.028Z",
        "status": "succeeded"
    },
    {
        "id": "pay_rtf5c0j9",
        "accountId": "A-0001",
        "amount": 5,
        "last4": "4678",
        "createdAt": "2025-10-04T06:58:16.688Z",
        "status": "succeeded"
    }
  ]
  ```

### Note
-  Balance are calculated by sum up the due charges.
-  If the balance > 0 -> that means the account holder needs to pay the money
-  If the balance = 0 -> that means all the due charges are setttled up
-  If the balance < 0 -> that means the account has some credit

### Front end functionalities

- All the accounts are loadded in the accounts tab.
- The accounts can be filtered by the type and the address.
- The balance amount is shown in red ( credit), green (due charges) and grey (settled).
- The payment can be done for each account by clicking on the payment button.
- Enter the amount willing to pay and the credit card details on the pop up modal. (The Pay button is disabled until the user enter the details)
- If the card is expired, there is a error message on the modal and unable to do the payment.
- The length valiations are added to the card number and the cvv.
- After a successful payment, the `Payment Successful` alert will be triggered.
- The account balance is changed according to the amount paid for that account.
- The payment history can be checked by the `Payment History` tab.

### Demo

https://drive.google.com/file/d/1_eyI46zTpWZt5nxspXeXfVf0QDcekSir/view?usp=sharing

### Future Work

- Add more validations from backend and front end for the inputs
- Persist payments to a real datastore (PostgreSQL) instead of in-memory mocks
- Inhance the UI with better user experience
- Improve error states
- Add OpenAPI/Swagger for the backend


  



  
