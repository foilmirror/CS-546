(function ($) {
    var replyButton = $('#reply-start'),
      newReplyBody = $('#post-body'),
      submitButton = $('#reply-submit'),
      postList = $('#post-list');
  
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
  
    postList.children().each(function (index, element) {
        bindEventsToButtons($(element));
    });
  
    myNewTaskForm.submit(function (event) {
      event.preventDefault();
  
      var newReply = newReplyBody.val();
  
      if (newReply) {
          var requestConfig = {
            method: 'POST',
            url: '/posts/todo.html',
            contentType: 'application/json',
            data: JSON.stringify({
              name: newName,
              description: newDescription
            })
          };
  
          $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            var newElement = $(responseMessage);
            bindEventsToTodoItem(newElement);
  
            todoArea.append(newElement);
          });
      }
    });
  })(window.jQuery);