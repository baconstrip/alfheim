var template = "<h1>{{message}}</h1>"
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  template: template,
})