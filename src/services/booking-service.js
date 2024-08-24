const axios = require('axios')
const {BookingRepository} = require('../repositories')
const db = require('../models')
const { httpStatusCode } = require('httpstatuscode')
const { ServerConfig } = require('../config')
const AppError = require('../utils/errors/AppError')
const { ENUMS } = require('../utils/commons')
const { BOOKED,CANCELLED } = ENUMS.BOOKING_STATUS
const bookingRepository = new BookingRepository()
async function createBooking(data) {
    const transaction = await db.sequelize.transaction()
   
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHTURL}${data.flightId}`)
        const flightData=flight.data.data
        if(data.noOfSeats>flightData.totalSeats)
        {
            throw new AppError('Not enough available seats',httpStatusCode.BadRequest)
        }
        
        const totalBillingAmount=data.noOfSeats*flightData.price
        const bookingPayload={...data,totalCost:totalBillingAmount}
        console.log(bookingPayload)
        const booking = await bookingRepository.create(bookingPayload,transaction)
        
        //update remaining seats
        //http://localhost:3000/api/v1/flight/:id/seats

        await axios.patch(`http://localhost:3000/api/v1/flight/${data.flightId}/seats`,{
            seats:data.noOfSeats,
            dec:1
        })

        await transaction.commit()
        return booking
    } catch (error) {
        await transaction.rollback()
        throw error
    }

    
}


async function makePayment(data) {
    //return cancelBooking(data.bookingId)
    const transaction = await db.sequelize.transaction()
    try {
        const bookingDetails=await bookingRepository.getBooking(data.bookingId,transaction)
        
        if(bookingDetails.totalCost != data.totalCost){
            throw new AppError('Incorrect cost entered',httpStatusCode.BadRequest)
        }
        if(bookingDetails.userId != data.userId)
        {
            throw new AppError('Incorrect userId entered',httpStatusCode.BadRequest)
        }
        if(bookingDetails.id != data.bookingId)
        {
            throw new AppError('Incorrect bookingId entered',httpStatusCode.BadRequest)
        }
        if(bookingDetails.status==CANCELLED){
            throw new AppError('The booking has expired',httpStatusCode.BadRequest)
        }
        const bookingTime=new Date(bookingDetails.createdAt)
        const currentTime=new Date()
        if(currentTime-bookingTime>300000)
        {
           // await bookingRepository.update(data.bookingId,{status:CANCELLED},transaction)
            await cancelBooking(data.bookingId)
            throw new AppError('The booking has expired',httpStatusCode.BadRequest)
        }
        if(bookingDetails.totalCost != data.totalCost)
        {
            throw new AppError('Amount entered is incorrect',httpStatusCode.BadRequest)
        }
        if(bookingDetails.userId != data.userId)
        {
            throw new AppError('The user corresponding to the user does not match',httpStatusCode.BadRequest)
        }
        const response = await bookingRepository.update(data.bookingId,{status:BOOKED},transaction)
        await transaction.commit()
        return response
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function getBookings() {
    const transaction = await db.sequelize.transaction()
    try {
        const bookings = await bookingRepository.getAll()
       
        return bookings
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction()
    try {
        const bookingDetails = await bookingRepository.getBooking(bookingId,transaction)
       
        if(bookingDetails.status==CANCELLED)
        {
            await transaction.commit()
            return true
        }
       
        await axios.patch(`http://localhost:3000/api/v1/flight/${bookingDetails.flightId}/seats`,{
            seats:bookingDetails.noOfSeats,
            dec:'0'
        })
        const response = await bookingRepository.update(bookingId,{status:CANCELLED},transaction)

        await transaction.commit()
        return response
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function cancelOldBookings() {
    try {
      const currentTime = new Date(Date.now() - 1000*300)  
      const response = await bookingRepository.cancelOldBookings(currentTime)
      return response
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    createBooking,
    makePayment,
    getBookings,
    cancelBooking,
    cancelOldBookings
}