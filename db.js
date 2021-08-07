const Sequelize = require ('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_country_club_db')
const { STRING, DATE, UUID, UUIDV4 } = Sequelize

const Member = conn.define('member', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    firstName: {
        type: STRING(20)
    }
})

const Facility = conn.define('facility', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    facName: {
        type: STRING(100)
    }
})

const Booking = conn.define('booking', {
    startTime: {
        type: DATE,
        allowNull: false,
        defaultValue: function () {
            return new Date()
        }
    },
    endTime: {
        type: DATE,
        allowNull: false,
        defaultValue: function () {
            return new Date(new Date().getTime() + 1000*60*60*2) 
        }
    }
})

Member.belongsTo(Member, { as: 'sponsor' })
Member.hasMany(Member, { as: 'sponsored', foreignKey: 'sponsorId' })

Booking.belongsTo(Member, { as: 'bookedBy' })
Booking.belongsTo(Facility, { as: 'facility' })
Facility.hasMany(Booking, { as: 'bookings' })

const syncAndSeed = async () => {
    await conn.sync({ force: true })
    const [moe, lucy, larry, ethyl, tennis, pingPong, raquetBall, bowling] = await Promise.all([
        Member.create({firstName: 'moe'}),
        Member.create({firstName: 'lucy'}),
        Member.create({firstName: 'larry'}),
        Member.create({firstName: 'ethyl'}),
        Facility.create({facName: 'tennis'}),
        Facility.create({facName: 'ping-pong'}),
        Facility.create({facName: 'raquet-ball'}),
        Facility.create({facName: 'bowling'}),
    ])
    
    moe.sponsorId = lucy.id
    larry.sponsorId = lucy.id
    ethyl.sponsorId = moe.id
    await Promise.all([
        moe.save(),
        larry.save(),
        ethyl.save()
    ])
    await Promise.all([
        Booking.create({bookedById: lucy.id, facilityId: tennis.id}),
        Booking.create({bookedById: moe.id, facilityId: tennis.id}),
        Booking.create({bookedById: ethyl.id, facilityId: bowling.id}),
        Booking.create({bookedById: lucy.id, facilityId: pingPong.id}),
    ])
}

module.exports = {
    conn,
    syncAndSeed,
    models: {
        Member,
        Facility,
        Booking
    }
}