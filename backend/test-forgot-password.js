async function testForgotPassword() {
    try {
        const email = 'browser_test_user_4@example.com';
        console.log(`Requesting password reset for: ${email}`);

        const response = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testForgotPassword();
