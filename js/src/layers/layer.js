// Base component for each layer

/**
 * Contains:
 *
 *  [visible]  (Thumbnail)  Name [ more options (dropdown)]
 *  [locked]
 */

/**
 * TODO state machine for each layers operation ?
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
      element.find('.layer-config').click(this.handleLayerConfigClick.bind(this));
      element.find('.layer-visible input').click(this.handleVisibilityClick.bind(this));
    //  element.find('.layer-locked input').click(this.handleLockClick.bind(this));
    },
    handleVisibilityClick:function(){
      if(this.model.isVisible()){
        // hide the layer opacity = 0 ? // better don't render
        this.model.setVisible(false);
      }else{
        // show the layer opacity = 1?
        this.model.setVisible(true);
      }
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
        '<label class="layer-visible"><input type="checkbox" name="" checked /><i class="fa fa-eye" aria-hidden="true"></i></label>',
        //'<div class="layer-locked"><input type="checkbox" name="" /><i class="fa fa-lock" aria-hidden="true"></i></div>',//fa-unlock
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
      console.log('LayerModel:',this.id,'visibility:',this.visible);
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
