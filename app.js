const express = require('express');
const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({
    service: "auth-service",
    status: "active",
    version: "0.2.0"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});