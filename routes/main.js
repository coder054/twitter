const router = require('express').Router();

const User = require('../models/user');
const Tweet = require('../models/tweet');



router.get('/', async (req, res, next) => {

  if (req.user) {
   // console.log('req.user', req.user)
    var listt = [req.user._id, ...req.user.following]
    try {
      let tweets = await Tweet.find({ owner: listt }).sort('-created').populate('owner').exec()
     // console.log(tweets)
      res.render('main/home', { tweets })
    } catch (error) {
      next(error)
    }

  } else {
    res.render('main/landing');
  }

});

router.get('/user/:id', async (req, res, next) => {
  try {
    let tweets = await Tweet.find({ owner: req.params.id }).sort('-created').populate('owner').exec()
    let user = await User.findById(req.params.id).populate('following').populate('followers').populate('tweet').exec()

    let pageOfHimself = false
    if (req.params.id == req.user._id) { // user access the profile page of himself
      pageOfHimself = true
    }


    let followerList = user.followers;

    let inFollowerList = followerList.some((follower) => {
      return follower._id.equals(req.user._id) // == not work xxxx
    })


    // console.log(tweets)
    // console.log('user', user)

    res.render('main/user', { foundUser: user, tweets, pageOfHimself, inFollowerList })
  } catch (error) {
    next(error)
  }
})

router.get('/tweet/:id', async (req, res, next) => {
  try {
    let tweet = await Tweet.findById(req.params.id).populate('owner').exec() // lam sao de populate owner

    let user = await


    //  console.log('tweet', tweet)
    res.render('main/tweet', { tweet })
  } catch (error) {
    next(error)
  }
})


router.post('/follow/:id', async (req, res, next) => {
  // id nay la cua thang can follow
  try {
    let dsfds = await User.update(
      {
        _id: req.params.id,
        followers: { $ne: req.user._id }
      },
      { $push: { followers: req.user._id } }
    )

    let fdsfds = await User.update(
      {
        _id: req.user._id,
        following: { $ne: req.params.id }
      },
      { $push: { following: req.params.id } }
    )

    res.json('success')
  } catch (error) {
    next(error)
  }
})


router.post('/unfollow/:id', async (req, res, next) => {
  // id nay la cua thang can follow
  try {
    let dsfds = await User.update(
      {
        _id: req.params.id,
      },
      { $pull: { followers: req.user._id } }
    )

    let fdsfds = await User.update(
      {
        _id: req.user._id,
      },
      { $pull: { following: req.params.id } }
    )

    res.json('success')
  } catch (error) {
    next(error)
  }
})

module.exports = router;