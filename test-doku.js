// Test DOKU Payment Gateway Integration
// Run with: node test-doku.js

const crypto = require('crypto');

// DOKU Credentials from .env.local
const DOKU_CLIENT_ID = "BRN-0257-1757780222325";
const DOKU_SECRET_KEY = "SK-38dy6VWfxwZgoDTimEKS";
const DOKU_BASE_URL = "https://api-sandbox.doku.com";

// NOTE: DOKU Sandbox might have different endpoints
// Let's test with SNAP API (modern DOKU API)

// Generate DOKU Signature
function generateSignature(requestTimestamp, requestTarget) {
  const stringToSign = `${DOKU_CLIENT_ID}:${requestTimestamp}:${requestTarget}`;
  const signature = crypto
    .createHmac('sha256', DOKU_SECRET_KEY)
    .update(stringToSign)
    .digest('hex');
  return signature;
}

// Generate Request ID
function generateRequestId() {
  return `REQ-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

// Test SNAP API - Create Payment
async function testCreditCardPayment() {
  console.log('🧪 Testing DOKU SNAP Payment API...\n');

  const requestTimestamp = new Date().toISOString();
  const requestTarget = '/v1/snap/payment';
  const signature = generateSignature(requestTimestamp, requestTarget);
  const requestId = generateRequestId();

  const invoiceNumber = `INV-${Date.now()}`;
  
  const payload = {
    order: {
      invoice_number: invoiceNumber,
      amount: 50000, // Rp 50,000
    },
    payment: {
      payment_method_types: ['CREDIT_CARD'],
    },
    customer: {
      name: 'JOHN DOE',
      email: 'test@gamepulse.com',
    },
  };

  console.log('📋 Request Details:');
  console.log('├─ Client ID:', DOKU_CLIENT_ID);
  console.log('├─ Request ID:', requestId);
  console.log('├─ Timestamp:', requestTimestamp);
  console.log('├─ Signature:', signature.substring(0, 20) + '...');
  console.log('├─ Target:', requestTarget);
  console.log('└─ Invoice:', invoiceNumber);
  console.log('');

  try {
    console.log('📡 Sending request to DOKU...');
    const response = await fetch(`${DOKU_BASE_URL}${requestTarget}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': DOKU_CLIENT_ID,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        'Signature': signature,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log('');
    console.log('📨 Response Status:', response.status, response.statusText);
    console.log('📦 Response Body:');
    console.log(JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('');
      console.log('✅ SUCCESS! Payment processed successfully!');
      console.log('Transaction ID:', result.transaction_id || 'N/A');
    } else {
      console.log('');
      console.log('❌ FAILED! Payment was not successful');
      console.log('Error:', result.message || result.error || 'Unknown error');
    }
  } catch (error) {
    console.log('');
    console.log('❌ ERROR:', error.message);
    console.error(error);
  }
}

// Test Payment Status Check
async function testPaymentStatus(invoiceNumber) {
  console.log('\n🔍 Testing Payment Status Check...\n');

  const requestTimestamp = new Date().toISOString();
  const requestTarget = `/v1/payment/status/${invoiceNumber}`;
  const signature = generateSignature(requestTimestamp, requestTarget);

  console.log('📋 Checking status for invoice:', invoiceNumber);
  console.log('');

  try {
    const response = await fetch(`${DOKU_BASE_URL}${requestTarget}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': DOKU_CLIENT_ID,
        'Request-Timestamp': requestTimestamp,
        'Signature': signature,
      },
    });

    const result = await response.json();

    console.log('📨 Response:', response.status, response.statusText);
    console.log('📦 Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║         DOKU PAYMENT GATEWAY - SANDBOX TEST          ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('🔧 Configuration:');
  console.log('├─ Client ID:', DOKU_CLIENT_ID);
  console.log('├─ Secret Key:', DOKU_SECRET_KEY.substring(0, 10) + '...');
  console.log('└─ Base URL:', DOKU_BASE_URL);
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  // Test 1: Credit Card Payment
  await testCreditCardPayment();

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('🎉 Test completed!');
  console.log('');
}

// Start
runTests();
