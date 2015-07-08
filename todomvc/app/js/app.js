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
        text: null
      };
    }
  });

  App.Collection.Todos = App.Collection.extend({
    model: App.Model.Todo
  });

  App.View.Form = App.View.extend({
    initialize: function() {
      return this.$input = this.$('#new-todo');
    },
    events: {
      'submit': '_onSubmit'
    },
    _onSubmit: function(ev) {
      ev.preventDefault();
      this.collection.add({
        text: this.$input.val()
      });
      return this._clearInput();
    },
    _clearInput: function() {
      return this.$input.val('');
    }
  });

  App.View.Todo = App.View.extend({
    tagName: 'li',
    template: _.template('<div class="view">\n  <input class="toggle" type="checkbox">\n  <label><%- text %></label>\n  <button class="destroy"></button>\n</div>\n<input class="edit" value="<%- text %>">'),
    initialize: function() {
      return this.render();
    },
    render: function() {
      var html;
      console.log(this.model.get('text'));
      html = this.template({
        text: this.model.get('text')
      });
      return this.$el.append(html);
    }
  });

  App.View.Todos = App.View.extend({
    initialize: function() {
      return this.listenTo(this.collection, 'add', this._onAdd);
    },
    _onAdd: function(model) {
      var todo;
      todo = new App.View.Todo({
        model: model
      });
      return this.$el.prepend(todo.el);
    }
  });

  App.Controller.Todo = App.Controller.extend({
    initialize: function() {
      this.todos = new App.Collection.Todos();
      this.todoList = new App.View.Todos({
        el: '#todo-list',
        collection: this.todos
      });
      return this.form = new App.View.Form({
        el: '#new-todo-form',
        collection: this.todos
      });
    }
  });

  $(function() {
    var controller;
    controller = new App.Controller.Todo({
      el: document
    });
  });

}).call(this);
