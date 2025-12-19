async function testResetPassword() {
    try {
        const email = 'browser_test_user_4@example.com';
        const otp = '859211';
        const newPassword = 'NewPassword123!';
        console.log(`Resetting password for: ${email} with OTP: ${otp}`);

        const response = await fetch('http://localhost:5000/api/v1/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp, newPassword }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testResetPassword();
