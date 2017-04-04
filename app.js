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
  //-------------------

  //------------------
  /* INCLUDE SCRIPTS/STYLES HERE */
  req.meta = {
      title: 'Vue/Express/Sematic Boilerplate',
      meta: [
          // META TAGS
          { charset: 'UTF-8' },
          { name: 'title', content: 'Title'},
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
          { name: 'keywords', content: 'Keywords'},
          { name: 'description', content: 'Description'},
          { name: 'og:type', content: 'article'},
          { name: 'og:url', content: 'www.url.com'},
          { name: 'og:title', content: 'Title'},
          { name: 'og:image', content: '/assets/media/images/image.jpg'},

          // SCRIPTS
          { script: req.device.enviroment == "development" ? '/node_modules/vue/dist/vue.js' : '/node_modules/vue/dist/vue.min.js'},
          { script: req.device.enviroment == "development" ? '/node_modules/jquery/dist/jquery.js' : '/node_modules/jquery/dist/jquery.min.js'},
          { script: req.device.enviroment == "development" ? '/dist/assets/js/semantic.js' : '/dist/assets/js/semantic.min.js'},
          { script:'/dist/assets/js/eventEmitter.js'},

          // STYLES
          { style: req.device.enviroment == "development" ? '/dist/assets/css/semantic/semantic.css' : '/dist/assets/css/semantic/semantic.min.css' },
      ],
      structuredData: {
          "@context": "http://schema.org",
          "@type": "Person",
          "givenName": "<first_name>",
          "familyName": "<last_name>",
          //"url": "https://allen-royston-2017.herokuapp.com/",
          "email": "<email>",
          "jobTitle": "<jobTitle>",
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
