const moduleController = require('../controllers/moduleController');

module.exports = {
    postModule: async (req, res) => {
        try {
            const module = req.body;
            const response = await moduleController.postModule(module);
            res.status(201).json({
                message: response.message,
                success: response.success,
                module: response.module
            });
        } catch (error) {
            res.status(500).json({
                message: 'Creation could not be completed',
                success: false,
                error: error.message || error
            });
        }
    },

    putModule: async (req, res) => {
        try {
            const { moduleId } = req.params;
            const moduleUpdates = req.body;
            const response = await moduleController.updateModule(moduleId, moduleUpdates);
            res.status(200).json({
                message: response.message,
                success: response.success,
                module: response.module
            });
        } catch (error) {
            res.status(500).json({
                message: 'Update could not be completed',
                success: false,
                error: error.message || error
            });
        }
    },

    getAllModules: async (req, res) => {
        try {
            const modules = await moduleController.getAllModules();
            res.status(200).json({
                success: true,
                data: modules
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    },

    getModuleById: async (req, res) => {
        try {
            const { moduleId } = req.params;
            const modules = await moduleController.getModulesById(moduleId);
            if (modules.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Module not found'
                });
            }
            res.status(200).json({
                success: true,
                data: modules
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    },

    deleteModulePhysical: async (req, res) => {
        try {
            const { moduleId } = req.params;
            const response = await moduleController.deleteModulePhysical(moduleId);
            res.status(200).json({
                message: response.message,
                success: response.success
            });
        } catch (error) {
            res.status(500).json({
                message: 'Physical deletion could not be completed',
                success: false,
                error: error.message || error
            });
        }
    },

    deleteModuleLogical: async (req, res) => {
        try {
            const { moduleId } = req.params;
            const response = await moduleController.deleteModuleLogical(moduleId);
            res.status(200).json({
                message: response.message,
                success: response.success
            });
        } catch (error) {
            res.status(500).json({
                message: 'Logical deletion could not be completed',
                success: false,
                error: error.message || error
            });
        }
    }
};
