class ExpressError extends Error {
    contructor(message, statusCode){
        // super();
        this.message = message,
        this.statusCode = statusCode
    }

}
module.exports = ExpressError;