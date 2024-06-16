class ErrorHandler extends Error {
    constructor (message,statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

export const errorMiddleware = (err,req,res,next)=>{
    err.message = err.message || "Internal Server Error"
    err.statusCode = err.statusCode || 500

    if(err.statusCode ==11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
        next(err)
    }
    if(err.name =="JsonWebTokenError"){
        const message = `JsonWebToken is Invalid, Try again`
        err = new ErrorHandler(message, 400)
        next(err)
    }
    if(err.name =="TokenExpiredError"){
        const message = `JsonWebToken is Expired.`
        err = new ErrorHandler(message, 400)
        next(err)
    }
    if(err.name =="CastError"){
        const message = `invalid ${err.path}`
        err = new ErrorHandler(message, 400)
        next(err)
    }

    const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    })
}



export {ErrorHandler}