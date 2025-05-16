require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log('Available collections:', collections.map(c => c.name));

  const domains = await db.collection('domains').find().limit(5).toArray();
  console.log('Domains:', domains);

  const actions = await db.collection('actions').find().sort({ createdAt: -1 }).limit(100000).toArray();

  for (const action of actions) {
    console.log(action);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
