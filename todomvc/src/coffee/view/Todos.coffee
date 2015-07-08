App.View.Todos = App.View.extend(
  initialize: ->
    @listenTo(@collection, 'add', @_onAdd)

  _onAdd: (model) ->
    todo = new App.View.Todo(
      model: model
    )

    @$el.prepend(todo.el)
)
