App.Controller.Todo = App.Controller.extend(
  initialize: ->
    @todos = new App.Collection.Todos()

    @todoList = new App.View.Todos(
      el: '#todo-list',
      collection: @todos
    )

    @form = new App.View.Form(
      el: '#new-todo-form',
      collection: @todos
    )

    # @todos.add('test1')
    # @todos.add('test2')
)
