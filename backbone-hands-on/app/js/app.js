(function() {
  'use strict';
  window.App = {};

  $(function() {
    var calendarView, schedules;
    schedules = new App.Schedules();
    schedules.add([
      {
        title: '打ち合わせ1',
        datetime: moment('2015-04-01 13:00')
      }, {
        title: '打ち合わせ2',
        datetime: moment('2015-04-02 15:00')
      }, {
        title: '打ち合わせ3',
        datetime: moment('2015-04-02 13:00')
      }, {
        title: '打ち合わせ4',
        datetime: moment('2015-04-05 13:00')
      }, {
        title: '打ち合わせ5',
        datetime: moment('2015-04-10 14:00')
      }
    ]);
    App.formDialogView = new App.FormDialogView({
      el: '.dialog',
      collection: schedules
    });
    calendarView = new App.CalendarView({
      el: '.calendar',
      collection: schedules
    });
    $('.calendar-newBtn').click(function() {
      App.formDialogView.open();
    });
    $('.calendar-prevBtn').click(function() {
      calendarView.toPrev();
    });
    $('.calendar-nextBtn').click(function() {
      calendarView.toNext();
    });
    $('.calendar-todayBtn').click(function() {
      calendarView.toToday();
    });
  });

  App.Schedule = Backbone.Model.extend({
    defaults: {
      title: null,
      datetime: null
    },
    validate: function(attrs) {
      if (!attrs.title) {
        return 'タイトルは必須です';
      }
      if (!attrs.datetime) {
        return '日時は必須です';
      }
      if (!moment.isMoment(attrs.datetime) || !attrs.datetime.isValid()) {
        return '日時の形式が不正です';
      }
    },
    dateFormat: function(f) {
      return this.get('datetime').format(f);
    }
  });

  App.Schedules = Backbone.Collection.extend({
    model: App.Schedule,
    findByDate: function(date) {
      var format, targetDate;
      format = 'YYYY-MM-DD';
      targetDate = moment(date).format(format);
      return this.chain().select(function(model) {
        return model.dateFormat(format) === targetDate;
      }).sortBy(function(model) {
        return model.get('datetime');
      }).value();
    }
  });

  App.CalendarView = Backbone.View.extend({
    initialize: function() {
      this.current = moment();
      this.render();
      this.listenTo(this.collection, 'add change remove', this.render);
    },
    render: function() {
      var $caption, $tbody, $tr, cell, currentDay, endDay, i;
      $caption = this.$('caption');
      $tbody = this.$('tbody');
      currentDay = this.current.clone().startOf('month').startOf('week');
      endDay = this.current.clone().endOf('month');
      $tbody.empty();
      $caption.text(this.current.format('YYYY年MM月'));
      while (currentDay <= endDay) {
        $tr = $('<tr>').appendTo($tbody);
        i = 0;
        while (i < 7) {
          cell = new App.CalendarCellView({
            date: currentDay.clone(),
            collection: this.collection
          });
          $tr.append(cell.el);
          currentDay.add(1, 'day');
          i++;
        }
      }
    },
    toPrev: function() {
      this.current.subtract(1, 'month');
      this.render();
    },
    toNext: function() {
      this.current.add(1, 'month');
      this.render();
    },
    toToday: function() {
      this.current = moment();
      this.render();
    }
  });

  App.CalendarCellView = Backbone.View.extend({
    tagName: 'td',
    template: '<div class="calendar-date"><%= date.format("MM/DD") %></div>' + '<ul class="calendar-list"></ul>',
    initialize: function(options) {
      this.date = options.date;
      return this.render();
    },
    render: function() {
      var $list, html, schedules;
      html = _.template(this.template, {
        date: this.date
      });
      this.$el.html(html);
      schedules = this.collection.findByDate(this.date);
      $list = this.$('ul').empty();
      _.each(schedules, function(model) {
        var item;
        item = new App.CalendarItemView({
          model: model
        });
        $list.append(item.el);
      }, this);
    }
  });

  App.CalendarItemView = Backbone.View.extend({
    tagName: 'li',
    template: '<time><%= date %></time>' + '<span><%= title %></span>',
    events: {
      click: 'onClick'
    },
    initialize: function() {
      return this.render();
    },
    render: function() {
      var html;
      html = _.template(this.template, {
        date: this.model.dateFormat('HH:mm'),
        title: this.model.get('title')
      });
      return this.$el.html(html);
    },
    onClick: function() {
      App.formDialogView.open(this.model);
    }
  });

  App.FormDialogView = Backbone.View.extend({
    events: {
      'submit form': 'onSubmit',
      'click .dialog-close': 'close',
      'click .dialog-removeBtn': 'onRemove'
    },
    initialize: function() {
      this.listenTo(this.collection, 'change remove', this.close);
      this.listenTo(this.collection, 'invalid', this.onError);
    },
    render: function() {
      this.$('input[name="title"]').val(this.model.get('title'));
      this.$('input[name="datetime"]').val(this.model.dateFormat('YYYY-MM-DDTHH:mm'));
      this.$el.show();
    },
    open: function(model) {
      this.model = model;
      this.render();
    },
    close: function() {
      this.$el.hide();
    },
    onSubmit: function(e) {
      var datetime, title;
      e.preventDefault();
      title = this.$('input[name="title"]').val();
      datetime = this.$('input[name="datetime"]').val();
      this.model.set({
        title: title,
        datetime: moment(datetime)
      }, {
        validate: true
      });
    },
    onError: function(model, message) {
      aleat(message);
    },
    onRemove: function(e) {
      e.preventDefault();
      if (window.confirm('削除しますか？')) {
        this.model.destroy();
      }
    }
  });

}).call(this);
