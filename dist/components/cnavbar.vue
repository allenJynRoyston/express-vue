<template><div><ul><li v-for="i in server_pages"><a v-on:click="changeUrl(i.name)">{{ i.name }}</a></li></ul></div></template><script>export default {
  data: function() {
    return {
      hash: null,
      server_pages: {},
    }
  },
  created:function(){
    var t = this;
    $(function(){

      // FROM SERVER
      t.server_pages = JSON.parse($('#___vuepages').text())

      // WATCH FOR PARAMETER CHANGES
      ee.addListener('urlchanged', function(res){
        t.hash = res.hash;
      });
    })

  },
  methods:{
    changeUrl: function(path){
      window.scrollTo(0, 0);
      this.hash = path;
      ee.emitEvent('changeUrl', [{url: path}]);
    },
  },
  beforeDestroy:function(){
    // remove all listeners here
    ee.removeEvent('urlchanged')
  }
}</script><style lang="css">/* PENDING VUE-EXPRESS UPDATE */</style>