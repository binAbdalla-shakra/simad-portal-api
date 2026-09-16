const UploadConfig = require('../../models/UploadConfig.model');
const { successResponse, errorResponse } = require('../../utils/response');
const { getReadableMessage } = require('../../utils/error-messages');

// Bulk create default configurations
exports.createDefaultConfigs = async (req, res) => {
    try {
        const defaultConfigs = [
            {
                configName: 'WHY_SIMAD_IMAGES',
                fieldName: 'history',
                uploadPath: process.env.ADMIN_FRONTEND_BASE_URL + '/why_simad_images/',
                maxFiles: 100,
                fileType: 'image',
                description: 'Configuration for why simad section images'
            },
            {
                configName: 'USER_DOCUMENTS',
                fieldName: 'documents',
                uploadPath: process.env.ADMIN_FRONTEND_BASE_URL + '/userDocuments/',
                maxFiles: 50,
                fileType: 'document',
                description: 'Configuration for user document uploads'
            },
            {
                configName: 'PROFILE_IMAGES',
                fieldName: 'profile',
                uploadPath: process.env.ADMIN_FRONTEND_BASE_URL + '/profileImages/',
                maxFiles: 10,
                fileType: 'image',
                description: 'Configuration for profile images'
            }
        ];

        const results = [];
        for (const configData of defaultConfigs) {
            try {
                const existingConfig = await UploadConfig.findOne({
                    configName: configData.configName
                });

                if (!existingConfig) {
                    const newConfig = new UploadConfig(configData);
                    await newConfig.save();
                    results.push({ config: configData.configName, status: 'created' });
                } else {
                    results.push({ config: configData.configName, status: 'exists' });
                }
            } catch (error) {
                results.push({ config: configData.configName, status: 'error', error: error.message });
            }
        }

        return successResponse(res, { results }, 'Default configurations processed');
    } catch (error) {
        return errorResponse(res, getReadableMessage(error), 500);
    }
};