import { connection } from "../../Database/Connection.js";

export class AnonymousMessagesRepository {

    // Create a new anonymous message
    static createMessage = async (messageData) => {
        const [result] = await connection.query(
            "INSERT INTO anonymous_messages (content, asset_link, is_replay, replay_id) VALUES (?, ?, ?, ?)",
            [messageData.content, messageData.asset_link || null, messageData.is_replay || 0, messageData.replay_id || null]
        );
        return result;
    }

    // Get all messages (for viewing conversation threads)
    static getAllMessages = async (limit = 50, offset = 0) => {
        const [rows] = await connection.query(
            "SELECT id, content, asset_link, is_replay, replay_id, created_at FROM anonymous_messages WHERE is_replay = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [limit, offset]
        );
        return rows;
    }

    // Get message by ID
    static getMessageById = async (messageId) => {
        const [rows] = await connection.query(
            "SELECT id, content, asset_link, is_replay, replay_id, created_at FROM anonymous_messages WHERE id = ?",
            [messageId]
        );
        return rows[0];
    }

    // Get replies to a specific message
    static getReplies = async (messageId) => {
        const [rows] = await connection.query(
            "SELECT id, content, asset_link, is_replay, replay_id, created_at FROM anonymous_messages WHERE replay_id = ? ORDER BY created_at ASC",
            [messageId]
        );
        return rows;
    }

    // Get conversation thread (message + all replies)
    static getConversationThread = async (messageId) => {
        // Get the main message
        const mainMessage = await this.getMessageById(messageId);
        if (!mainMessage) return null;

        // Get all replies
        const replies = await this.getReplies(messageId);

        return {
            mainMessage,
            replies
        };
    }

    // Delete message
    static deleteMessage = async (messageId) => {
        const [result] = await connection.query(
            "DELETE FROM anonymous_messages WHERE id = ?",
            [messageId]
        );
        return result;
    }

    // Search messages by content
    static searchMessages = async (searchTerm, limit = 50) => {
        const [rows] = await connection.query(
            "SELECT id, content, asset_link, is_replay, replay_id, created_at FROM anonymous_messages WHERE content LIKE ? ORDER BY created_at DESC LIMIT ?",
            [`%${searchTerm}%`, limit]
        );
        return rows;
    }

    // Get recent messages count (for dashboard)
    static getRecentMessagesCount = async () => {
        const [rows] = await connection.query(
            "SELECT COUNT(*) as count FROM anonymous_messages WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) AND is_replay = 0"
        );
        return rows[0].count;
    }

    // Get unanswered messages (messages with no replies)
    static getUnansweredMessages = async (limit = 50) => {
        const [rows] = await connection.query(
            `SELECT am.id, am.content, am.asset_link, am.created_at 
             FROM anonymous_messages am 
             LEFT JOIN anonymous_messages replies ON replies.replay_id = am.id 
             WHERE am.is_replay = 0 AND replies.id IS NULL 
             ORDER BY am.created_at DESC 
             LIMIT ?`,
            [limit]
        );
        return rows;
    }
}
