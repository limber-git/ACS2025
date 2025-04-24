const { Op } = require('sequelize');
const { Record } = require('../models/Record');
const { Application } = require('../models/Application');
const { getErrorResponse } = require('../utils/getErrorResponse');

const getAttendanceStatus = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    // Construir el filtro de fechas
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Obtener registros con sus aplicaciones relacionadas
    const { rows: records, count } = await Record.findAndCountAll({
      where: {
        userId,
        ...dateFilter
      },
      include: [{
        model: Application,
        as: 'applications',
        required: false,
        where: {
          status: 'APPROVED'
        }
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']]
    });

    // Procesar cada registro para determinar su estado
    const processedRecords = records.map(record => {
      const { clockIn, clockOut, onDuty, offDuty, applications } = record;
      
      // Determinar el tipo de estado
      let statusType = 'PRESENT';
      let justification = null;

      // Si hay una aplicación aprobada, el estado es justificado
      if (applications && applications.length > 0) {
        statusType = 'JUSTIFIED';
        const app = applications[0];
        justification = {
          applicationId: app.id,
          type: app.type,
          reason: app.reason,
          status: app.status
        };
      }
      // Si no hay check-in o check-out, el estado es ausente
      else if (!clockIn || !clockOut) {
        statusType = 'ABSENT';
      }
      // Si el check-in es después de onDuty, el estado es tarde
      else if (new Date(record.date + 'T' + clockIn) > new Date(record.date + 'T' + onDuty)) {
        statusType = 'LATE';
      }

      return {
        recordId: record.id,
        date: record.date,
        schedule: {
          onDuty,
          offDuty
        },
        attendance: {
          clockIn,
          clockOut
        },
        status: {
          type: statusType,
          ...(justification && { justification })
        }
      };
    });

    res.json({
      records: processedRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count
      }
    });

  } catch (error) {
    console.error('Error getting attendance status:', error);
    res.status(500).json(getErrorResponse(error));
  }
};

module.exports = {
  getAttendanceStatus
};
