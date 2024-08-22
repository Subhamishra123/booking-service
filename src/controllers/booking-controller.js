const { BookingService } = require('../services')
const { SuccessResponse,ErrorResponse } = require('../utils/commons')
const { httpStatusCode } = require('httpstatuscode')
const logger = require('../config/logger-config')
async function createABooking(request,response)
{
    
    try {
        const data = await BookingService.createBooking({
            flightId:request.body.flightId,
            userId:request.body.userId,
            noOfSeats:request.body.noOfSeats
        })
        console.log(data)
        SuccessResponse.message="API is live"
        SuccessResponse.data=data
        return response.status(httpStatusCode.Created).json(SuccessResponse)
    } catch (error) {
        logger.error(`something went wrong in createABooking function ${error}`)
        ErrorResponse.message="API is having problems"
        ErrorResponse.error=error
        return response.status(httpStatusCode.InternalServerError).json(ErrorResponse)
    }
}

module.exports={
    createABooking
}