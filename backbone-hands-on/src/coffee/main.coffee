'use strict'

window.App = {}

$ ->
  schedules = new App.Schedules()

  schedules.add [
    title: '打ち合わせ1'
    datetime: moment('2015-04-01 13:00')
  ,
    title: '打ち合わせ2'
    datetime: moment('2015-04-02 15:00')
  ,
    title: '打ち合わせ3'
    datetime: moment('2015-04-02 13:00')
  ,
    title: '打ち合わせ4'
    datetime: moment('2015-04-05 13:00')
  ,
    title: '打ち合わせ5'
    datetime: moment('2015-04-10 14:00')
  ]

  App.formDialogView = new App.FormDialogView
    el: '.dialog'
    collection: schedules

  calendarView = new App.CalendarView
    el: '.calendar'
    collection: schedules

  $('.calendar-newBtn').click ->
    App.formDialogView.open()
    return

  $('.calendar-prevBtn').click ->
    calendarView.toPrev()
    return

  $('.calendar-nextBtn').click ->
    calendarView.toNext()
    return

  $('.calendar-todayBtn').click ->
    calendarView.toToday()
    return
  return
