//------------------------------------
// EXPRESS/NPM PACKETS
var path = require('path'),
    fs = require('fs'),
    favicon = require('serve-favicon'),
    request = require('request'),
    compression = require('compression'),
    express = require('express'),
    expressVue = require('express-vue'),  // this plugin is in active development - make sure to check up on it later
    app = express(),
    port = 3000,
    router = express.Router();

    // include these to insure that they don't conflict in your vue components
    global.$ = function(){return{}};
    global.window = function(){return{}};
    global.scene = function(){return{}};
    global.EventEmitter = function(){return{}};

var vueComponents = [],
    pageComponents = [],
    componentsFolder = './pug/components';
    viewFolder = './pug/views';
    pagesFolder = './pug/pages'
//------------------------------------

//------------------------------------
// SETUP
app.use(compression())
app.use(favicon(path.join(__dirname, '/', 'favicon.ico')))
app.engine('vue', expressVue);
app.set('view cache', true);
app.set('view engine', 'vue');
app.set('views', path.join(__dirname, '/dist/views/'));
app.set('vue', {
    componentsDir: path.join(__dirname, '/dist/components/'),
    defaultLayout: 'index'
});

var oneDay = 86400000;
app.use('/node_modules',  express.static(__dirname + '/node_modules', { maxAge : oneDay*1 }) );
app.use('/dist',  express.static(__dirname + '/dist', { maxAge : oneDay*1 }) );
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
  req.meta = {
      title: 'Vue/Express/Sematic Boilerplate',
      meta: [],
      structuredData: {
          "@context": "http://schema.org",
          "@type": "Person",
          "givenName": "<first_name>",
          "familyName": "<last_name>",
          "url": "http://www.url.com",
          "email": "<email>",
          "jobTitle": "<jobTitle>",
      }
  }
  //-------------------

  //------------------
  /* INCLUDE SCRIPTS/STYLES HERE */
  // META TAGS
  var sharedMeta = [
    { charset: 'UTF-8' },
    { name: 'title', content: 'Title'},
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
    { name: 'keywords', content: 'Keywords'},
    { name: 'description', content: 'Description'},
    { name: 'og:type', content: 'article'},
    { name: 'og:url', content: 'www.url.com'},
    { name: 'og:title', content: 'Title'},
    { name: 'og:image', content: '/assets/media/images/image.jpg'}
  ]
  for(var i = 0; i < sharedMeta.length; i++){
    req.meta.meta.push(sharedMeta[i])
  }

  // SHARED FILES
  var shared_files = [
    { script: req.device.enviroment == "development" ? '/dist/assets/js/unminified/all.js' : '/dist/assets/js/minified/all.js'},
    { style: req.device.enviroment == "development" ? '/dist/assets/css/unminified/all.css' : '/dist/assets/css/minified/all.css' },
    { style: 'https://fonts.googleapis.com/css?family=Amatic+SC|Ubuntu+Condensed' }
  ]
  for(var i = 0; i < shared_files.length; i++){
    req.meta.meta.push(shared_files[i])
  }
  
  //  DESKTOP SPECIFIC FILES
  var desktop_files = [
    { style: '/dist/assets/js/custom/semantic/semantic.min.js' },
    { style: '/dist/assets/css/custom/semantic/semantic.min.css' },
  ]
  if(!req.device.isMobile){
    for(var i = 0; i < desktop_files.length; i++){
      req.meta.meta.push(desktop_files[i])
    }
  }

  //  MOBILE SPECIFIC FILES
  var mobile_files = [
    { style: '/dist/assets/js/custom/framework7/framework7.min.js' },
    { style: '/dist/assets/css/custom/framework7/framework7.ios.css' },
    { style: '/dist/assets/css/custom/framework7/framework7.ios.colors.css' },
  ]
  if(req.device.isMobile){
    for(var i = 0; i < mobile_files.length; i++){
      req.meta.meta.push(mobile_files[i])
    }
  }

  // DEV/PRODUCTION SPECIFIC INSTRUCTIONS
  if(req.device.enviroment == "development"){
    VUE_DEV=true;
  }
  else{
    VUE_DEV=false;
  }
  //------------------

  //------------------
  // automatically grab all components
  vueComponents = [],
  pageComponents = [];

  fs.readdir(componentsFolder, (err, files) => {
    files.forEach(file => {
      vueComponents.push(file.replace(/\.[^/.]+$/, ""))
    });

    fs.readdir(pagesFolder, (err, files) => {
      files.forEach(file => {
        pageComponents.push({name: file.replace(/\.[^/.]+$/, "")})
        vueComponents.push(file.replace(/\.[^/.]+$/, ""))
      });
      next();
    })
  })
  //------------------

})
//------------------------------------



//------------------------------------
// ROUTES
router.get('/users/:userName', function(req, res){
	res.render('rootuser', {
    data: {
      user: {
        pages: pageComponents,
        device: req.device,
        name: req.params.userName
      }
    },
    vue: {
				head: req.meta,
        /* include component names manually
        /* they must match the names of the components in dist/components
        components: [
					'home', 'about', 'images'
				]
        */
        /* include all components automatically */
        components: vueComponents
    }
  });
});

router.get('/', function(req, res){
	res.render('rootdefault', {
    data: {
      pages: pageComponents,
			device: req.device
    },
    vue: {
				head: req.meta,
				/* include component names manually
        components: [
					'home', 'about', 'images'
				]
        */
        /* include all components automatically */
        components: vueComponents
    }
  });
});

app.use('/',  router);
//------------------------------------



//------------------------------------
// PORT
var port = process.env.PORT || port;
app.listen(port);
//------------------------------------
