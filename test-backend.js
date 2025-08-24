// Simple test script to verify backend API
const API_BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🧪 Testing Smart Parking System Backend...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server health check failed');
    }
  } catch (error) {
    console.log('❌ Cannot connect to server. Make sure backend is running on port 5000');
    console.log('   Run: cd api/backend && npm run dev');
    return;
  }

  try {
    // Test 2: Test parking endpoints
    console.log('\n2. Testing parking endpoints...');
    const parkingResponse = await fetch(`${API_BASE_URL}/parkings`);
    if (parkingResponse.ok) {
      const data = await parkingResponse.json();
      console.log(`✅ Parkings endpoint working (${data.data?.parkings?.length || 0} parkings found)`);
    } else {
      console.log('❌ Parkings endpoint failed');
    }
  } catch (error) {
    console.log('❌ Error testing parking endpoints:', error.message);
  }

  try {
    // Test 3: Test user registration (should fail without data)
    console.log('\n3. Testing user endpoints...');
    const userResponse = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    if (userResponse.status === 400) {
      console.log('✅ User registration validation working (correctly rejected empty data)');
    } else {
      console.log('❌ User registration validation not working as expected');
    }
  } catch (error) {
    console.log('❌ Error testing user endpoints:', error.message);
  }

  console.log('\n🎉 Backend test completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Start the frontend: cd client && npm run dev');
  console.log('2. Open http://localhost:5173 in your browser');
  console.log('3. Register a new account and explore the features');
}

testBackend();
