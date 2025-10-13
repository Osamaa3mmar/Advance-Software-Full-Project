import express from 'express';
import cors from 'cors';
import { initControllers } from './src/initControllers.js';
import { connection } from './Database/Connection.js';

const app = express();
const Port = 5555;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize routes
initControllers(app);

// Start server
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});