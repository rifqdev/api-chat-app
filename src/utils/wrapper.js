const errorResponse = (res, message, statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    code: statusCode,
    errorDetail: error,
  });
};

const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

const paginationResponse = (res, data, count, page, limit, message, statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
    pagination: {
      total_items: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / limit),
      items_per_page: parseInt(limit),
    },
  });
};

const notFoundResponse = (res, message, statusCode = 404) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    code: statusCode,
  });
};

module.exports = { errorResponse, successResponse, notFoundResponse, paginationResponse };
