(function ($) {
    var replyButton = $('#reply-start'),
      newReplyBody = $('#post-body'),
      replyForm = $('#reply-submit'),
      postList = $('#post-list');
      replyList = $('#reply-list');
      postId = $('#post-id');
  
    function bindEventsToButtons(postItem) {
        postItem.find('.replyItem').on('click', function (event) {
          //change reply buttons into links
        event.preventDefault();
        var currentLink = $(this);
        var currentId = currentLink.data('id');
  
        var requestConfig = {
          method: 'POST',
          url: '/posts/reply/complete/' + currentId
        };
  
        $.ajax(requestConfig).then(function (responseMessage) {
          var newElement = $(responseMessage);
          bindEventsToButtons(newElement);
          todoItem.replaceWith(newElement);
        });
      });
    }

    if (replyButton) {
        postList.children().each(function (index, element) {
            bindEventsToButtons($(element));
        });
    }
    
  
    replyForm.submit(function (event) {
      event.preventDefault();

      var newReply = newReplyBody.val();
      var oldPost = postId.val();
  
      if (newReply) {
          var requestConfig = {
            method: 'POST',
            url: '/replies/update.html',
            contentType: 'application/json',
            data: JSON.stringify({
                id: oldPost,
                body: newReply
            })
          };
  
          $.ajax(requestConfig).then(function (responseMessage) {
            //console.log(responseMessage);
            var newElement = $(responseMessage);
            //bindEventsToTodoItem(newElement);
  
            replyList.append(newElement);
          });
      }
    });
  })(window.jQuery);