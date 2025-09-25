const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Notification, User } = require("../db/models");

// Get user notifications with pagination and optional filtering
exports.getUserNotifications = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20, is_read, type } = req.query;

  // Validate userId as UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    throw new AppError("Invalid user ID provided (must be a valid UUID)", 400);
  }

  // Validate user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Validate and sanitize pagination params
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (parsedPage - 1) * parsedLimit;

  if (isNaN(parsedPage)) {
    throw new AppError("Invalid page number provided", 400);
  }
  if (isNaN(parsedLimit)) {
    throw new AppError(
      "Invalid limit provided. Must be between 1 and 100",
      400
    );
  }

  // Build where clause with optional filters
  const where = { userId };
  if (is_read !== undefined) {
    where.is_read = is_read === "true";
  }
  if (type) {
    const validTypes = ["pickup", "reward", "marketplace", "general"];
    if (!validTypes.includes(type)) {
      throw new AppError(
        `Invalid notification type. Must be one of: ${validTypes.join(", ")}`,
        400
      );
    }
    where.type = type;
  }

  // Query with pagination, filters, and optimized attributes
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
    success: true,
    data: {
      notifications,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalCount: count,
        limit: parsedLimit,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
    },
  });
});

exports.sendNotification = catchAsync(async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    throw new AppError("Missing required fields: userId, type, message", 400);
  }

  const validTypes = ["pickup", "reward", "marketplace", "general"];
  if (!validTypes.includes(type)) {
    throw new AppError(
      `Invalid notification type. Must be one of: ${validTypes.join(", ")}`,
      400
    );
  }

  // Validate userId is a valid UUID string (no parseInt)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    throw new AppError("Invalid user ID provided (must be a valid UUID)", 400);
  }

  // Validate user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const notification = await Notification.create({
    userId,
    type,
    message,
    created_at: new Date(),
    is_read: false,
  });

  res.status(201).json({
    success: true,
    notification,
  });
});
