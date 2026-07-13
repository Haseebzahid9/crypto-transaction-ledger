# Crypto Transaction Ledger API Documentation

## Base URL

`http://localhost:3000`

## Endpoints

### Create Transaction

`POST /transactions`

Request Body:

```json
{
  "sender": "Alice",
  "receiver": "Bob",
  "amount": 120
}
```

Response:

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "id": "TX-...",
    "sender": "Alice",
    "receiver": "Bob",
    "amount": 120,
    "timestamp": "2026-07-13T12:00:00.000Z",
    "hash": "..."
  }
}
```

### Get All Transactions

`GET /transactions`

Response:

```json
{
  "success": true,
  "transactions": [ ... ]
}
```

### Get Transaction by ID

`GET /transactions/:id`

Response:

```json
{
  "success": true,
  "transaction": { ... }
}
```

### Verify Transaction

`GET /transactions/:id/verify`

Response:

```json
{
  "success": true,
  "verified": true
}
```

### Delete Transaction

`DELETE /transactions/:id`

Response:

```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

### Wallet Balance

`GET /wallet/:address`

Response:

```json
{
  "success": true,
  "wallet": {
    "wallet": "Alice",
    "received": 500,
    "sent": 150,
    "balance": 350
  }
}
```

### Statistics

`GET /stats`

Response:

```json
{
  "success": true,
  "stats": {
    "totalTransactions": 10,
    "totalTransferred": 1250,
    "highestTransaction": { ... },
    "averageAmount": 125,
    "uniqueWallets": 8
  }
}
```

### Search Transactions

`GET /search?wallet=Alice`

Response:

```json
{
  "success": true,
  "transactions": [ ... ]
}
```
