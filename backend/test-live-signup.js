// Test signup against the running server
const testSignup = async () => {
    try {
        const testEmail = `test${Date.now()}@example.com`;
        const testData = {
            name: 'Test User',
            email: testEmail,
            password: 'password123'
        };

        console.log('Testing signup with:', { name: testData.name, email: testData.email });
        console.log('\nSending request to http://localhost:5000/api/v1/auth/register...\n');

        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const data = await response.json();

        console.log('Response Status:', response.status);
        console.log('\n=== RESPONSE DATA ===');

        // Log each property separately to avoid truncation
        if (data.message) console.log('Message:', data.message);
        if (data.error) console.log('Error:', data.error);
        if (data.email) console.log('Email:', data.email);

        // Log full data on separate lines
        console.log('\nFull Response:');
        console.log(JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ SUCCESS! Signup works correctly!');
            console.log('Email with OTP should be sent to:', testEmail);
        } else {
            console.log('\n❌ FAILED!');
            if (data.error) {
                console.log('Validation Error Details:');
                console.log(data.error);
            }
        }

    } catch (error) {
        console.error('\n❌ Request failed:', error.message);
        console.error('Stack:', error.stack);
    }
};

testSignup();
