# API Documentation

Base URL: `http://localhost:3000`

## HSM Endpoints

### Create User/Partition

Creates a new user/partition in the HSM.

```http
POST /hsm/user
Content-Type: application/json

{
  "userId": "string",
  "password": "string",
  "permissions": ["LIST", "READ", "CREATE", "DELETE"]
}
```

**Response**
```json
{
  "success": true,
  "message": "User \"user_001\" created successfully ✅",
  "user": {
    "id": "cuid",
    "userId": "user_001",
    "permissions": ["LIST", "READ", "CREATE", "DELETE"]
  }
}
```

### Create Key

Generates a new ED25519 key pair in the HSM.

```http
POST /hsm/keys
Content-Type: application/json

{
  "keyName": "stellar_key_001",
  "algorithm": "ALG_EC_ED25519",
  "exp": false,
  "temp": false,
  "userId": "user_001"
}
```

**Response**
```json
{
  "success": true,
  "message": "Key \"stellar_key_001\" created successfully",
  "key": {
    "id": "cuid",
    "keyName": "stellar_key_001",
    "algorithm": "ALG_EC_ED25519",
    "exportable": false,
    "temp": false
  }
}
```

### Get Public Key

Retrieves the public key in Stellar format.

```http
GET /hsm/keys/{keyId}/public?exp={format}
```

**Parameters**
- `keyId`: Key identifier
- `exp`: (optional) Export format

**Response**
```json
{
  "keyId": "stellar_key_001",
  "publicKey": "base64EncodedPublicKey",
  "publicKeyG": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

## Stellar Endpoints

### Sign Transaction

Signs a Stellar transaction hash using HSM.

```http
POST /stellar/sign
Content-Type: application/json

{
  "keyId": "stellar_key_001",
  "txHashBase64": "base64EncodedHash32Bytes"
}
```

**Response**
```json
{
  "signatureBase64": "base64EncodedSignature64Bytes"
}
```

## Error Responses

All endpoints follow the same error format:

```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "statusCode": 400
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently not implemented. Recommended limits:
- 100 requests per minute per IP
- 10 key creation requests per hour

## Authentication

Currently not implemented. Future implementation will use:
- JWT tokens
- API keys for service-to-service
- OAuth2 for user authentication

## Swagger Documentation

Interactive API documentation available at:
```
http://localhost:3000/api
```
