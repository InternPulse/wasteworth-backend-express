const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Notification, User } = require("../db/models");
const { clearCache } = require("../Middleware/cache");
const { Op } = require("sequelize");

// Get user notifications with pagination and optional filtering
exports.getUserNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 20, isRead, type } = req.query;

  // Validate userId
  const parsedUserId = userId; // already a string from JWT/session
  if (!parsedUserId || typeof parsedUserId !== "string") {
    return new AppError("Invalid user ID provided", 400);
  }

  // Validate pagination params
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (parsedPage - 1) * parsedLimit;

  if (isNaN(parsedPage)) {
    return new AppError("Invalid page number provided", 400);
  }
  if (isNaN(parsedLimit)) {
    return new AppError(
      "Invalid limit provided. Must be between 1 and 100",
      400
    );
  }

  // Build where clause with optional filters
  const where = { userId };
  if (isRead !== undefined) {
    where.is_read = isRead === "true";
  }
  if (type && ["pickup", "reward", "marketplace", "general"].includes(type)) {
    where.type = type;
  } else if (type) {
    return new AppError("Invalid notification type provided", 400);
  }

  // Query with pagination and filters
  const { count, rows: notifications } = await Notification.findAndCountAll({
    where,
    order: [["created_at", "DESC"]],
    limit: parsedLimit,
    offset,
    attributes: [
      "id",
      "type",
      "message",
      ["is_read", "isRead"], // Map to camelCase in response
      ["created_at", "createdAt"], // Map to camelCase in response
    ],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
        required: false,
      },
    ],
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(count / parsedLimit);

  res.status(200).json({
    status: "success",
    length: notifications.length,
    notifications,
    pagination: {
      currentPage: parsedPage,
      totalPages,
      totalCount: count,
      limit: parsedLimit,
      hasNextPage: parsedPage < totalPages,
      hasPrevPage: parsedPage > 1,
    },
  });
});

exports.sendNotification = catchAsync(async (req, res) => {
  const { userId, type, message } = req.body;

  // Validate request body
  if (!userId || !type || !message) {
    return new AppError("Missing required fields: userId, type, message", 400);
  }

  // Validate notification type
  const validTypes = ["pickup", "reward", "marketplace", "general"];
  if (!validTypes.includes(type)) {
    return new AppError(
      `Invalid notification type. Must be one of: ${validTypes.join(", ")}`,
      400
    );
  }

  const notification = await Notification.create({
    userId,
    type,
    message,
    isRead: false,
  });

  // Clear notification caches
  try {
    await clearCache(`cache:/api/v1/notifications*`);
  } catch (err) {
    console.error("Redis cache clear error:", err);
  }

  res.status(201).json({
    status: "success",
    data: notification,
  });
});

exports.markNotificationAsRead = catchAsync(async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    return new AppError("Missing required field: notificationId", 400);
  }

  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      userId: req.user.id,
    },
  });

  if (!notification) {
    return new AppError("Notification not found", 404);
  }

  await notification.update({ is_read: true });

  // Clear notification caches
  try {
    await clearCache(`cache:/api/v1/notifications*`);
  } catch (err) {
    console.error("Redis cache clear error:", err);
  }

  res.status(200).json({
    status: "success",
    data: notification,
  });
});

exports.deleteNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    return new AppError("Missing required field: notificationId", 400);
  }

  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      userId: req.user.id,
    },
  });

  if (!notification) {
    return new AppError("Notification not found", 404);
  }

  await notification.destroy();

  // Clear notification caches
  try {
    await clearCache(`cache:/api/v1/notifications*`);
  } catch (err) {
    console.error("Redis cache clear error:", err);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
