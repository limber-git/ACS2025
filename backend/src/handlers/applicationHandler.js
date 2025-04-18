const { postApplication, getAllApplications, getAllApplicationsById, getApplicationsCountForCurrentMonthById, updateApplication, getApplicationsByDateRange } = require("../controllers/applicationController")

module.exports = {
    postApplication: async (req, res) => {
        try {
            const application = req.body;
            const response = await postApplication(application);
            res.status(200).json({
                message: 'The application was registered correctly',
                success: true,
                application: response.application
            });
        } catch (error) {
            res.status(500).json({
                message: 'Registration could not be completed',
                success: false,
                error: error.message || error
            });
        }
    },
    putApplication: async (req, res) => {
        try {
            const { applicationId } = req.params;
            const applicationUpdates = req.body;
            const updatedApplication = await updateApplication(applicationId, applicationUpdates);
            res.status(200).json({
                message: 'The application was updated correctly',
                success: true,
                application: updatedApplication
            });
        } catch (error) {
            res.status(500).json({
                message: 'Update could not be completed',
                success: false,
                error: error.message || error
            });
        }
    },
    getAllApplications: async (req, res) => {
        try {
            const applications = await getAllApplications();
            res.status(200).json({
                success: true,
                data: applications
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    },
    
    getAllApplicationsById: async (req, res) => {
        try {
            const { applicationId } = req.params;
            const applications = await getAllApplicationsById(applicationId);
            res.status(200).json({
                success: true,
                data: applications
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    },
    getApplicationsCountForCurrentMonthById: async (req, res) => {
        try {
            const userId = req.params.userId;  // Obtener el ID de usuario de los parámetros de la ruta
            const count = await getApplicationsCountForCurrentMonthById(userId);
            
            // Asegúrate de que `count` es un número antes de enviar la respuesta
            res.status(200).json({
                success: true,
                data: { count }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    },
    
    //by date
    getApplicationsByDateRange: async (req, res) => {
        try {
            const { startDate, endDate } = req.query; // Use query parameters for filtering
            const applications = await getApplicationsByDateRange(startDate, endDate);
            
            res.status(200).json({
                success: true,
                data: applications
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    }
    
};
