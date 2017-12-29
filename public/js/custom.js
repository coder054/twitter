$(function () {
  var socket = io()

  $('#sendTweet').submit(function () {
    var content = $('#tweet').val()
    socket.emit('tweet', { content: content })
    $('#tweet').val('')
    return false;
  })

  socket.on('incomingTweet', function (data) {
    console.log(data)
    var html = ''
    html += '<div class="media">'
    html += '<div class="media-left">'
    html += '<a href="/user/' + data.user._id + '">'
    html += '<img class="media-object" src=" ' + data.user.photo + ' " />'
    html += '</a>'
    html += '</div>'
    html += '<div class="media-body">'
    html += '<h4 class="media-heading">' + data.user.name + '</h4>'
    html += '<p>' + data.data.content + '</p>'
    html += '</div>'
    html += '</div>'
    $('#tweets').prepend(html)

  })
})












