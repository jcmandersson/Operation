$(document).ready(function() {
  Handlebars.registerHelper('math', function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue
    }[operator];
  });

  $('#search-user').keyup(function() {
    var value = $(this).val();
    $.ajax({
      type: 'GET',
      url: '/api/search/User',
      data: {
        text: value,
        all: 'true'
      }
    }).done(function(msg) {
      var templateHTML = $('#user-template').html();
      var compiledTemplate = Handlebars.compile(templateHTML);
      var newHTML = compiledTemplate(msg);
      $('tr:not(tr:first-child)').remove();
      $(newHTML).insertAfter($('table tr'));
    }).fail(function(err, status) {
        console.log('Någonting gick fel!');
        console.log(err);
        console.log(status);
      });
  });

  
});
