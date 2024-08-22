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
    }
    next()
}

module.exports={
    validateCreateBooking
}