App.Schedule = Backbone.Model.extend
  defaults:
    title: null
    datetime: null

  validate: (attrs) ->
    if !attrs.title
      return 'タイトルは必須です'
    if !attrs.datetime
      return '日時は必須です'
    if !moment.isMoment(attrs.datetime) or !attrs.datetime.isValid()
      return '日時の形式が不正です'

  dateFormat: (f) ->
    @get('datetime').format(f)

App.Schedules = Backbone.Collection.extend
  model: App.Schedule

  findByDate: (date) ->
    format = 'YYYY-MM-DD'
    targetDate = moment(date).format(format)

    @chain()
      .select (model) ->
        model.dateFormat(format) == targetDate
      .sortBy (model) ->
        model.get('datetime')
      .value()
