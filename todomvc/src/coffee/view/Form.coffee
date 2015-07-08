App.View.Form = App.View.extend(
  initialize: ->
    @$input = @$('#new-todo');

  events:
    'submit': '_onSubmit'

  _onSubmit: (ev) ->
    ev.preventDefault()

    @collection.add(
      text: @$input.val()
    )

    @_clearInput()

  _clearInput: ->
    @$input.val('')
)
