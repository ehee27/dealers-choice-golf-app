const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABSE_URL || 'postgres://localhost/golf-app');

const Golfer = conn.define('golfer', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING
  }
});
const Course = conn.define('course', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING
  }
});
const TeeSheet = conn.define('teesheet', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  tee: {
    type: STRING
  }
});

TeeSheet.belongsTo(Golfer);
TeeSheet.belongsTo(Course);

const syncAndSeed = async () => {
  try {
    await conn.sync({force: true})

    const [scott, steven, jason, jay] = await Promise.all(
      ['Scott', 'Steven', 'Jason', 'Jay'].map(name => Golfer.create({name}))
    );

    const [creekmoore, heritagePark, ironHorse, lakeQuivira, stoneCanyon, sycamoreRidge] = await Promise.all(
      ['Creekmoore', 'Heritage Park', 'Ironhorse', 'Lake Quivira', 'Stone Canyon', 'Sycamore Ridge'].map(name => Course.create({name}))
    );

    const teeTimes = await Promise.all([
      TeeSheet.create({golferId: scott.id, courseId: ironHorse.id, tee: '8:00am'}),
      TeeSheet.create({golferId: steven.id, courseId: lakeQuivira.id, tee: '9:00am'}),
      TeeSheet.create({golferId: jason.id, courseId: sycamoreRidge.id, tee: '10:00am'}),
      TeeSheet.create({golferId: jay.id, courseId: lakeQuivira.id, tee: '10:00am'})
    ])

    
  } catch (error) {
    console.log(error)
  }
};

module.exports = {
  models: {
    Golfer,
    Course,
    TeeSheet
  },
  conn,
  syncAndSeed
}