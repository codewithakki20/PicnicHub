import Notification from "../models/Notification.js";

// Get user notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user.id })
            .populate("senderId", "name avatarUrl")
            .populate("referenceId") // Dynamic population based on onModel
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Mark notification as read
export const markRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
};

// Internal helper to create notification (not exposed via route usually)
export const createNotification = async ({ recipientId, senderId, type, referenceId, onModel }) => {
    try {
        if (recipientId.toString() === senderId.toString()) return; // Don't notify self

        await Notification.create({
            recipientId,
            senderId,
            type,
            referenceId,
            onModel
        });
    } catch (e) {
        console.error("Notification creation failed", e);
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Ensure only the recipient can delete the notification
        if (notification.recipientId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this notification" });
        }

        await notification.deleteOne();

        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error("Delete Notification Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
