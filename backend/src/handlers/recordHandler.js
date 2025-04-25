const {
  getAllRecords,
  getRecordsByUser,
  getActiveRecordsByUser,
  updateRecordStateByDateRange,
  getAllActiveRecords,
  getRecordsByDateRange,
  deleteRecords,
  getRecordsByUserCalculated,
  updateRecordStateToFalse
} = require("../controllers/recordController");
const getErrorResponse = require("../utils/getErrorResponse");

module.exports = {
  getAllRecords: async (req, res) => {
    try {
      const records = await getAllRecords();
      res.status(200).json({
        success: true,
        records: records,
      });
    } catch (error) {
      getErrorResponse(error);
    }
  },
  getRecordsByUser: async (req, res) => {
    try {
      await getRecordsByUser(req, res);
    } catch (error) {
      getErrorResponse(error, res);
    }
  },

  getActiveRecordsByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { records } = await getActiveRecordsByUser(userId); // Cambia aquí para llamar a la función correcta

      res.status(200).json({
        success: true,
        records: records,
      });
    } catch (error) {
      getErrorResponse(error, res); // Asegúrate de pasar 'res' para enviar la respuesta de error
    }
  },

  getRecordsByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Usa parámetros de consulta para filtrar
      const records = await getRecordsByDateRange(startDate, endDate);

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || error,
      });
    }
  },
  getAllActiveRecords: async (req, res) => {
    try {
      const records = await getAllActiveRecords();
      res.status(200).json({
        success: true,
        records: records,
      });
    } catch (error) {
      getErrorResponse(error, res);
    }
  },
  updateRecordStateByDateRange: async (req, res) => {},
  // Nueva función para eliminar registros
  deleteRecords: async (req, res) => {
    try {
      const { recordIds } = req.body; // Obtener los IDs de los registros a eliminar

      if (!recordIds || !Array.isArray(recordIds)) {
        return res.status(400).json({
          success: false,
          message: "Debe proporcionar una lista de recordIds.",
        });
      }

      // Llamar al handler deleteRecords con los recordIds
      const result = await deleteRecords(recordIds);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: `${result.deletedCount} registros eliminados.`,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar los registros.",
          error: result.error,
        });
      }
    } catch (error) {
      getErrorResponse(error, res);
    }
  },
  updateRecordState: async (req, res) => {
    try {
      const { recordIds } = req.body;

      // Validación de entrada
      if (!recordIds || !Array.isArray(recordIds)) {
        return res.status(400).json({
          success: false,
          message: "Debe proporcionar una lista de recordIds válida.",
        });
      }

      // Actualizar el estado de los registros
      const result = await updateRecordStateToFalse(recordIds);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: `${result.updatedCount} registros marcados como eliminados lógicamente.`,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Error al actualizar el estado de los registros.",
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Error in updateRecordState handler:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
      });
    }
  },
  getRecordsByUserCalculated: async (req, res) => {
    try {
      await getRecordsByUserCalculated(req, res); // El del controller
    } catch (error) {
      getErrorResponse(error, res);
    }
  }
  
};
