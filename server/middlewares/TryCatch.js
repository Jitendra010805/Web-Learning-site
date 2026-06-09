const TryCatch=(handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            console.error(error); // Log the actual error to server console
            res.status(500).json({
                message: error.message || "Internal Server Error",
            });
        }
    };
};

export default TryCatch;