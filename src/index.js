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


// ========================== ABOUT UNIVERSITY ROUTES ==========================
// The API exposes two levels of endpoints for "About University":
// 1. General consolidated info (all in one payload): 
//    -> /api/v1/about-university
//       Combines University, Why SIMAD, History, Senate, and Accreditations data.
app.use('/api/v1/about-university', require('./routes/about_university.routes'));

// 2. Specific resource endpoints (CRUD operations per module):
//    -> /api/v1/university        : University general info
//    -> /api/v1/why-simad         : Why SIMAD highlights
//    -> /api/v1/history           : Historical milestones
//    -> /api/v1/senate            : Senate members & structure
//    -> /api/v1/accreditations    : Accreditation details

app.use('/api/v1/university', universityRoutes);
app.use('/api/v1/why-simad', require('./routes/whySimad.routes'));
app.use('/api/v1/history', require('./routes/history.routes'));
app.use('/api/v1/senate', require('./routes/senate.routes'));
app.use('/api/v1/accreditations', require('./routes/accreditation.routes'));
// ===============================END ABOUT UNIVERSITY ROUTES=============================================




app.use(errorHandler); // error handler

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

