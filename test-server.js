const http = require('http');

const data = JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    role: 'student',
    name: 'Test Student'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // We need to support formData for the actual endpoint, but let's see if we can hit it or if it errors on type
    }
};

// The actual endpoint expects FormData, not JSON.
// So this test might fail with "Missing required fields" which confirms the server is UP.
// If it fails with "Connection refused", server is DOWN.

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
