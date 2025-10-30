// Test script untuk Digiflazz API
const testValidation = async () => {
  console.log('🧪 Testing Digiflazz User Validation...\n')

  const testData = {
    buyerSkuCode: 'ml86',
    userId: '123456789',
    zoneId: '1234'
  }

  console.log('📤 Request:', testData)

  try {
    const response = await fetch('http://localhost:3000/api/game/validate-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()
    
    console.log('\n📥 Response:')
    console.log(JSON.stringify(result, null, 2))

    if (result.valid) {
      console.log('\n✅ SUCCESS! User ID is valid')
      console.log(`👤 Username: ${result.username}`)
    } else {
      console.log('\n❌ FAILED! User ID is invalid')
      console.log(`💬 Message: ${result.message}`)
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message)
  }
}

testValidation()
