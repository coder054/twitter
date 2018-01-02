$(function () {
  $(document).on('click', '.remove-icon', function (e) {
    // e.preventDefault();
    var tweetId = $(this).data('idtweet')
    $.ajax({
      type: 'DELETE',
      url: '/tweet/' + tweetId,
      success: function (data) {
        console.log('success',data)
      },
      error: function (data) {
        console.log(data)
      }
    })
  })
})