(function() {
  'use strict';
  var App;

  App = window.App || {};

  App.View = {};

  App.Model = {};

  App.Collection = {};

  App.Controller = {};

  App.View = Backbone.View.extend();

  App.Model = Backbone.Model.extend();

  App.Collection = Backbone.Collection.extend();

  App.Controller = App.View.extend();

  App.Model.Todo = App.Model.extend({
    defaults: function() {
      return {
        text: null,
        completed: false
      };
    },
    isCompleted: function() {
      return this.get('completed');
    }
  });

  App.Collection.Todos = App.Collection.extend({
    model: App.Model.Todo
  });

  App.View.Textbox = App.View.extend();

  App.View.Todo = App.View.extend({
    tagName: 'li',
    html: '<div class="view">\n  <input class="toggle" type="checkbox">\n  <label><%= text %></label>\n  <button class="destroy"></button>\n</div>\n<input class="edit" value="<%= text %>">',
    initialize: function(options) {
      return this.$el.text(options.text);
    },
    render: function(options) {
      var html;
      console.log(this.html);
      console.log(options.text);
      html = _.template(this.html, options);
      return this.$el.append(html);
    }
  });

  App.View.Todos = App.View.extend({
    el: '#new-todo',
    add: function(text) {
      var todo;
      todo = new App.View.Todo({
        text: text
      });
      todo.render({
        text: 'test'
      });
      return this.$el.append(todo);
    }
  });

  App.Controller.Todo = App.Controller.extend({
    initialize: function() {
      this.todos = new App.Collection.Todos();
      this.todoList = new App.View.Todos({
        el: '#todo-list'
      });
      this.todoList.add('test1');
      return this.todoList.add('test2');
    }
  });

  $(function() {
    var controller;
    controller = new App.Controller.Todo({
      el: document
    });
  });

}).call(this);
