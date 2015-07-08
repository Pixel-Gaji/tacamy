App.View.Todo = App.View.extend(
  tagName: 'li'

  html: '''
  <div class="view">
    <input class="toggle" type="checkbox">
    <label><%= text %></label>
    <button class="destroy"></button>
  </div>
  <input class="edit" value="<%= text %>">
  '''

  initialize: (options) ->
    @$el.text(options.text)

  render: (options) ->
    console.log(@html)
    console.log(options.text)
    html = _.template(@html, options)

    @$el.append(html)

)
