async function testRegister() {
    try {
        const email = `test_script_${Date.now()}@example.com`;
        console.log(`Registering with email: ${email}`);

        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: email,
                password: 'Password123!',
            }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testRegister();
