const PayssionClient = require('./index');

// Example usage of payssion-nodejs

// Initialize client (use your actual API keys)
const client = new PayssionClient(
    'your_api_key_here',
    'your_secret_key_here',
    false // false for sandbox, true for live mode
);

async function exampleUsage() {
    try {
        console.log('=== payssion-nodejs Example ===\n');

        // Example 1: Create a payment
        console.log('1. Creating a payment...');
        const createParams = {
            pm_id: 'alipay_cn',
            amount: 10.00,
            currency: 'USD',
            order_id: 'test_order_' + Date.now(),
            description: 'Test payment from payssion-nodejs',
            return_url: 'https://your-site.com/return',
            notify_url: 'https://your-site.com/notify'
        };

        const createResult = await client.create(createParams);
        console.log('Create result:', JSON.stringify(createResult, null, 2));
        console.log('Is success:', client.getIsSuccess());
        
        if (client.getIsSuccess() && createResult.redirect_url) {
            console.log('Payment URL:', createResult.redirect_url);
        }
        console.log('');

        // Example 2: Get payment details (you need a valid transaction_id)
        console.log('2. Getting payment details...');
        const detailsParams = {
            transaction_id: 'your_transaction_id_here', // Replace with actual transaction ID
            order_id: createParams.order_id
        };

        try {
            const detailsResult = await client.getDetails(detailsParams);
            console.log('Details result:', JSON.stringify(detailsResult, null, 2));
        } catch (error) {
            console.log('Details error (expected if transaction_id is not valid):', error.message);
        }
        console.log('');

        // Example 3: Refund (you need a valid transaction_id)
        console.log('3. Processing refund...');
        const refundParams = {
            transaction_id: 'your_transaction_id_here', // Replace with actual transaction ID
            amount: 5.00,
            currency: 'USD'
        };

        try {
            const refundResult = await client.refund(refundParams);
            console.log('Refund result:', JSON.stringify(refundResult, null, 2));
        } catch (error) {
            console.log('Refund error (expected if transaction_id is not valid):', error.message);
        }
        console.log('');

        // Example 4: Configuration methods
        console.log('4. Testing configuration methods...');
        
        // Set custom URL
        client.setUrl('https://custom-api.example.com/api/v1/');
        console.log('Custom URL set');
        
        // Reset to sandbox URL
        client.setLiveMode(false);
        console.log('Reset to sandbox mode');
        
        // SSL verification
        client.setSSLverify(true);
        console.log('SSL verification enabled');
        
        console.log('\n=== Example completed ===');

    } catch (error) {
        console.error('Error in example:', error.message);
    }
}

// Run the example
if (require.main === module) {
    exampleUsage();
}

module.exports = { exampleUsage };