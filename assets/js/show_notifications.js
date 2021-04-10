$( document ).ready(function() {
   //$('#ajax_pre_loading').hide();
  
  // SUBMIT FORM

    $("#show_notifications").click(function(event) {
    // Prevent the form from submitting via the browser.
   
    event.preventDefault();
    ajaxPost();
  });
    
    
    function ajaxPost(){
      
      // PREPARE FORM DATA
      // var formData = {
      //   link : $("#link").val()
       
      // }
      
      // DO POST
      $.ajax({
  method: 'POST',
  contentType : "application/json",
  url:'/show_notifications',
  //data :JSON.stringify(formData),
  dataType : 'json',
  //beforeSend: function() { $('#ajax_pre_loading').show(); },
  success: function(res) {
           // $('#ajax_pre_loading').hide();
           // $('#my_table').hide();

    var notifications = res.data;
    var body = [];
if(notifications.length>0)
{
notifications.forEach(function(notification) {
      var tr = $('<tr/>');
      tr.append($('<td/>').html(notification.name));
     // tr.append($('<td/>').html( assignment.name ));
      // tr.append($('<td/>').html( assignment.name));
       //  tr.append($('<td/>').html('<a href="blah-blah">' + assignment.name + '</a>'));
    
      body.push(tr);
    });
 $('#all_notifications').html(body);
}
 else
 {
   $('#all_notifications').html("no notification");
 }   

   
  }
})
      
      // Reset FormData after Posting
    
 
    }
    
})