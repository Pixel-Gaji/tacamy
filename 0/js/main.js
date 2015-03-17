(function ($, window, document, undefined) {
'use strict';

var App = window.ElectricalSystem = {};

App.M = {}; // Model, Collection class holder
App.V = {}; // View class holder

App.m = {}; // Model, Collection instance holder
App.v = {}; // View instance holder

App.init = function (options) {
  this.options = $.extend({
    data: []
  }, options);

  this.m.room = new App.M.Room(this.options.data);
  this.v.room = new App.V.Room(this.m.room);

  return App;
};



(function () {
  App.M.Room = function (data) {
    this.data = data;
    this.breaker = new App.M.Breaker();
    this.models = [];
    this.power = true;

    this.init();
  };

  var fn = App.M.Room.prototype;

  fn.init = function () {
    this._createModels();
  };

  fn._createModels = function () {
    var self = this;

    $.each(this.data, function (index, data) {
      var model = new App.M.Light(data);

      model.id = index;
      self.models.push(model);
    });
  };

  fn.on = function () {
    this.power = true;
    this.breaker.on();

    $.each(this.models, function (index, model) {
      model.on();
    });
  };

  fn.off = function () {
    this.power = false;
    this.breaker.off();

    $.each(this.models, function (index, model) {
      model.off();
    });
  };

  fn.toggle = function () {
    this.power ? this.off() : this.on();
  };
})();



(function () {
  App.M.Breaker = function () {
    this.power = true;
  };

  var fn = App.M.Breaker.prototype;

  fn.on = function () {
    this.power = true;
  };

  fn.off = function () {
    this.power = false;
  };
})();




(function () {
  App.M.Light = function (data) {
    this.data = data;
    this.power = !!data.power;
    this.color = data.color || 'yellow';
  };

  var fn = App.M.Light.prototype;

  fn.on = function () {
    this.power = true;
  };

  fn.off = function () {
    this.power = false;
  };

  fn.toggle = function () {
    this.power ? this.off() : this.on();
  };
})();



(function () {
  App.V.Room = function (collection) {
    this.collection = collection;
    this.$el = $('<div class="room"></div>');
    this.breaker = new App.V.Breaker(this.collection.breaker);
    this.lights = [];

    this.init();
  };

  var fn = App.V.Room.prototype;

  fn.init = function () {
    this.render();
    this._eventify();
  };

  fn._eventify = function () {
    this.$el.on('ElectricalSystem:light:click', $.proxy(this._onLightClick, this));
    this.$el.on('ElectricalSystem:breaker:click', $.proxy(this._onBreakerClick, this));
  };

  fn._onLightClick = function (e, model) {
    this.update(model.id);
  };

  fn._onBreakerClick = function () {
    this.collection.toggle();
    this.updateAll();
  };

  fn.render = function () {
    var self = this;

    $.each(this.collection.models, function (index, model) {
      var light = new App.V.Light(model, self.$el);

      self.lights.push(light);
      self.$el.append(light.$el);
    });

    this.$el.append(this.breaker.$el);
  };

  fn.update = function (index) {
    this.lights[index].update();
  };

  fn.updateAll = function () {
    $.each(this.lights, function (index, light) {
      light.update();
    });
  };
})();



(function () {
  App.V.Breaker = function (model) {
    this.model = model;
    this.$el = $('<div class="breaker"></div>');

    this.init();
  };

  var fn = App.V.Breaker.prototype;

  fn.init = function () {
    this.update();
    this._eventify();
  };

  fn._eventify = function () {
    this.$el.on('click', $.proxy(this._onClick, this));
  };

  fn._onClick = function () {
    this.$el.trigger('ElectricalSystem:breaker:click');
    this.update();
  };

  fn.update = function () {
    this.$el.toggleClass('breaker--on', this.model.power);
  };
})();



(function () {
  App.V.Light = function (model) {
    this.model = model;
    this.$el = $('<div class="light"></div>');

    this.init();
  };

  var fn = App.V.Light.prototype;

  fn.init = function () {
    this.update();
    this._eventify();
  };

  fn._eventify = function () {
    this.$el.on('click', $.proxy(this._onClick, this));
  };

  fn._onClick = function () {
    this.model.toggle();
    this.$el.trigger('ElectricalSystem:light:click', this.model);
  };

  fn.update = function () {
    var color = this.model.power ? this.model.color : 'gray';

    this.$el.css({
      backgroundColor: color
    });
  };
})();

})(jQuery, this, this.document);
