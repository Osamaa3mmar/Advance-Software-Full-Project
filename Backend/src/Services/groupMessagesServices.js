
import { groupMessagesRepository } from '../Repositories/groupMessagesRepository.js';
export class groupMessagesServices
{
 static sendMessage=async(groupId, userId, message, assetLink)=> {
  
    const member = await groupMessagesRepository.findMember(groupId, userId);
    if (member.length === 0) {
      return { message: "You are not a member of this group" };
    }
    // const { status, state } = member[0];
    // if (status !== "ACTIVE" || state !== "APPROVED") {
      //return { message: "You are not active in this group" };
   // }
    await groupMessagesRepository.insertMessage(groupId, userId, message, assetLink);

    return { message: "Message sent successfully" };
  }



  static getAllMessages=async(groupId)=>
  {
   const group = await groupMessagesRepository.findGroupById(groupId);

    if (group.length === 0) {
      return { message: "Group not found" };
    }

    const messages = await groupMessagesRepository.getMessagesByGroup(groupId);

    if (messages.length === 0) {
      return { message: "No messages in this group yet" };
    }

    return {
      message: "Messages retrieved successfully",
      count: messages.length,
      data: messages,
    };
  }

}