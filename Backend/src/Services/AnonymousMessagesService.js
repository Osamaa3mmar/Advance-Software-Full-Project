import { AnonymousMessagesRepository } from "../Repositories/AnonymousMessagesRepository.js";
import cloudinary from "../Utils/Cloudinary.js";

export class AnonymousMessagesService {

    static sendMessage = async (content, file) => {
        try {
            if (!content || content.trim().length === 0) {
                return { success: false, message: "Message content is required" };
            }

            if (content.length > 2000) {
                return { success: false, message: "Message is too long (max 2000 characters)" };
            }

            let assetLink = null;

            // Upload file if provided
            if (file) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(file.path, {
                        folder: "healthpal/anonymous-messages",
                        resource_type: "auto",
                    });
                    assetLink = uploadResult.secure_url;
                } catch (uploadError) {
                    console.log("File upload error:", uploadError);
                    // Continue without file if upload fails
                }
            }

            const messageData = {
                content: content.trim(),
                asset_link: assetLink,
                is_replay: 0,
                replay_id: null
            };

            const result = await AnonymousMessagesRepository.createMessage(messageData);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: "Anonymous message sent successfully",
                    messageId: result.insertId
                };
            } else {
                return { success: false, message: "Failed to send message" };
            }
        } catch (error) {
            return { success: false, message: "Failed to send message", error };
        }
    }

    static replyToMessage = async (messageId, content, role, file) => {
        try {
            // Only doctors can reply to anonymous messages
            if (role !== "DOCTOR" && role !== "ADMIN") {
                return { success: false, message: "Only doctors can reply to anonymous messages" };
            }

            if (!content || content.trim().length === 0) {
                return { success: false, message: "Reply content is required" };
            }

            if (content.length > 2000) {
                return { success: false, message: "Reply is too long (max 2000 characters)" };
            }

            // Check if the message exists
            const originalMessage = await AnonymousMessagesRepository.getMessageById(messageId);
            if (!originalMessage) {
                return { success: false, message: "Original message not found" };
            }

            let assetLink = null;

            // Upload file if provided
            if (file) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(file.path, {
                        folder: "healthpal/anonymous-messages",
                        resource_type: "auto",
                    });
                    assetLink = uploadResult.secure_url;
                } catch (uploadError) {
                    console.log("File upload error:", uploadError);
                }
            }

            const replyData = {
                content: content.trim(),
                asset_link: assetLink,
                is_replay: 1,
                replay_id: messageId
            };

            const result = await AnonymousMessagesRepository.createMessage(replyData);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: "Reply sent successfully",
                    replyId: result.insertId
                };
            } else {
                return { success: false, message: "Failed to send reply" };
            }
        } catch (error) {
            return { success: false, message: "Failed to send reply", error };
        }
    }

    static getAllMessages = async (page = 1, limit = 50) => {
        try {
            const offset = (page - 1) * limit;
            const messages = await AnonymousMessagesRepository.getAllMessages(limit, offset);
            return { success: true, messages, page, limit };
        } catch (error) {
            return { success: false, message: "Failed to retrieve messages", error };
        }
    }

    static getConversation = async (messageId) => {
        try {
            const conversation = await AnonymousMessagesRepository.getConversationThread(messageId);
            if (!conversation) {
                return { success: false, message: "Message not found" };
            }
            return { success: true, conversation };
        } catch (error) {
            return { success: false, message: "Failed to retrieve conversation", error };
        }
    }

    static getUnansweredMessages = async (role, limit = 50) => {
        try {
            // Only doctors and admins can see unanswered messages
            if (role !== "DOCTOR" && role !== "ADMIN") {
                return { success: false, message: "Only doctors can view unanswered messages" };
            }

            const messages = await AnonymousMessagesRepository.getUnansweredMessages(limit);
            return { success: true, messages };
        } catch (error) {
            return { success: false, message: "Failed to retrieve unanswered messages", error };
        }
    }

    static searchMessages = async (searchTerm, limit = 50) => {
        try {
            if (!searchTerm || searchTerm.trim().length === 0) {
                return { success: false, message: "Search term is required" };
            }

            const messages = await AnonymousMessagesRepository.searchMessages(searchTerm.trim(), limit);
            return { success: true, messages };
        } catch (error) {
            return { success: false, message: "Failed to search messages", error };
        }
    }

    static deleteMessage = async (messageId, role) => {
        try {
            // Only admins can delete messages
            if (role !== "ADMIN") {
                return { success: false, message: "Only admins can delete messages" };
            }

            const message = await AnonymousMessagesRepository.getMessageById(messageId);
            if (!message) {
                return { success: false, message: "Message not found" };
            }

            const result = await AnonymousMessagesRepository.deleteMessage(messageId);
            if (result.affectedRows === 0) {
                return { success: false, message: "Message not found or already deleted" };
            }

            // Optional: Delete asset from Cloudinary if exists
            if (message.asset_link) {
                try {
                    const publicId = message.asset_link.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (cloudError) {
                    console.log("Cloudinary deletion error:", cloudError);
                }
            }

            return { success: true, message: "Message deleted successfully" };
        } catch (error) {
            return { success: false, message: "Failed to delete message", error };
        }
    }
}
