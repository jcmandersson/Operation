var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'editUser';
  
  console.log(req.body);

  locals.scripts = [
    'editUser.js'
  ];

  locals.css = [
    'editUser.css'
  ];
  
  view.on('init', function(next){
    if(typeof req.params._id !== 'undefined'){
      locals.editing = true;

      User.model.findById(req.params._id, function(err, user){
        if(err){
          req.flash('error', 'Kunde inte hitta användaren');
          return next();
        }
        
        locals.editUser = user;
        
        return next();
      });
      
      return;
    }
    return next();
  });
  
  
  view.on('post', {action: 'edit'}, function(next){
    var data = req.body;
    User.model.findById(req.params._id, function(err, user){
      if(err){
        req.flash('error', 'Kunde inte hitta användaren');
        return next();
      }

      user.name = {
        first: typeof data.firstname !== 'undefined' ? data.firstname : user.name.first,
        last: typeof data.lastname !== 'undefined' ? data.lastname : user.name.last
      };
      user.email = typeof data.email !== 'undefined' ? data.email : user.email;
      user.isAdmin = typeof data.isAdmin !== 'undefined' ? data.isAdmin : false;
      
      if(data.password.length > 0 && data.password !== data.confirm){
        req.flash('error', 'Lösenorden matchar inte');
        return next();
      }else if(data.password.length > 0){
        user.password = data.password;
      }
      
      user.save(function(err, data){
        if(err) {
          req.flash('error', 'Kunde inte spara ändringarna');
          return next();
        }
        req.flash('success', 'Användaren är sparad!');
        locals.editUser = data;
        return next();
      });
    });
  });

  view.on('post', {action: 'register'}, function(next){
    var data = req.body;
    locals.editUser = data;
    
    if(data.lastname === 'undefined') data.lastname = '';
    
    if(typeof data.firstname === 'undefined') req.flash('error', 'Du måste skriva in ett namn!');
    else if(typeof data.email === 'undefined') req.flash('error', 'Du måste skriva in en epost!');
    else if(typeof data.password === 'undefined' || typeof data.confirm === 'undefined') req.flash('error', 'Du måste skriva in ett lösenord!');
    else if(data.password !== data.confirm) req.flash('error', 'Lösenorden matchar inte');
    else {
      User.model.find({
        email: data.email
      }, function(err, docs){
        if(docs.length > 0){
          req.flash('error', 'E-posten finns redan.');
          return next();
        }
        
        User.model.createUser(data.firstname, data.lastname, data.email, data.password, data.isAdmin, function(err, data){
          if(err){
            req.flash('error', 'Kunde inte skapa användaren!');
            return;
          }
          req.flash('success', 'Användaren har skapats!');
          next();
        });
      });
      return;
    }
    return next();
  });
  
  // Render the view
  view.render('editUser');
};
