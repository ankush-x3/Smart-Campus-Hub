const axios = require('axios');
const assert = require('assert');

const API_URL = 'http://localhost:5001/api';
const ADMIN_CRED = { email: 'testadmin@campus.edu', password: 'TestAdmin@123' };
const DEMO_CRED = { email: 'faculty@campus.edu', password: 'faculty123' };

async function runTests() {
  try {
    console.log('--- TEST A: Demo Login Fails ---');
    try {
      await axios.post(`${API_URL}/auth/login`, DEMO_CRED);
      console.error('FAIL: Demo login succeeded but it should have failed!');
      process.exit(1);
    } catch (e) {
      assert.strictEqual(e.response.status, 401);
      console.log('PASS: Demo login failed successfully.');
    }

    console.log('\n--- TEST B: Admin Creates Faculty ---');
    const adminLogin = await axios.post(`${API_URL}/auth/login`, ADMIN_CRED);
    const adminToken = adminLogin.data.token;
    assert(adminToken);
    
    try {
      const users = await axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${adminToken}` } });
      const existing = users.data.data.find(u => u.email === 'testfaculty@campus.edu');
      if (existing) await axios.delete(`${API_URL}/users/${existing._id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    } catch(e) {}

    const createUserRes = await axios.post(`${API_URL}/users`, {
      name: 'Test Faculty',
      email: 'testfaculty@campus.edu',
      password: 'TestFaculty@123',
      role: 'faculty'
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert.strictEqual(createUserRes.status, 201);
    const facultyId = createUserRes.data.data._id;
    console.log('PASS: Admin created Faculty successfully.');

    console.log('\n--- TEST C: Faculty Login ---');
    const facultyLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'testfaculty@campus.edu',
      password: 'TestFaculty@123'
    });
    const facultyToken = facultyLogin.data.token;
    assert.strictEqual(facultyLogin.data.data.role, 'faculty');
    console.log('PASS: Faculty login succeeded.');

    console.log('\n--- TEST D: Faculty changes password ---');
    await axios.put(`${API_URL}/auth/change-password`, {
      currentPassword: 'TestFaculty@123',
      newPassword: 'NewFaculty@123'
    }, { headers: { Authorization: `Bearer ${facultyToken}` } });

    try {
      await axios.post(`${API_URL}/auth/login`, { email: 'testfaculty@campus.edu', password: 'TestFaculty@123' });
      console.error('FAIL: Old password login should have failed!');
      process.exit(1);
    } catch (e) {
      assert.strictEqual(e.response.status, 401);
    }

    const newFacultyLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'testfaculty@campus.edu',
      password: 'NewFaculty@123'
    });
    assert(newFacultyLogin.data.token);
    console.log('PASS: Password changed and verified.');

    console.log('\n--- TEST E: Student cannot become Admin ---');
    try {
      const users = await axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${adminToken}` } });
      const existing = users.data.data.find(u => u.email === 'teststudent@campus.edu');
      if (existing) await axios.delete(`${API_URL}/users/${existing._id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    } catch(e) {}

    const studentUserRes = await axios.post(`${API_URL}/users`, {
      name: 'Test Student',
      email: 'teststudent@campus.edu',
      password: 'TestStudent@123',
      role: 'student'
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    const studentId = studentUserRes.data.data._id;

    const studentLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'teststudent@campus.edu',
      password: 'TestStudent@123'
    });
    const studentToken = studentLogin.data.token;

    try {
      await axios.put(`${API_URL}/users/${studentId}/role`, { role: 'admin' }, { headers: { Authorization: `Bearer ${studentToken}` } });
      console.error('FAIL: Student changed role!');
      process.exit(1);
    } catch (e) {
      assert.strictEqual(e.response.status, 403);
      console.log('PASS: Student cannot change role.');
    }

    console.log('\n--- TEST F: Faculty cannot create Admin ---');
    try {
      await axios.post(`${API_URL}/users`, {
        name: 'Hacker',
        email: 'hacker@campus.edu',
        password: 'hack',
        role: 'admin'
      }, { headers: { Authorization: `Bearer ${newFacultyLogin.data.token}` } });
      console.error('FAIL: Faculty created an admin!');
      process.exit(1);
    } catch (e) {
      assert.strictEqual(e.response.status, 403);
      console.log('PASS: Faculty cannot use admin API.');
    }

    console.log('\n--- TEST G: Admin role change ---');
    const roleChangeRes = await axios.put(`${API_URL}/users/${facultyId}/role`, { role: 'student' }, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert.strictEqual(roleChangeRes.data.data.role, 'student');
    
    const demotedLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'testfaculty@campus.edu',
      password: 'NewFaculty@123'
    });
    assert.strictEqual(demotedLogin.data.data.role, 'student');
    console.log('PASS: Admin changed role of Faculty to Student successfully.');

    console.log('\n--- ALL TESTS COMPLETED SUCCESSFULLY ---');
    process.exit(0);

  } catch(e) {
    console.error('TEST FAILED:');
    console.error(e.response ? e.response.data : e.message);
    process.exit(1);
  }
}

runTests();
