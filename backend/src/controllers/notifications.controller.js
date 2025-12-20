import mongoose from "mongoose";
import Notification from "../models/Notification.js";

//GET USER NOTIFICATIONS
//?page=1&limit=20&unread=true
export const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unread } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = {
            recipientId: req.user._id,
            isDeleted: false,
        };

        if (unread === "true") {
            query.isRead = false;
        }

        const [notifications, total] = await Promise.all([
            Notification.find(query)
                .populate("senderId", "name avatarUrl")
                .populate({
                    path: "referenceId",
                    options: { lean: true },
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Notification.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            data: notifications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// MARK SINGLE NOTIFICATION AS READ
export const markRead = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid notification id" });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                recipientId: req.user._id,
                isDeleted: false,
            },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (error) {
        console.error("Mark Read Error:", error);
        res.status(500).json({ message: "Error updating notification" });
    }
};


// MARK ALL NOTIFICATIONS AS READ
export const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipientId: req.user._id,
                isRead: false,
                isDeleted: false,
            },
            { isRead: true }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Mark All Read Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// CREATE NOTIFICATION (INTERNAL HELPER)
// NOT EXPOSED AS ROUTE
export const createNotification = async ({
    recipientId,
    senderId,
    type,
    referenceId,
    onModel,
    meta = {},
}) => {
    try {
        if (!recipientId || !senderId) return;
        if (recipientId.toString() === senderId.toString()) return;

        await Notification.create({
            recipientId,
            senderId,
            type,
            referenceId,
            onModel,
            meta,
        });
    } catch (error) {
        console.error("Notification creation failed:", error);
    }
};


// DELETE NOTIFICATION (SOFT DELETE)

export const deleteNotification = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid notification id" });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                recipientId: req.user._id,
                isDeleted: false,
            },
            { isDeleted: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted",
        });
    } catch (error) {
        console.error("Delete Notification Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
