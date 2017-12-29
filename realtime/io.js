const async = require('async')
const Tweet = require('../models/tweet');
const User = require('../models/user');

const { promisify } = require('util')


module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('connected')
    var user = socket.request.user
    if (user) {
      console.log(user.name) // third
    }
    socket.on('tweet', async function (data) {
      console.log(data)
      // emit 
      // save tweet content (with owner info) to to tweet collection
      // push tweet Id to field: tweets of user collection
      io.emit('incomingTweet', ({ data, user }))
      try {
        const tweet = new Tweet({
          owner: user._id,
          content: data.content
        });

        let newTweet = await tweet.save()

        let updatedUser = await User.update(
          { _id: user._id },
          {
            $push: {
              tweets: { tweet: newTweet._id }
            }
          }
        )


        // ${1:Model}.update({_id: ${2}}, ${3})
        // vi du Tweet.update
        //User.findByIdAndUpdate(req.body.id, {name: 'new name'})
        //User.findByIdAndUpdate(req.body.id, {name: 'Huyen'})
        //User.findByIdAndUpdate(req.body.id, req.body)


        //joe.set('name', 'Alex');
        //joe.save()

        // ham update tra ve number oj record modified, 
        // ham findByIdAndUpdate tra ve record (truoc khi changed)


      } catch (error) {
        console.log(error)
      }



    })
  })
}