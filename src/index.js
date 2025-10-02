const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./App/config/db');
const errorHandler = require("./middlewares/errorHandler")
require('dotenv').config();

const app = express();
connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "https://simad-web-portal.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const adminApiRoutes = require('./App/routes/index');
app.use(process.env.APP_URL_PREFIX || '/api/v1/app', adminApiRoutes);

const adminApiRoutes = require('./Admin/routes/index');
app.use(process.env.ADMIN_URL_PREFIX, adminApiRoutes);





app.use(errorHandler); // error handler

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

