const { BookingService } = require('../services')
const { SuccessResponse,ErrorResponse } = require('../utils/commons')
const { httpStatusCode } = require('httpstatuscode')
const logger = require('../config/logger-config')
const inMemDb={}
async function createABooking(request,response)
{
    
    try {
        const data = await BookingService.createBooking({
            flightId:request.body.flightId,
            userId:request.body.userId,
            noOfSeats:request.body.noOfSeats
        })
        
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

async function makePayment(request,response)
{
    
    try {
        const idempotencyKey=request.headers['x-idempotency-key']
        if(!idempotencyKey)
        {
            return response.status(httpStatusCode.BadRequest).json({message:'Idempotency key missing'})
        }
        if(inMemDb[idempotencyKey])
        {
            return response.status(httpStatusCode.BadRequest).json({message:'Cannot retry on succesful payment'})
        }
        const data = await BookingService.makePayment({
            totalCost:request.body.totalCost,
            userId:request.body.userId,
            bookingId:request.body.bookingId
        })
        inMemDb[idempotencyKey]=idempotencyKey
        SuccessResponse.message="API is live"
        SuccessResponse.data=data
        return response.status(httpStatusCode.Created).json(SuccessResponse)
    } catch (error) {
        logger.error(`something went wrong in makePayment function ${error}`)
        ErrorResponse.message="API is having problems"
        ErrorResponse.error=error
        return response.status(httpStatusCode.InternalServerError).json(ErrorResponse)
    }
}

async function getBookings(request,response) {
    try {
        const bookings = await BookingService.getBookings()
        return response.status(httpStatusCode.OK).json(bookings)
    } catch (error) {
       
        return response.status(httpStatusCode.InternalServerError).json({
            message:"Something went wrong",
            error:error
        })
    }
}

module.exports={
    createABooking,
    makePayment,
    getBookings
}