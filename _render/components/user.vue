<template><div><h3>Declared within:</h3><ul><li v-for="i in list">  {{ i.message }}</li></ul><h3>Declared from parent:</h3><ul><li v-for="i in outside"><a v-bind:href="'/users/' + i.name">{{ i.name }}</a></li></ul></div></template><script>export default {
    props: ['outside'],
    data:function(){
      return{
        list:[
          {message: "One"},
          {message: "Two"},
          {message: "Three"}
        ]
      }
    }
}</script><style lang="css">/* PENDING VUE-EXPRESS UPDATE */</style>