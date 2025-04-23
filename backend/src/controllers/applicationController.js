const { Application } = require("../dbContext");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

module.exports = {
  postApplication: async (application) => {
    try {
      const newApplication = await Application.create(application);
      return {
        success: true,
        message: "Application created successfully",
        application: newApplication,
      };
    } catch (error) {
      console.error("Error creating leave application:", error);
      throw new Error("Internal Server Error");
    }
  },

  updateApplication: async (applicationId, applicationUpdates) => {
    try {
      const application = await Application.findByPk(applicationId);
      if (!application) {
        throw new Error("Application not found");
      }
      const updatedApplication = await application.update(applicationUpdates);
      return {
        success: true,
        message: "Application updated successfully",
        application: updatedApplication,
      };
    } catch (error) {
      console.error("Error updating application:", error);
      throw new Error("Internal Server Error");
    }
  },

  getAllApplications: async () => {
    try {
      const applications = await Application.findAll();
      return applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw new Error("Internal Server Error");
    }
  },

  getAllApplicationsById: async (applicationId) => {
    try {
      const applications = await Application.findAll({
        where: {
          userId: applicationId,
        },
      });
      return applications;
    } catch (error) {
      throw new Error("Error fetching applications by ID: " + error.message);
    }
  },
  getApplicationsByDateRange: async (startDate, endDate) => {
    try {
      const dateFilter = {};

      if (startDate) {
        dateFilter[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        dateFilter[Op.lte] = new Date(endDate);
      }

      const applications = await Application.findAll({
        where: {
          regularDate: dateFilter,
        },
      });

      return applications;
    } catch (error) {
      console.error("Error fetching applications by date range:", error);
      throw new Error("Internal Server Error");
    }
  },
  getApplicationsByUserId: async (userId, page = 1, limit = 10) => {
    try {
      // Validate and sanitize input
      const validatedPage = Math.max(1, parseInt(page));
      const validatedLimit = Math.min(50, Math.max(1, parseInt(limit))); // Cap at 50 items per page
      const offset = (validatedPage - 1) * validatedLimit;

      console.log('Controller - Fetching applications with:', {
        userId,
        page: validatedPage,
        limit: validatedLimit,
        offset
      });
      
      // Get paginated results and total count
      const { count, rows } = await Application.findAndCountAll({
        where: { userId },
        order: [['regularDate', 'DESC']], // Sort by date, newest first
        limit: validatedLimit,
        offset: offset
      });

      // Map the results to our response format
      const records = rows.map(app => ({
        applicationId: app.applicationId,
        type: app.type,
        status: app.status,
        submissionDate: app.regularDate,
        reason: app.reason,
        reviewDate: app.reviewDate,
        regularTime: app.regularTime,
        time: app.time,
        state: app.state,
        by: app.by,
        suggestion: app.suggestion
      }));

      // Calculate pagination metadata
      const totalPages = Math.ceil(count / validatedLimit);
      const hasNextPage = validatedPage < totalPages;
      const hasPreviousPage = validatedPage > 1;

      console.log('Controller - Pagination info:', {
        total: count,
        totalPages,
        currentPage: validatedPage,
        hasNextPage,
        hasPreviousPage
      });
      
      return {
        success: true,
        records,
        pagination: {
          total: count,
          totalPages,
          currentPage: validatedPage,
          pageSize: validatedLimit,
          hasNextPage,
          hasPreviousPage
        }
      };
    } catch (error) {
      throw new Error("Error fetching applications by user ID: " + error.message);
    }
  },

  getApplicationsCountForCurrentMonthById: async (userId) => {
    try {
      // Obtener el primer y último día del mes actual como objetos Date
      const startOfMonth = dayjs().startOf("month").toDate(); // Usamos toDate() para obtener un objeto Date
      const endOfMonth = dayjs().endOf("month").toDate(); // Usamos toDate() para obtener un objeto Date

      // Contar las aplicaciones del usuario en el mes actual
      const applicationsCount = await Application.count({
        where: {
          userId: userId,
          regularDate: {
            [Op.between]: [startOfMonth, endOfMonth], // Filtrar por fecha en el mes actual
          },
        },
      });

      return applicationsCount; // Retorna el número de aplicaciones
    } catch (error) {
      throw new Error(
        "Error fetching applications count by ID: " + error.message
      );
    }
  },
};
