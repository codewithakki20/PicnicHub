// Test signup against the PRODUCTION server
const testProductionSignup = async () => {
    try {
        const testEmail = `test${Date.now()}@example.com`;
        const testData = {
            name: 'Test User',
            email: testEmail,
            password: 'password123'
        };

        console.log('Testing PRODUCTION signup with:', { name: testData.name, email: testData.email });
        console.log('\nSending request to https://picnichub.onrender.com/api/v1/auth/register...\n');

        const response = await fetch('https://picnichub.onrender.com/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const data = await response.json();

        console.log('Response Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ SUCCESS! Production signup is working!');
            console.log('Your mobile app should now work correctly!');
        } else {
            console.log('\n❌ FAILED! Production server error:', data.message || data.error);
            console.log('Wait a few more minutes for deployment to complete, then try again.');
        }

    } catch (error) {
        console.error('\n❌ Request failed:', error.message);
        console.error('This might mean Render is still deploying. Wait 2-3 minutes and try again.');
    }
};

testProductionSignup();
