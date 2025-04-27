const { postApplication, getAllApplications, getAllApplicationsById, getApplicationsCountForCurrentMonthById, updateApplication, getApplicationsByDateRange, getApplicationsByUserId, uploadToImgBB } = require("../controllers/applicationController")

module.exports = {
    uploadToImgBB: async (req, res) => {
        try {
            const { base64Image, fileName } = req.body;
            const result = await uploadToImgBB(base64Image, fileName);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    },
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
    getApplicationsByUserId: async (req, res) => {
        try {
            const { userId } = req.params;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;

            console.log('Handler - Processing request:', {
                userId,
                page,
                limit,
                query: req.query
            });
            
            const result = await getApplicationsByUserId(userId, page, limit);
            console.log('Handler - Successfully retrieved applications');
            res.status(200).json(result);
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
    },
    
    
};
