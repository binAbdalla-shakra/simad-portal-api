const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require("../middlewares/errorHandler")
require('dotenv').config();

const app = express();
connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000"
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

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

const adminApiRoutes = require('./routes/index');
app.use(process.env.ADMIN_URL_PREFIX, adminApiRoutes);


app.use(errorHandler); // error handler

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

