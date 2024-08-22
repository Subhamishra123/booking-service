const express = require('express')
const bookingRouter=express.Router()
const { BookingController } = require('../../controllers')
const { BookingMiddleware } = require('../../middlewares')
bookingRouter.post('/',BookingMiddleware.validateCreateBooking,BookingController.createABooking)
module.exports={
    bookingRouter
}