const router = require('express').Router();
const { models: { Golfer, Course, TeeSheet } } = require('../db');

router.get('/golfers', async (req, res, next) => {
  try {
    res.send(await Golfer.findAll());
    
  } catch (error) {
    next(error)
  }
})

router.get('/courses', async (req, res, next) => {
  try {
    res.send(await Course.findAll());
    
  } catch (error) {
    next(error)
  }
})

router.get('/golfers/:id/teeSheets', async (req, res, next) => {
  try {
    res.send(await TeeSheet.findAll({
      where: {
        golferId: req.params.id
      },
      include : [ Course ]
    }));
    
  } catch (error) {
    next(error)
  }
})

router.post('/golfers/:id/teeSheets', async (req, res, next) => {
  try {
    let teeTime = await TeeSheet.create({...req.body, golferId: req.params.id});
    teeTime = await TeeSheet.findByPk(teeTime.id, {
      include: [Course]
    });

    res.send(teeTime);
    
  } catch (error) {
    next(error)
  }
})

router.delete('/golfers/:id/teeSheets', async (req, res, next) => {
  try {
    const teeTime = await TeeSheet.findByPk(req.params.id);
    await teeTime.destroy();

    // res.send(teeTime);
    
  } catch (error) {
    next(error)
  }
})

module.exports = router;