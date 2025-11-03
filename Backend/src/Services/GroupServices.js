import { groupRepository } from "../Repositories/groupRepository.js";

export class GroupService {
  static async createGroup(data) {
    if (!data.name || !data.createdBy) throw new Error("Invalid group data");
    return await groupRepository.createGroup(data);
  }

  static async listGroups() {
    return await groupRepository.getAllGroups();
  }

  static async requestJoin(groupId, userId) {
    const result = await groupRepository.sendJoinRequest(groupId, userId);
    if (result === "already") throw new Error("Request already sent");
    return { message: "Join request sent" };
  }

  static async listRequests(groupId) {
    return await groupRepository.getGroupRequests(groupId);
  }

static async handleRequest(requestId, state) {
  const result = await groupRepository.updateReqStatus(requestId, state);
  
  if (result === "not_found") throw new Error("Request not found");
  if (result === "unauthorized") throw new Error("You cannot manage this group");
  
  return { message: `Request ${state.toLowerCase()} successfully` };
}

 static async updateGroupInfo(groupId, data) {
    const result = await groupRepository.updateInfoGruop(groupId, data);

    if (result.affectedRows === 0) {
      throw new Error("Group not found or no changes applied");
    }

    return { message: "Group updated successfully" };
  }

  static async getUserGroups(userId) {
    return await groupRepository.getAllGroupsForUser(userId);
  }
  



}
