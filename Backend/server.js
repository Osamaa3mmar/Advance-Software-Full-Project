import express from 'express';
import { initControllers } from './src/initControllers.js';
import cors from "cors"
const app = express();
const Port=5555;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


initControllers(app);
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});