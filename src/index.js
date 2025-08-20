const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Import the swagger spec
const connectDB = require('./config/db');
const errorHandler = require("../src/middlewares/errorHandler")
const userRoutes = require('./routes/user.routes');
const universityRoutes = require('./routes/university.routes');


require('dotenv').config();

const app = express();
connectDB();

const allowedOrigins = [
  // "http://localhost:3000"
];

app.use(cors({
  // origin: function (origin, callback) {
  //   if (!origin || allowedOrigins.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  // credentials: true
}));


app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/university', universityRoutes);


app.use(errorHandler); // error handler

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

