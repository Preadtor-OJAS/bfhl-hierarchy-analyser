const express = require('express');
const cors = require('cors');
const bfhlRouter = require('./routes/bfhl');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/bfhl', bfhlRouter);

app.get('/', (req, res) => {
  res.json({ status: 'BFHL API is running ✅', endpoint: 'POST /bfhl' });
});

app.listen(PORT, () => {
  console.log(`BFHL API running at http://localhost:${PORT}`);
});
