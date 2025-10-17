import express from 'express';
import { initControllers } from './src/initControllers.js';
const app = express();
const Port=5555;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



initControllers(app);
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});