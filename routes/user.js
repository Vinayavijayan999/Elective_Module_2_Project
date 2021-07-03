exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var username = post.username;
      var password = post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var cls= post.class;
      var email= post.email_id;
      var mobile= post.mobile;
	  if(username !='' && password!='') {
		  var sql = "INSERT INTO `students`(`first_name`,`last_name`,`class`,`email_id`,`mobile`,`username`, `password`) VALUES ('" + fname + "','" + lname + "','" + cls + "','" + email + "','" + mobile + "','" + username + "','" + password + "')";

		  var query = db.query(sql, function(err, result) {
			 message = "Your account has been created succesfully.";
			 res.render('signup.ejs',{message: message});
		  });
	  } else {
		  message = "Username and password is mandatory field.";
		  res.render('signup.ejs',{message: message});
	  }

   } else {
      res.render('signup');
   }
};
 
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var username = post.username;
      var password= post.password;
     
      var sql="SELECT id, first_name, last_name, username FROM `students` WHERE `username`='"+username+"' and password = '"+password+"'";                           
      db.query(sql, function(err, results){       
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'You have entered invalid username or password.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};

           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `students` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {data:results});    
   });       
};

exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `students` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};

exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};