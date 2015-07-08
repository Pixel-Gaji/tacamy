App.Model.Todo = App.Model.extend(
  defaults: ->
    text: null
    completed: false

  isCompleted: ->
    this.get('completed')
)
