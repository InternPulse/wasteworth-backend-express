const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Notification } = require("../db/models");

// Get user notifications with pagination and optional filtering
exports.getUserNotifications = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20, isRead, type } = req.query;

  // Validate userId
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) {
    throw new AppError('Invalid user ID provided', 400);
  }

  // Validate pagination params
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (parsedPage - 1) * parsedLimit;

  if (isNaN(parsedPage)) {
    throw new AppError('Invalid page number provided', 400);
  }
  if (isNaN(parsedLimit)) {
    throw new AppError('Invalid limit provided. Must be between 1 and 100', 400);
  }

  // Build where clause with optional filters
  const where = { userId: parsedUserId };
  if (isRead !== undefined) {
    where.isRead = isRead === 'true';
  }
  if (type && ['pickup', 'reward', 'marketplace', 'general'].includes(type)) {
    where.type = type;
  } else if (type) {
    throw new AppError('Invalid notification type provided', 400);
  }


  // Query with pagination and filters
  const { count, rows: notifications } = await models.Notification.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: parsedLimit,
    offset,
    include: [
      {
        model: models.User,
        as: 'user',
        attributes: ['id', 'username'],
        required: false, 
      },
    ],
  });

  const totalPages = Math.ceil(count / parsedLimit);

  res.status(200).json({
    success: true,
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



  exports.sendNotification = catchAsync (async (req, res) => {
    const { userId, type, message } = req.body;

    // Validate request body
    if (!userId || !type || !message) {
      throw new AppError('Missing required fields: userId, type, message', 400);
    }

    // Validate notification type
    const validTypes = ['pickup', 'reward', 'marketplace', 'general'];
    if (!validTypes.includes(type)) {
      throw new AppError(`Invalid notification type. Must be one of: ${validTypes.join(', ')}`, 400);
    }

    // Validate userId is a number
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      throw new AppError('Invalid user ID provided', 400);
    }

    const notification = await models.Notification.create({
      userId: parsedUserId,
      type,
      message,
      createdAt: new Date(),
      isRead: false, 
    });

    res.status(201).json({
      success: true,
      notification,
    });
  });