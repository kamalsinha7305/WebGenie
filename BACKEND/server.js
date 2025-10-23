import 'dotenv/config';
import app from './src/app.js';

const app = require("./src/app");

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});