// Test script untuk Digiflazz API
// Run dengan: node test-digiflazz.js

async function testValidateUser() {
  console.log('🧪 Testing Digiflazz Validate User API...\n')

  try {
    const response = await fetch('http://localhost:3000/api/game/validate-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buyerSkuCode: 'ml75',
        userId: '123456789',
        zoneId: '1234',
      }),
    })

    const data = await response.json()

    console.log('📊 Response Status:', response.status)
    console.log('📦 Response Data:', JSON.stringify(data, null, 2))

    if (data.valid) {
      console.log('\n✅ SUCCESS! User ID is valid')
      console.log('👤 Username:', data.username)
    } else {
      console.log('\n❌ FAILED! User ID is invalid')
      console.log('💬 Message:', data.message)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run test
testValidateUser()
