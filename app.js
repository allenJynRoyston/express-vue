//------------------------------------
// EXPRESS/NPM PACKETS
var path = require('path'),
    request = require('request'),
    compression = require('compression'),
    express = require('express'),
    expressVue = require('express-vue'),  // this plugin is in active development - make sure to check up on it later
    app = express(),
    port = 3000;
    // include these to insure that they don't conflict in your vue components
    global.$ = function(){return{}};
    global.window = function(){return{}};
//------------------------------------

//------------------------------------
// ROUTES
var site = require('./routes/site'),
    router = express.Router();
//------------------------------------

//------------------------------------
// SETUP
app.engine('vue', expressVue);
app.set('view engine', 'vue');
app.set('views', path.join(__dirname, '/_render/views/'));
app.set('vue', {
    componentsDir: path.join(__dirname, '/_render/components/')
});
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/assets',  express.static(__dirname + '/assets'));
app.use(compression())
//------------------------------------

//------------------------------------
// MIDDLEWARE (happens on every request)
router.use(function(req, res, next) {

	//-------------------
  /* GET USER DEVICE INFORMATION */
  var ua = req.header('user-agent');
  req.device = {
		enviroment: req.headers.host == 'localhost:' + port ? "development" : "production",
		isMobile: /mobile/i.test(ua) ? true : false,
		isIphone: /iPhone/i.test(ua) ? true : false,
		isIpad: /iPad/i.test(ua) ? true : false,
		isAndroid: /Android/i.test(ua) ? true : false,
		userAgent: ua
	};
  //-------------------

  //------------------
  /* INCLUDE SCRIPTS/STYLES HERE */
  req.meta = {
      title: 'Vue/Express/Sematic Boilerplate',
      head: [
          // META TAGS
          { charset: 'UTF-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
          // SCRIPTS
          { script: req.device.enviroment == "development" ? '/node_modules/vue/dist/vue.js' : '/node_modules/vue/dist/vue.min.js'},
          { script: req.device.enviroment == "development" ? '/node_modules/jquery/dist/jquery.js' : '/node_modules/jquery/dist/jquery.min.js'},
          //{ script: req.device.enviroment == "development" ? '/assets/js/semantic.js' : '/assets/js/semantic.min.js'},
          // STYLES
          //{ style: req.device.enviroment == "development" ? '/assets/css/semantic.css' : '/assets/css/semantic.min.css' },
      ],
  }

  // DEV/PRODUCTION SPECIFIC INSTRUCTIONS
  if(req.device.enviroment == "development"){
    VUE_DEV=true;
  }
  else{
    VUE_DEV=false;
  }
  //------------------

	next();
})
//------------------------------------

//------------------------------------
// ROUTES
router.get('/users/:userName', site.user);
router.get('/', site.home);
app.use('/',  router);
//------------------------------------

//------------------------------------
// PORT
var port = process.env.PORT || port;
app.listen(port);
//------------------------------------
