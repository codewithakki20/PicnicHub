import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { siteName, maintenanceMode, allowRegistration, contactEmail } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (siteName !== undefined) settings.siteName = siteName;
        if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
        if (allowRegistration !== undefined) settings.allowRegistration = allowRegistration;
        if (contactEmail !== undefined) settings.contactEmail = contactEmail;

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
