const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./App/config/db');
const errorHandler = require("./middlewares/errorHandler")
require('dotenv').config();

const app = express();
connectDB();

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://simad-web-portal.vercel.app"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     const isAllowed = allowedOrigins.some(o => origin && origin.startsWith(o));
//     if (!origin || isAllowed) {
//       callback(null, true);
//     } else {
//       console.error('Blocked by CORS: ' + origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));
// app.options('*', cors()); // enable pre-flight across-the-board


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const appApiRoutes = require('./App/routes/index');
app.use(process.env.APP_URL_PREFIX || '/api/v1/app', appApiRoutes);

const adminApiRoutes = require('./Admin/routes/index');
app.use(process.env.ADMIN_URL_PREFIX, adminApiRoutes);





app.use(errorHandler); // error handler

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

