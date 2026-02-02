// Run with: node test-api.js (after installing axios if not present, checking package.json)
// Note: You might need to install axios: npm install axios
// Or use standard http

const http = require('http');

function request(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
                    try {
                        resolve({ status: res.statusCode, body: JSON.parse(body) });
                    } catch (e) {
                        resolve({ status: res.statusCode, body: body });
                    }
                } else {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function test() {
    console.log('--- Testing API ---');

    // 1. Register User
    console.log('\n1. Registering User...');
    const user = {
        name: 'Test Student',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        role: 'student'
    };
    const registerRes = await request('/api/auth/register', 'POST', user);
    console.log('Register:', registerRes.status, registerRes.body);

    // 2. Login
    console.log('\n2. Logging in...');
    const loginRes = await request('/api/auth/login', 'POST', {
        email: user.email,
        password: user.password
    });
    console.log('Login:', loginRes.status, loginRes.body);

    if (loginRes.status === 200 && loginRes.body.token) {
        console.log('Token received.');
    } else {
        console.log('Login failed, aborting sequence.');
        return;
    }

    // 3. Submit Grievance
    console.log('\n3. Submitting Grievance...');
    const grievance = {
        first_name: "Test",
        last_name: "User",
        mobile: "1234567890",
        email: user.email,
        department: "cse",
        description: "Test grievance description"
    };
    const grievanceRes = await request('/api/grievances', 'POST', grievance);
    console.log('Submit:', grievanceRes.status, grievanceRes.body);

    // 4. Track
    if (grievanceRes.body.grievanceId) {
        console.log('\n4. Tracking Grievance...');
        const trackRes = await request(`/api/grievances/track/${grievanceRes.body.grievanceId}`, 'GET');
        console.log('Track:', trackRes.status, trackRes.body);
    }
}

test().catch(console.error);
