App.CalendarView = Backbone.View.extend
  initialize: ->
    @current = moment()
    @render()

    @listenTo(this.collection, 'add change remove', this.render)
    return

  render: ->
    $caption = @$('caption')
    $tbody = @$('tbody')
    currentDay = @current.clone().startOf('month').startOf('week')
    endDay = @current.clone().endOf('month')

    $tbody.empty()
    $caption.text(@current.format('YYYY年MM月'))

    while currentDay <= endDay
      $tr = $('<tr>').appendTo($tbody)

      i = 0
      while i < 7
        cell = new App.CalendarCellView
          date: currentDay.clone()
          collection: @collection
        $tr.append(cell.el)
        currentDay.add(1, 'day')
        i++
    return

  toPrev: ->
    @current.subtract(1, 'month')
    @render()
    return

  toNext: ->
    @current.add(1, 'month')
    @render()
    return

  toToday: ->
    @current = moment()
    @render()
    return

App.CalendarCellView = Backbone.View.extend
  tagName: 'td'

  template:
    '<div class="calendar-date"><%= date.format("MM/DD") %></div>' +
    '<ul class="calendar-list"></ul>'

  initialize: (options) ->
    @date = options.date
    @render()

  render: ->
    html = _.template(@template, date: @date)
    @$el.html(html)

    schedules = @collection.findByDate(@date)

    $list = @$('ul').empty()

    _.each(schedules, (model) ->
      item = new App.CalendarItemView model: model
      $list.append(item.el)
      return
    , @)
    return

App.CalendarItemView = Backbone.View.extend
  tagName: 'li'

  template:
    '<time><%= date %></time>' +
    '<span><%= title %></span>'

  events:
    click: 'onClick'

  initialize: ->
    @render()

  render: ->
    html = _.template @template,
      date: @model.dateFormat('HH:mm')
      title: @model.get('title')

    @$el.html(html)

  onClick: ->
    App.formDialogView.open(@model)
    return

App.FormDialogView = Backbone.View.extend
  events:
    'submit form': 'onSubmit'
    'click .dialog-close': 'close'
    'click .dialog-removeBtn': 'onRemove'

  initialize: ->
    @listenTo(@collection, 'change remove', this.close)
    @listenTo(@collection, 'invalid', @onError)
    return

  render: ->
    @$('input[name="title"]').val(@model.get('title'))
    @$('input[name="datetime"]').val(@model.dateFormat('YYYY-MM-DDTHH:mm'))
    @$el.show()
    return

  open: (model) ->
    @model = model
    @render()
    return

  close: ->
    @$el.hide()
    return

  onSubmit: (e) ->
    e.preventDefault()

    title = @$('input[name="title"]').val()
    datetime = @$('input[name="datetime"]').val()

    @model.set
      title: title
      datetime: moment(datetime)
    ,
      validate: true
    return

  onError: (model, message) ->
    aleat(message)
    return

  onRemove: (e) ->
    e.preventDefault()

    if window.confirm('削除しますか？')
      @model.destroy()
    return
