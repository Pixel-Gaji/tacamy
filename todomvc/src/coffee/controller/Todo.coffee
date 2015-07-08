App.Controller.Todo = App.Controller.extend(
  initialize: ->
    @todos = new App.Collection.Todos()
    @todoList = new App.View.Todos(
      el: '#todo-list'
    )

    @todoList.add('test1')
    @todoList.add('test2')
)
