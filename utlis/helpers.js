// Extract a meaningful error message from various error types
exports.extractErrorMessage = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.message) {
            return error.response.data.message;
        }
        return Server responded with error: ${error.response.status};
    } else if (error.request) {
        // The request was made but no response was received
        return 'No response received from server';
    } else {
        // Something happened in setting up the request that triggered an Error
        return error.message || 'Unknown error occurred';
    }
};
