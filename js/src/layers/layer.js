// Base component for each layer

/**
 * Contains:
 *
 *  [visible]  (Thumbnail)  Name [ more options (dropdown)]
 *  [locked]
 */

/**
 * TODO state machine for each layers operation
 */


(function ($) {

  $.Layer = function (options) {
    jQuery.extend(true, this, {
      element: null,
      appendTo: null,
      manifest: null,
      visible: null,
      state: null,
      position:null,
      image:null,
      eventEmitter: null
    }, options);
    this.init();
  };

  $.Layer.prototype = {
    init: function () {
      var _this = this;
      this.model = new LayerModel($.genUUID());
      this.model.setImage(this.image);
      this.model.setPosition(this.position);
      this.view = jQuery(this.render(this.model));
      this.attachViewEvents(this.view);
      this.counter = 0;
      setInterval(function(){
        _this.view.find('.title .id').html('<p>'+ _this.counter+'</p>');
        _this.counter++;
      },5000);
    },
    render: function (model) {
      return this.template(model);
    },
    getView: function () {
      return this.view;
    },
    attachViewEvents:function(element){
      // not working
      element.find('.layer-config').click(this.handleLayerConfigClick);
      element.find('.vertical-menu .layer-visible').click(this.handleVisibilityClick());
    },
    handleVisibilityClick:function(){

    },
    handleLockClick:function(){

    },
    handleLayerConfigClick:function(){
      console.log('LayerConfigMenuShouldOpen');
    },
    getModel:function(){
      return this.model;
    },
    template: Handlebars.compile([
      '<li class="layer" id="{{getId}}">',
        '<div class="vertical-menu"> ',
        '<label class="layer-visible"><input type="checkbox" name="layer-visible" /><i class="fa fa-eye" aria-hidden="true"></i></label>',
        '<div><i class="fa fa-lock" aria-hidden="true"></div></i>',//fa-unlock
        '</div>',
        '<section>',
          '<div class="thumbnail-image"><img width="64" height="64" src="{{getThumbnail}}"></div>',
          '<div class="title"><span class="id"></span></div>',
        '</section>',
        '<button class="layer-config"><i class="fa fa-caret-down dropdown-icon"></i></button>' ,
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
    getPosition:function(){
      return this.position;
    },
    setPosition:function(position){
      this.position = position;
    },
    setImage:function(image){
      this.image = image;
    },
    getImage:function(){
      return this.image;
    },
    getThumbnail:function(){
      if(this.getImage()){
        console.log(this.getImage().resource['@id']);
        return this.getImage().resource['@id'];
      }
    }



    //choices model extends the layers

  };

}(Mirador));
