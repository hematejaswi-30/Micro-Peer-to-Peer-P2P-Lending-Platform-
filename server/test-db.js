const mongoose = require('mongoose');
require('dotenv').config();

const testDb = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    const TestSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model('Test', TestSchema);

    console.log('Attempting write...');
    await TestModel.create({ name: 'test_' + Date.now() });
    console.log('✅ Write successful');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

testDb();
