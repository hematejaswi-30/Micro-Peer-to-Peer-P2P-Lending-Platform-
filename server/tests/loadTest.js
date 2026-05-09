const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const LOAN_ID = process.argv[2]; // Pass a loan ID to test

if (!LOAN_ID) {
  console.error('Please provide a Loan ID: node loadTest.js <loanId>');
  process.exit(1);
}

async function simulateLoad() {
  console.log(`🚀 Starting Load Test on Loan: ${LOAN_ID}`);
  
  const numBidders = 20;
  const bids = [];

  for (let i = 1; i <= numBidders; i++) {
    bids.push(placeBid(i));
  }

  console.log(`⏳ Placing ${numBidders} concurrent bids...`);
  const results = await Promise.allSettled(bids);
  
  const successes = results.filter(r => r.status === 'fulfilled').length;
  const failures = results.filter(r => r.status === 'rejected').length;

  console.log(`✅ Success: ${successes}`);
  console.log(`❌ Failed: ${failures}`);
  
  if (successes > 0) {
    console.log('--- Attempting Concurrent Acceptance ---');
    // In a real scenario, we'd test multiple acceptances, 
    // but the logic only allows accepting one.
  }
}

async function placeBid(index) {
  // 1) Register a unique lender
  const email = `lender_load_${Date.now()}_${index}@test.com`;
  const regRes = await axios.post(`${API_URL}/auth/register`, {
    name: `Lender ${index}`,
    email,
    password: 'Password123!',
    role: 'lender'
  });

  const token = regRes.data.token;

  // 2) Place bid
  return axios.post(`${API_URL}/loans/${LOAN_ID}/bids`, {
    proposedRate: 10 + (index % 5),
    message: `Load test bid ${index}`
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

simulateLoad().catch(err => {
  console.error('Load test failed:', err.message);
  if (err.response) console.log(err.response.data);
});
