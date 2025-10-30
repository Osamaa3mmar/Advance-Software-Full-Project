import {Router} from 'express';

const roomsRouter=Router();

const rooms = {};

const candidates = {};


roomsRouter.post("/:id/offer",(req,res)=>{
    const roomId = req.params.id;
  if (!rooms[roomId]) rooms[roomId] = {};
  rooms[roomId].offer = req.body;
  console.log(`Offer saved for room ${roomId}`);
  res.sendStatus(200);
})

roomsRouter.get("/:id/offer",(req,res)=>{
const roomId = req.params.id;
  res.json(rooms[roomId]?.offer || null);
})


roomsRouter.post("/:id/answer", (req, res) => {
  const roomId = req.params.id;
  if (!rooms[roomId]) rooms[roomId] = {};
  rooms[roomId].answer = req.body;
  console.log(`Answer saved for room ${roomId}`);
  res.sendStatus(200);
});

// استرجاع answer
roomsRouter.get("/:id/answer", (req, res) => {
  const roomId = req.params.id;
  res.json(rooms[roomId]?.answer || null);
});
roomsRouter.get("/:id/candidates", (req, res) => {
  const roomId = req.params.id;
  res.json(candidates[roomId] || []);
});
roomsRouter.post("/:id/candidate", (req, res) => {
  const roomId = req.params.id;
  if (!candidates[roomId]) candidates[roomId] = [];
  candidates[roomId].push(req.body);
  res.sendStatus(200);
});


export default roomsRouter;