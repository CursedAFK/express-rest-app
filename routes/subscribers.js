const express = require('express')
const Subscriber = require('../models/subscriber')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
    res.json(
      subscribers.length > 0 ? subscribers : { message: 'No subscribers' }
    )
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', getSubscriber, (req, res) => {
  res.json(res.subscriber)
})

router.post('/', async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribeToChannel: req.body.subscribeToChannel
  })
  try {
    const newSubscriber = await subscriber.save()
    res.status(201).json(newSubscriber)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/:id', getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name
  }
  if (req.body.subscribeToChannel != null) {
    res.subscriber.subscribeToChannel = req.body.subscribeToChannel
  }
  try {
    const updatedSubscriber = await res.subscriber.save()
    res.json(updatedSubscriber)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await res.subscriber.deleteOne()
    res.json({ message: 'Deleted subscriber' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

async function getSubscriber(req, res, next) {
  let subscriber
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
  res.subscriber = subscriber
  next()
}

module.exports = router
