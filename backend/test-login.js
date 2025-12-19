async function testLogin() {
    try {
        const email = 'browser_test_user_4@example.com';
        const password = 'NewPassword123!';
        console.log(`Logging in with: ${email}`);

        const response = await fetch('http://localhost:5000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testLogin();
