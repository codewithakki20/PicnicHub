import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'PicnicHub',
        trim: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowRegistration: {
        type: Boolean,
        default: true
    },
    contactEmail: {
        type: String,
        default: 'support@picnichub.com',
        trim: true
    }
}, { timestamps: true });

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

export default mongoose.model('Settings', settingsSchema);
