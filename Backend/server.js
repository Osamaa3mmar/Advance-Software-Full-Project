import express from 'express';
import cors from 'cors';
import { initControllers } from './src/initControllers.js';
import cors from "cors"
import http from "http";
import { Server } from 'socket.io';
const app = express();
const Port=5555;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


initControllers(app);

const httpServer=http.createServer(app);
const io=new Server(httpServer,{cors:{
    origin:"*",
    methods:["GET","POST"]
}})
io.on("connection",(socket)=>{
    socket.on("message",(msg)=>{
        console.log(msg);
        io.emit("newMessage",msg);
    })
})

httpServer.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});