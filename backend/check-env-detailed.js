import 'dotenv/config';

console.log('=== Environment Variables Check ===\n');

const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS'
];

const optionalEnvVars = [
    'ALLOWED_ORIGINS',
    'RATE_LIMIT_WINDOW_MS',
    'RATE_LIMIT_MAX_REQUESTS',
    'EMAIL_FROM'
];

console.log('Required Environment Variables:');
console.log('--------------------------------');
requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        // Mask sensitive values
        if (varName.includes('SECRET') || varName.includes('PASS') || varName.includes('KEY')) {
            console.log(`✅ ${varName}: ***${value.slice(-4)}`);
        } else if (varName === 'MONGODB_URI') {
            // Show partial MongoDB URI
            const masked = value.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://***:***@');
            console.log(`✅ ${varName}: ${masked}`);
        } else {
            console.log(`✅ ${varName}: ${value}`);
        }
    } else {
        console.log(`❌ ${varName}: NOT SET`);
    }
});

console.log('\nOptional Environment Variables:');
console.log('--------------------------------');
optionalEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value}`);
    } else {
        console.log(`⚪ ${varName}: NOT SET (using defaults)`);
    }
});

console.log('\n');
