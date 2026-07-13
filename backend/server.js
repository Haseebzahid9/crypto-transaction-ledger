const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
const errorHandler = require('./middleware/errorHandler');
const { PORT } = require('./config/constants');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Crypto Transaction Ledger API is running.',
    endpoints: ['/transactions', '/wallet/:address', '/stats', '/search']
  });
});

app.use('/', transactionRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
