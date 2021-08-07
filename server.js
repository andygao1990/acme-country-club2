const { conn, syncAndSeed, models: { Member, Facility, Booking } } = require ('./db')
const express = require ('express')
const app = express()

app.get('/api/members', async (req, res, next) => {
    try {
        res.send(await Member.findAll({
            include: [
                {
                    model: Member,
                    as: 'sponsor'
                },
                {
                    model: Member,
                    as: 'sponsored'
                }
            ],
        }))
    }
    catch (err) {
        next(err)
    }
})

app.get('/api/facilities', async (req, res, next) => {
    try {
        res.send(await Facility.findAll({
            include: [
                {
                    model: Booking,
                    as: 'bookings'
                }
            ]
        }))
    }
    catch (err) {
        next(err)
    }
})

app.get('/api/bookings', async (req, res, next) => {
    try {
        res.send(await Booking.findAll({
            include: [
                {
                    model: Member,
                    as: 'bookedBy'
                },
                {
                    model: Facility,
                    as: 'facility'
                }
            ]
        }))
    }
    catch (err) {
        next(err)
    }
})

const init = async () => {
    try {
        await conn.authenticate()
        await syncAndSeed()
        const port = process.env.PORT || 3000
        app.listen(port, () => console.log(`listening on port ${port}`))
    }
    catch (err) {
        console.log(err)
    }
}

init()