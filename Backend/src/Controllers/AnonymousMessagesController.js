import { AnonymousMessagesService } from "../Services/AnonymousMessagesService.js";

class AnonymousMessagesController {

    // Send anonymous message (any authenticated user)
    sendMessage = async (req, res) => {
        try {
            const content = req.body.content;
            const file = req.file;

            const response = await AnonymousMessagesService.sendMessage(content, file);
            if (response.success) {
                return res.status(201).json({ 
                    message: response.message, 
                    messageId: response.messageId 
                });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Reply to anonymous message (doctors only)
    replyToMessage = async (req, res) => {
        try {
            const messageId = parseInt(req.params.messageId);
            const content = req.body.content;
            const role = req.user.role;
            const file = req.file;

            const response = await AnonymousMessagesService.replyToMessage(messageId, content, role, file);
            if (response.success) {
                return res.status(201).json({ 
                    message: response.message, 
                    replyId: response.replyId 
                });
            } else {
                return res.status(403).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Get all messages (paginated)
    getAllMessages = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;

            const response = await AnonymousMessagesService.getAllMessages(page, limit);
            if (response.success) {
                return res.status(200).json({ 
                    message: "Messages retrieved successfully", 
                    messages: response.messages,
                    page: response.page,
                    limit: response.limit
                });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Get conversation thread (message + replies)
    getConversation = async (req, res) => {
        try {
            const messageId = parseInt(req.params.messageId);

            const response = await AnonymousMessagesService.getConversation(messageId);
            if (response.success) {
                return res.status(200).json({ 
                    message: "Conversation retrieved successfully", 
                    conversation: response.conversation 
                });
            } else {
                return res.status(404).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Get unanswered messages (doctors only)
    getUnansweredMessages = async (req, res) => {
        try {
            const role = req.user.role;
            const limit = parseInt(req.query.limit) || 50;

            const response = await AnonymousMessagesService.getUnansweredMessages(role, limit);
            if (response.success) {
                return res.status(200).json({ 
                    message: "Unanswered messages retrieved successfully", 
                    messages: response.messages 
                });
            } else {
                return res.status(403).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Search messages
    searchMessages = async (req, res) => {
        try {
            const searchTerm = req.query.q;
            const limit = parseInt(req.query.limit) || 50;

            const response = await AnonymousMessagesService.searchMessages(searchTerm, limit);
            if (response.success) {
                return res.status(200).json({ 
                    message: "Search completed", 
                    messages: response.messages 
                });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Delete message (admin only)
    deleteMessage = async (req, res) => {
        try {
            const messageId = parseInt(req.params.messageId);
            const role = req.user.role;

            const response = await AnonymousMessagesService.deleteMessage(messageId, role);
            if (response.success) {
                return res.status(200).json({ message: response.message });
            } else {
                return res.status(403).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }
}

const anonymousMessagesController = new AnonymousMessagesController();
export default anonymousMessagesController;
