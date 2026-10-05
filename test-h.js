const axios = require('axios');
const assert = require('assert');
const API_URL = 'http://localhost:5001/api';
async function testH() {
  try {
    const adminLogin = await axios.post(API_URL + '/auth/login', { email: 'testadmin@campus.edu', password: 'TestAdmin@123' });
    assert.strictEqual(adminLogin.data.data.role, 'admin');
    console.log('PASS: TEST H - Persistence verified. Admin user still exists after backend restart.');
  } catch (e) {
    console.error('TEST H FAILED');
    process.exit(1);
  }
}
testH();
