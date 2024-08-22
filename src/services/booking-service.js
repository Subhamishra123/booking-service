const axios = require('axios')
const {BookingRepository} = require('../repositories')
const db = require('../models')
const { httpStatusCode } = require('httpstatuscode')
const { ServerConfig } = require('../config')
const AppError = require('../utils/errors/AppError')

async function createBooking(data) {
   
    return new Promise((resolve,reject)=>{
        db.sequelize.transaction(async function bookingImpl(t){
            const flight = await axios.get(`${ServerConfig.FLIGHTURL}${data.flightId}`)
            if(data.noOfSeats>flight.data.data.totalSeats)
            {
                reject(new AppError('Not enough available seats',httpStatusCode.BadRequest))
            }
            resolve(true)
        })
    })
    
}

module.exports={
    createBooking
}