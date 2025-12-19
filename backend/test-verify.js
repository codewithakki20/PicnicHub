async function testVerify() {
    try {
        const email = 'test_script_1764168827506@example.com';
        const otp = '990440';
        console.log(`Verifying OTP for: ${email}`);

        const response = await fetch('http://localhost:5000/api/v1/auth/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                otp,
            }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testVerify();
