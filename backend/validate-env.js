import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'EMAIL_USER',
    'EMAIL_PASSWORD'
];

const optionalEnvVars = [
    'PORT',
    'NODE_ENV',
    'JWT_EXPIRES_IN',
    'ALLOWED_ORIGINS',
    'EMAIL_SERVICE',
    'RATE_LIMIT_WINDOW_MS',
    'RATE_LIMIT_MAX_REQUESTS'
];

console.log('\n🔍 Validating Environment Configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('Required Environment Variables:');
requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
        // Mask sensitive values
        const maskedValue = envVar.includes('SECRET') || envVar.includes('PASSWORD')
            ? '****' + process.env[envVar].slice(-4)
            : process.env[envVar].substring(0, 20) + '...';

        console.log(`  ✅ ${envVar}: ${maskedValue}`);
    } else {
        console.log(`  ❌ ${envVar}: MISSING`);
        hasErrors = true;
    }
});

// Check optional variables
console.log('\nOptional Environment Variables:');
optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
        console.log(`  ✅ ${envVar}: ${process.env[envVar]}`);
    } else {
        console.log(`  ⚠️  ${envVar}: Not set (using default)`);
        hasWarnings = true;
    }
});

// Validate JWT_SECRET length
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.log('\n  ⚠️  WARNING: JWT_SECRET should be at least 32 characters long');
    hasWarnings = true;
}

// Validate MongoDB URI format
if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
    console.log('\n  ❌ ERROR: MONGODB_URI format appears invalid');
    hasErrors = true;
}

// Check ALLOWED_ORIGINS for production
if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
    console.log('\n  ⚠️  WARNING: ALLOWED_ORIGINS not set for production');
    hasWarnings = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ Configuration has ERRORS - Please fix before deploying');
    console.log('📝 Check .env.example for required variables');
    process.exit(1);
} else if (hasWarnings) {
    console.log('⚠️  Configuration has warnings - Review before deploying');
    console.log('✅ All required variables are set');
    process.exit(0);
} else {
    console.log('✅ Configuration is valid and ready for deployment!');
    process.exit(0);
}
