const { Booking } = require('../models')
const {CrudRepository} = require('./crud-repository')
const { Op } = require('sequelize')
const { ENUMS } = require('../utils/commons')
const { BOOKED,CANCELLED } = ENUMS.BOOKING_STATUS
class BookingRepository extends CrudRepository
{
    constructor()
    {
        super(Booking)
    }

    async createBooking(data,transaction)
    {
        const booking = await Booking.create(data,{transaction:transaction})
        return booking
    }

    async getBooking(bookingId,transaction)
    {
        const booking = await Booking.findByPk(bookingId,{transaction:transaction})
        return booking
    }
    async update(key,data,transaction)
    {
        console.log(this.model===Booking)
        try {
            const response = await Booking.findByPk(key)
           // console.log(response)
            if(response==null)
            {
                
                 throw new AppError(`Not able to find `,httpStatusCode.NotFound)
            }
            else
            {
                await Booking.update(
                    data,
                    {
                        where:{
                            id:key
                        }
                    },
                    {
                        transaction:transaction
                    }
                )
                return this.model.findByPk(key);
                // await User.update(
                //     { lastName: 'Doe' },
                //     {
                //       where: {
                //         lastName: null,
                //       },
                //     },
                //   );
            }
            logger.info(`model with ${key} not found`)
            throw {message:"not found"}
        } catch (error) {
            logger.error(`something went wrong in update function ${error}`)
            throw error
        }
    }
    async cancelOldBookings(timeStamp)
    {
        try {
            const response = await Booking.update(
                {
                    status:CANCELLED
                },
                {
                where:{
                    [Op.and]:[
                        {
                            createdAt:{
                                [Op.lt]:timeStamp
                            }
                        },
                        {
                            status:{
                                [Op.ne]:BOOKED
                            }
                        },
                        {
                            status:{
                                [Op.ne]:CANCELLED
                            }
                        }
                    ]
                }
            })
            
            return response
        } catch (error) {
           console.log(error) 
        }
    }
}

module.exports=BookingRepository