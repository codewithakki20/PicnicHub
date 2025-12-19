async function testCors() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'OPTIONS', // Preflight
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type',
            },
        });

        console.log('Preflight Status:', response.status);
        console.log('Access-Control-Allow-Origin:', response.headers.get('access-control-allow-origin'));

        // Actual request
        const response2 = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Origin': 'http://localhost:3000',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'CORS Test',
                email: `cors_test_${Date.now()}@example.com`,
                password: 'Password123!',
            }),
        });

        console.log('Request Status:', response2.status);
        console.log('Response:', await response2.json());

    } catch (error) {
        console.error('Error:', error);
    }
}

testCors();
