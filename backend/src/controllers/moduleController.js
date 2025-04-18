const { Module } = require("../dbContext");

module.exports = {
    postModule: async (module) => {
        try {
            const newModule = await Module.create(module);
            return {
                success: true,
                message: 'Module created successfully',
                module: newModule
            };
        } catch (error) {
            throw new Error('Internal Server Error');
        }
    },

    updateModule: async (moduleId, moduleUpdates) => {
        try {
            const module = await Module.findByPk(moduleId);
            if (!module) {
                throw new Error('Module not found');
            }
            const updatedModule = await module.update(moduleUpdates);
            return {
                success: true,
                message: 'Module updated successfully',
                module: updatedModule
            };
        } catch (error) {
            throw new Error('Internal Server Error');
        }
    },
    getAllModules: async () => {
        try {
            const modules = await Module.findAll();
            return modules
        } catch (error) {
            throw new Error('Internal Server Error');
        }
    },
    
    getModulesById: async (modulesId) => {
        try {
            const modules = await Module.findAll({
                where: {
                    modulesId: modulesId
                }
            });
            return modules
        } catch (error) {
            throw new Error('Error fetching Modules by ID: ' + error.message);
        }
    },

    deleteModulePhysical: async (moduleId) => {
        try {
            const module = await Module.findByPk(moduleId);
            if (!module) {
                throw new Error('Module not found');
            }
            await module.destroy();
            return {
                success: true,
                message: 'Module deleted successfully (physical delete)'
            };
        } catch (error) {
            throw new Error('Internal Server Error Physical Delete Failed');
        }
    },

    deleteModuleLogical: async (moduleId) => {
        try {
            const module = await Module.findByPk(moduleId);
            if (!module) {
                throw new Error('Module not found');
            }
            await module.update({ isDeleted: true });
            return {
                success: true,
                message: 'Module marked as deleted successfully (logical delete)'
            };
        } catch (error) {
            throw new Error('Internal Server Error Logical Delete Failed'+error.message);
        }
    }
}