
export const ErrorResponse = ({
    message = "Internal Server Error",
    status = 500,
    extra = undefined,
}) => {
    const error = new Error(
        typeof message === "string" ? message : message?.message
    );

    error.status = status;
    error.extra = extra;

    throw error;
};

// 400
export const BadRequestException = (
    message = "Bad Request",
    extra = undefined
) => {
    return ErrorResponse({ message, status: 400, extra });
};

// 401
export const UnauthorizedException = (
    message = "Unauthorized",
    extra = undefined
) => {
    return ErrorResponse({ message, status: 401, extra });
};

// 403
export const ForbiddenException = (
    message = "Forbidden",
    extra = undefined
) => {
    return ErrorResponse({ message, status: 403, extra });
};

// 404
export const NotFoundException = (
    message = "Not Found",
    extra = undefined
) => {
    return ErrorResponse({ message, status: 404, extra });
};

// 409
export const ConflictException = (
    message = "Conflict",
    extra = undefined
) => {
    return ErrorResponse({ message, status: 409, extra });
};

// 429
export const TooManyRequestsException = (
    message = "Too Many Requests",
    extra = undefined
) => {
    return ErrorResponse({ message, status: 429, extra });
};

// 500
export const InternalServerErrorException = (
    message = "Internal Server Error",
    extra = undefined
) => {
    return ErrorResponse({ message, status: 500, extra });
};

// Global Error Handler
export const globalHandler = (error, req, res, next) => {
    const status = error.status ?? 500;
    return res.status(status).json({
        message: error.message,
        stack: error.stack,
        status,
        extra: error.extra,
    });
};



/*
    // use case:
    import * as exception from "../../Utils/response/error.response.js";
    if(!existing_user) return exception.NotFoundException("user not found");
*/