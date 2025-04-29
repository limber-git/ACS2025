const { Application } = require("../dbContext");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
const axios = require("axios");
require("dotenv").config();

const IMGBB_API_KEY = process.env.API_KEY_IMGBB;
const IMGBB_BASE_URL = process.env.BASE_URL;

module.exports = {
  uploadToImgBB: async (base64Image, fileName = null) => {
    try {
      const formData = new URLSearchParams();
      formData.append("key", IMGBB_API_KEY);

      // Si la imagen ya viene como base64, extraemos la parte relevante
      const imageData = base64Image.includes("base64")
        ? base64Image.split(",")[1]
        : base64Image;

      formData.append("image", imageData);

      // Si se proporciona un nombre de archivo, lo agregamos
      if (fileName) {
        formData.append("name", fileName);
      }

      const response = await axios.post(`${IMGBB_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.data) {
        throw new Error("Failed to upload image");
      }

      const data = response.data;
      return {
        url: data.data.url,
        delete_url: data.data.delete_url,
        display_url: data.data.display_url,
        thumbnail: data.data?.thumb?.url || null,
      };
    } catch (error) {
      console.error("Error uploading to imgBB:", error);
      throw new Error("Failed to upload image");
    }
  },

  postApplication: async (applicationData) => {
    console.log(applicationData);
    try {
      const { recordId, userId, reason, file, regularDate, regularTime, type, time } =
        applicationData;

      let fileData = null;
      if (file) {
        const now = dayjs();
        const formattedDate = now.format("YYYY-MM-DD");
        const fileType =
          typeof file === "string" && file.startsWith("data:image")
            ? "image"
            : "document";
        const fileName = `uploaded_${formattedDate}_${fileType}`;

        fileData = await module.exports.uploadToImgBB(file, fileName);
      }

      const newApplication = await Application.create({
        recordId,
        userId,
        reason,
        regularDate,
        regularTime,
        time,
        type,
        img: fileData ? fileData.url : null,
        status: "Pending", // este sí, lo pones fijo
      });

      return {
        success: true,
        message: "Application created successfully",
        application: newApplication,
      };
    } catch (error) {
      console.error("Error creating application:", error);
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


      // Get paginated results and total count
      const { count, rows } = await Application.findAndCountAll({
        where: { userId },
        order: [["regularDate", "DESC"]], // Sort by date, newest first
        limit: validatedLimit,
        offset: offset,
      });

      // Map the results to our response format
      const records = rows.map((app) => ({
        applicationId: app.applicationId,
        recordId: app.recordId,
        type: app.type,
        status: app.status,
        submissionDate: app.regularDate,
        reason: app.reason,
        reviewDate: app.reviewDate,
        regularTime: app.regularTime,
        time: app.time,
        state: app.state,
        by: app.by,
        suggestion: app.suggestion,
      }));

      // Calculate pagination metadata
      const totalPages = Math.ceil(count / validatedLimit);
      const hasNextPage = validatedPage < totalPages;
      const hasPreviousPage = validatedPage > 1;
      return {
        success: true,
        records,
        pagination: {
          total: count,
          totalPages,
          currentPage: validatedPage,
          pageSize: validatedLimit,
          hasNextPage,
          hasPreviousPage,
        },
      };
    } catch (error) {
      throw new Error(
        "Error fetching applications by user ID: " + error.message
      );
    }
  },

  getApplicationsCountForCurrentMonthById: async (userId) => {
    try {
      const startOfMonth = dayjs().startOf("month").toDate();
      const endOfMonth = dayjs().endOf("month").toDate();

      const applicationsCount = await Application.count({
        where: {
          userId: userId,
          regularDate: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      return applicationsCount;
    } catch (error) {
      throw new Error(
        "Error fetching applications count by ID: " + error.message
      );
    }
  },
  deleteApplication: async (applicationId) => {
    try {
      const application = await Application.findByPk(applicationId);
      if (!application) {
        throw new Error("Application not found");
      }
      await application.destroy();
      return {
        success: true,
        message: "Application deleted successfully",
      };
    } catch (error) {
      throw new Error("Error deleting application: " + error.message);
    }
  },  
};
