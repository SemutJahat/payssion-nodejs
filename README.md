# payssion-nodejs

Payssion library for Nodejs.

## Installation

```bash
npm install payssion-nodejs
```

## Usage

### Initialize the client

```javascript
const PayssionClient = require("payssion-nodejs");

// For live mode
const client = new PayssionClient("your_api_key", "your_secret_key", true);

// For sandbox mode
const client = new PayssionClient("your_api_key", "your_secret_key", false);
```

### Create a payment

```javascript
const params = {
  pm_id: "alipay_cn",
  amount: 10.0,
  currency: "USD",
  order_id: "your_order_id",
  description: "Payment for order",
  return_url: "https://your-site.com/return",
  notify_url: "https://your-site.com/notify",
};

try {
  const result = await client.create(params);
  console.log("Payment created:", result);

  if (client.getIsSuccess()) {
    console.log("Payment URL:", result.redirect_url);
  }
} catch (error) {
  console.error("Error creating payment:", error.message);
}
```

### Get payment details

```javascript
const params = {
  transaction_id: "payssion_transaction_id",
  order_id: "your_order_id",
};

try {
  const result = await client.getDetails(params);
  console.log("Payment details:", result);
} catch (error) {
  console.error("Error getting payment details:", error.message);
}
```

### Refund a payment

```javascript
const params = {
  transaction_id: "payssion_transaction_id",
  amount: 10.0,
  currency: "USD",
};

try {
  const result = await client.refund(params);
  console.log("Refund result:", result);
} catch (error) {
  console.error("Error processing refund:", error.message);
}
```

## Configuration

### Set custom API URL

```javascript
client.setUrl("https://custom-api-url.com/api/v1/");
```

### Disable SSL verification (not recommended for production)

```javascript
client.setSSLverify(false);
```

## API Methods

### `create(params)`

Create a new payment order.

**Parameters:**

- `pm_id` (string): Payment method ID
- `amount` (number): Payment amount
- `currency` (string): Currency code (e.g., 'USD', 'EUR')
- `order_id` (string): Your unique order ID
- `description` (string): Payment description
- `return_url` (string): URL to redirect after payment
- `notify_url` (string): URL for payment notifications

### `getDetails(params)`

Get payment details.

**Parameters:**

- `transaction_id` (string): Payssion transaction ID
- `order_id` (string): Your order ID

### `refund(params)`

Refund a payment.

**Parameters:**

- `transaction_id` (string): Payssion transaction ID
- `amount` (number): Refund amount
- `currency` (string): Currency code

## Error Handling

The library throws errors for various scenarios:

- Invalid API credentials
- Network errors
- HTTP errors (400, 401, 500, etc.)
- Invalid parameters

Always wrap API calls in try-catch blocks to handle errors properly.

## Requirements

- Node.js >= 12.0.0
- axios for HTTP requests

## License

MIT

## Support

For support, please contact Payssion support team or visit the official documentation.
