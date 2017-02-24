//---------------------------------------------- default
exports.home = function(req, res){
	res.render('home', {
    data: {
			device: req.device
    },
    vue: {
				meta: req.meta,
				// include component names
        components: [
					'home', 'about', 'images'
				]
    }
  });
};
//----------------------------------------------

//---------------------------------------------- default
exports.user = function(req, res){
	res.render('user', {
    data: {
      user: { name: req.params.userName }
    },
		vue: {
				meta: req.meta,
				// include component names
        components: [

				]
    }
  });
};
//----------------------------------------------
