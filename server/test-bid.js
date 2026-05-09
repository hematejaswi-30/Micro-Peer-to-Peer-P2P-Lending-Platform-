const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
  try {
    // 1. Signup Borrower
    console.log('--- Registering Borrower ---');
    const bRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Bob Test',
      email: `bob_${Date.now()}@example.com`,
      password: 'Password123',
      role: 'borrower'
    });
    const bToken = bRes.data.token;

    // 2. Create Loan
    console.log('--- Creating Loan ---');
    const lRes = await axios.post(`${API_URL}/loans`, {
      amount: 10000,
      purpose: 'Test Loan',
      interestRate: 10,
      termMonths: 12
    }, { headers: { Authorization: `Bearer ${bToken}` } });
    const loanId = lRes.data.loan._id;

    // 3. Signup Lender
    console.log('--- Registering Lender ---');
    const lenRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Larry Test',
      email: `larry_${Date.now()}@example.com`,
      password: 'Password123',
      role: 'lender'
    });
    const lenToken = lenRes.data.token;

    // 4. Place Bid
    console.log('--- Placing Bid (The failing part) ---');
    try {
      const bidRes = await axios.post(`${API_URL}/loans/${loanId}/bids`, {
        proposedRate: 9,
        message: 'I can offer a better rate!'
      }, { headers: { Authorization: `Bearer ${lenToken}` } });
      console.log('✅ Bid placed successfully:', bidRes.data.status);
    } catch (err) {
      console.log('❌ Bid failed with status:', err.response?.status);
      console.log('❌ Error body:', JSON.stringify(err.response?.data, null, 2));
    }

  } catch (err) {
    console.error('💥 Setup failed:', err.message);
    if (err.response) console.log(JSON.stringify(err.response.data, null, 2));
  }
};

runTest();
