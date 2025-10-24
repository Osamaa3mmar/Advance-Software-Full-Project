import { GroupService } from "../Services/GroupServices.js";

export class GroupController {
   createGroup=async(req, res)=> {
    try {
      const { role, id } = req.user;
      if (role !== "ADMIN") {
        return res.status(403).json({ message: "Only admins can create groups" });
      }
      const groupId = await GroupService.createGroup({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        createdBy: id
      });
      res.status(201).json({ message: "Group created successfully", id: groupId });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
   getGroups=async(req, res)=> {
    const groups = await GroupService.listGroups();
    res.status(200).json(groups);
  }

   sendJoinRequest=async(req, res)=> {
    try {
    const userId = req.user.id;
      const groupId = req.params.id;
      const result = await GroupService.requestJoin(groupId, userId);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  getRequests=async(req, res)=> {
    const groupId = req.params.id;
    const requests = await GroupService.listRequests(groupId);
    res.status(200).json(requests);
  }

  updateRequest =async (req, res)=>{
  try {
    const { state } = req.body;
    const requestId = req.params.id;
    const result = await GroupService.handleRequest(requestId, state);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

 updateGroupInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description } = req.body;

  if (!name && !category && !description) {
      return res.status(400).json({ message: "At least one field must be provided" });
    }

    if (name.length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }

    const response = await GroupService.updateGroupInfo(id, { name,category,description, });

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
}
const groupControllers= new GroupController();
export default groupControllers;