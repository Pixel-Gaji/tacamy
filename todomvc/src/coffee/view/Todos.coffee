App.View.Todos = App.View.extend(
  el: '#new-todo'

  add: (text) ->
    todo = new App.View.Todo(
      text: text
    )

    todo.render({text: 'test'})
    @$el.append(todo)
)
