const express = require('express');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoute');
const adminRouter = require('./routes/adminRoutes');
const superAdminRouter = require('./routes/superAdminRoutes');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

connectDB();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello");
})

app.use('/api/auth',authRouter);
app.use('/api/admin',adminRouter);
app.use('/api/superadmin',superAdminRouter);
app.use('/api/user',userRouter);


app.listen(port,()=>{
    console.log(`Server is running in the port ${port}`);
})