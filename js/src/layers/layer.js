// Base component for each layer

/**
 * Contains:
 *
 *  [visible]  (Thumbnail)  Name [ more options (dropdown)]
 *  [locked]
 */


(function ($) {

  $.Layer = function (options) {
    jQuery.extend(true, this, {
      element: null,
      appendTo: null,
      manifest: null,
      visible: null,
      state: null,
      eventEmitter: null
    }, options);
    this.init();
  };

  $.Layer.prototype = {
    init: function () {
      var _this = this;
      this.model = new LayerModel($.genUUID());
      this.view = jQuery(this.render(this.model));
      this.counter = 0;
      setInterval(function(){
        _this.view.find('.title').html('<p>'+ _this.counter+'</p>');
        _this.counter++;
      },5000);
    },
    render: function (model) {
      return this.template(model);
    },
    getView: function () {
      return this.view;
    },
    getModel:function(){
      return this.model;
    },
    template: Handlebars.compile([
      '<li class="layer" id="{{getId}}">',
        '<div class="vertical-menu"> ',
        '<div><i class="fa fa-eye" aria-hidden="true"></i></div><div><i class="fa fa-lock" aria-hidden="true"></div></i>',//fa-unlock
        '</div>',
        '<section>',
          '<div class="thumbnail-image">{{getId}}</div>',
          '<div class="title"></div>',
        '</section>',
        '<div class="layer-config">Opt</div>' ,
      '</li>'
    ].join(''))


  };

  var LayerModel = function (id) {
    this.visible = true;
    this.locked = false;
    this.id = id;
  };

  LayerModel.prototype = {
    setVisible: function (visible) {
      this.visible = visible;
    },
    isVisible: function () {
      return this.visible;
    },
    lock: function () {
      this.locked = true;
    },
    unlock: function () {
      this.locked = false;
    },
    isLocked: function () {
      return this.locked;
    },
    getId:function(){
      return this.id;
    },
    setId:function(id){
      this.id = id;
    },
    getPosition:function(){
      return this.position;
    },
    setPosition:function(position){
      this.position = position;
    }



    //choices model extends the layers

  };

}(Mirador));
