import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors' ;
import ConnectDB from "./config/ConnectDB.js"
import dotenv from "dotenv"
import router from "./router/SignUpRoute.js";

dotenv.config() ;
const app = express();
const PORT = process.env.PORT ;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

ConnectDB();

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(router)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
