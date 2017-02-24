
<template>
  <div>
    <h1>{{title}}</h1>
    <p>Welcome to pug demo! {{title}} demo. Click a link:</p>
    <input v-model="message" placeholder="edit me"/>
    <message :message="message"></message>
    <users :users="users"></users>
    <greetings :message="greetingMessage"></greetings>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        title: "Vue Component",
        message: "Greetings!",
        greetingMessage: "I am THE MESSAGE!",
        users: [
          {name: "John", age: 32},
          {name: "Smith", age: 23}
        ]
      }
    }
  }
</script>

<style lang="css">/* PENDING VUE-EXPRESS UPDATE */</style>