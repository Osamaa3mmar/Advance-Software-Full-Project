import { Router } from "express";
import anonymousMessagesController from "../Controllers/AnonymousMessagesController.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isDoctor } from "../Middleware/IsDoctor.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";
import multer from "multer";

// Configure multer for optional file attachments
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/tmp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname.replace(/\s/g, '_') + "-" + uniqueSuffix);
    }
});

const uploadAttachment = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for attachments
});

const anonymousMessagesRouter = Router();

// Send anonymous message (any authenticated user)
anonymousMessagesRouter.post("/send", isLogin, uploadAttachment.single("attachment"), anonymousMessagesController.sendMessage);

// Reply to message (doctors only)
anonymousMessagesRouter.post("/reply/:messageId", isLogin, isDoctor, uploadAttachment.single("attachment"), anonymousMessagesController.replyToMessage);

// Get all messages (paginated)
anonymousMessagesRouter.get("/all", isLogin, anonymousMessagesController.getAllMessages);

// Get conversation thread
anonymousMessagesRouter.get("/conversation/:messageId", isLogin, anonymousMessagesController.getConversation);

// Get unanswered messages (doctors only)
anonymousMessagesRouter.get("/unanswered", isLogin, isDoctor, anonymousMessagesController.getUnansweredMessages);

// Search messages
anonymousMessagesRouter.get("/search", isLogin, anonymousMessagesController.searchMessages);

// Delete message (admin only)
anonymousMessagesRouter.delete("/:messageId", isLogin, adminMiddleware, anonymousMessagesController.deleteMessage);

export default anonymousMessagesRouter;
