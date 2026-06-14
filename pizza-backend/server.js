const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));



app.get('/', (req, res) => {
  res.json({ message: 'Pizza server running!' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});