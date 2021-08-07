const Sequelize = require ('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_country_club_db')
const { STRING, UUID, UUIDV4 } = Sequelize

const Member = conn.define('member', {
    id: {
        type: UUID,
        defaultValue: UUIDV4
    },
    firstName: {
        type: STRING(25)
    }
})

const Facility = conn.define('facility', {
    id: {
        type: UUID,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(25)
    }
})

const syncAndSeed = async () => {
    await conn.sync({ force: true })
    const [moe, lucy, larry, ethyl, tennis, ping-pong, raquet-ball, bowling] = await Promise.all([
        Member.create({firstName: 'moe'}),
        Member.create({firstName: 'lucy'}),
        Member.create({firstName: 'larry'}),
        Member.create({firstName: 'ethyl'}),
        Facility.create({firstName: 'tennis'}),
        Facility.create({firstName: 'ping-pong'}),
        Facility.create({firstName: 'raquet-ball'}),
        Facility.create({firstName: 'bowling'}),
    ])
}

module.exports = {
    conn,
    syncAndSeed,
    models: {
        Member,
        Facility
    }
}