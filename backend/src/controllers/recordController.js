const { Op } = require("sequelize");
const { Record, Application } = require("../dbContext");

module.exports = {
  deleteRecords: async (recordIds) => {
    try {
      // Elimina todos los registros que coincidan con los IDs proporcionados
      const deletedCount = await Record.destroy({
        where: {
          recordId: {
            [Op.in]: recordIds, // Utiliza el operador "in" para especificar una lista de IDs
          },
        },
      });

      return { success: true, deletedCount };
    } catch (error) {
      console.error("Error deleting records:", error);
      return { success: false, error: error.message };
    }
  },
  updateRecordStateToFalse: async (recordIds) => {
    try {
      const [updatedCount] = await Record.update(
        { state: false }, // Cambia el estado a false (eliminado lógico)
        {
          where: {
            recordId: {
              [Op.in]: recordIds, // Aplica solo a los IDs indicados
            },
            state: true, // Solo afecta registros activos
          },
        }
      );

      return { success: true, updatedCount };
    } catch (error) {
      console.error("Error updating record state to false:", error);
      return { success: false, error: error.message };
    }
  },
  getAllRecords: async (req, res) => {
    try {
      // 1. Leer page y limit de la query, con valores por defecto
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      // 2. Consulta paginada y total de registros
      const { count, rows: records } = await Record.findAndCountAll({
        offset,
        limit,
        order: [['date', 'DESC']], // Opcional: ordena por fecha descendente
      });
  
      // 3. Respuesta con datos y total
      return res.json({
        records,
        total: count,
        page,
        limit,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  // getAllRecords: async () => {
  //   try {
  //     const records = await Record.findAll();
  //     return records;
  //   } catch (error) {
  //     return error;
  //   }
  // },
  getRecordsByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: records } = await Record.findAndCountAll({
        where: { userId },
        offset,
        limit,
        order: [['date', 'DESC']],
      });

      const applications = await Application.findAll({
        where: { userId },
      });

      return res.json({
        records,
        // applications,
        total: count,
        page,
        limit,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getActiveRecordsByUser: async (userId) => {
    try {
      const records = await Record.findAll({
        where: {
          userId: userId,
          state: true, // Filtrar solo registros activos
        },
      });
      return records; // Podrías retornar solo los records
    } catch (error) {
      return { success: false, error: error.message }; // Mejora el manejo de errores
    }
  },

  getRecordsByDateRange: async (startDate, endDate) => {
    try {
      const dateFilter = {};

      if (startDate) {
        dateFilter[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        dateFilter[Op.lte] = new Date(endDate);
      }

      const records = await Record.findAll({
        where: {
          date: dateFilter,
        },
      });

      return records;
    } catch (error) {
      console.error("Error fetching records by date range:", error);
      throw new Error("Internal Server Error");
    }
  },
  getAllActiveRecords: async () => {
    try {
      const records = await Record.findAll({
        where: {
          state: true, // Filtra los registros con state en true
        },
      });
      return records;
    } catch (error) {
      throw error;
    }
  },
  updateRecordStateByDateRange: async (startDate, endDate, newState) => {},
};
