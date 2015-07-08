App.View.Todo = App.View.extend(
  tagName: 'li'

  template: _.template '''
  <div class="view">
    <input class="toggle" type="checkbox">
    <label><%- text %></label>
    <button class="destroy"></button>
  </div>
  <input class="edit" value="<%- text %>">
  '''

  initialize: ->
    @render()

  render: ->
    console.log(@model.get('text'))
    html = @template({text: @model.get('text')})

    @$el.append(html)
)
