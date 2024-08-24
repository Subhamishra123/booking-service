const { httpStatusCode } = require('httpstatuscode')
const  AppError  = require('../utils/errors/AppError')
const { ErrorResponse } =require('../utils/commons')
const logger = require('../config/logger-config')

function validateCreateBooking(request,response,next)
{
    
    if(!request.body.flightId)
    {
        
        ErrorResponse.error=new AppError(["flightId not entered"],httpStatusCode.BadRequest)
        logger.error('flightId not entered')
        return response.status(httpStatusCode.BadRequest).json(ErrorResponse)
    }//noOfSeats
    if(!request.body.noOfSeats)
    {
            
        ErrorResponse.error=new AppError(["noOfSeats not entered"],httpStatusCode.BadRequest)
        logger.error('noOfSeats not entered')
        return response.status(httpStatusCode.BadRequest).json(ErrorResponse)
    }
    if(!request.body.userId)
    {
                
        ErrorResponse.error=new AppError(["userId not entered"],httpStatusCode.BadRequest)
        logger.error('userId not entered')
        return response.status(httpStatusCode.BadRequest).json(ErrorResponse)
    }
    next()
}
function validateMakePayment(request,response,next)
{
    
    if(!request.body.totalCost)
    {
        
        ErrorResponse.error=new AppError(["totalCost not entered"],httpStatusCode.BadRequest)
        logger.error('totalCost not entered')
        return response.status(httpStatusCode.BadRequest).json(ErrorResponse)
    }//noOfSeats
    if(!request.body.userId)
    {
            
        ErrorResponse.error=new AppError(["userId not entered"],httpStatusCode.BadRequest)
        logger.error('userId not entered')
        return response.status(httpStatusCode.BadRequest).json(ErrorResponse)
    }
    if(!request.body.bookingId)
    {
                
        ErrorResponse.error=new AppError(["bookingId not entered"],httpStatusCode.BadRequest)
        logger.error('bookingId not entered')
        return response.status(httpStatusCode.BadRequest).json(ErrorResponse)
    }
    next()
}


module.exports={
    validateCreateBooking,
    validateMakePayment
}