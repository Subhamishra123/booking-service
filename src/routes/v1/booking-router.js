const express = require('express')
const bookingRouter=express.Router()
const { BookingController } = require('../../controllers')
const { BookingMiddleware } = require('../../middlewares')
bookingRouter.post('/',BookingMiddleware.validateCreateBooking,BookingController.createABooking)
bookingRouter.post('/payments',BookingMiddleware.validateMakePayment,BookingController.makePayment)
bookingRouter.get('/',BookingController.getBookings)
module.exports={
    bookingRouter
}