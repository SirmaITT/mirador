(function($) {

  $.LayersTab = function(options) {
    jQuery.extend(true, this, {
      element:           null,
      appendTo:          null,
      manifest:          null,
      visible:           null,
      state:             null,
      eventEmitter:      null
    }, options);

    this.init();
  };

  $.LayersTab.prototype = {
    init: function() {
      //console.log('LayersTab',this);
    //  console.log('LayersTab:Manifest',this.manifest.getCanvases());
      var _this = this;
      this.windowId = this.windowId;

      this.localState({
        id: 'layersTab',
        visible: this.visible,
        selectedList: null,
        empty: true
      }, true);

      this.loadTabComponents();
      this.listenForActions();
      this.bindEvents();
      this.render(this.localState());

      this.eventEmitter.subscribe(('currentCanvasIDUpdated.' + _this.windowId), function(event, canvasID) {
        //console.log('canvasChanged');
        //should create new layers component with the model
      });
    },

    localState: function(state, initial) {
      var _this = this;
      if (!arguments.length) return this.layerTabState;
      this.layerTabState = state;

      if (!initial) {
        _this.eventEmitter.publish('layersTabStateUpdated.' + this.windowId, this.layerTabState);
      }

      return this.layerTabState;
    },

    loadTabComponents: function() {
      var _this = this;

      this.layers = new $.Layers({
        eventEmitter:_this.eventEmitter,
        manifest:_this.manifest,
        canvasID:_this.canvasID,
        state:_this.state
      });
    },

    tabStateUpdated: function(data) {
      var localState = this.localState();
      if (data.tabs[data.selectedTabIndex].options.id === 'layersTab') {
        localState.visible = true;
      } else {
        localState.visible = false;
      }
      this.localState(localState);
    },

    toggle: function() {},

    listenForActions: function() {
      var _this = this;

      _this.eventEmitter.subscribe('layersTabStateUpdated.' + _this.windowId, function(_, data) {
        _this.render(data);
      });

      _this.eventEmitter.subscribe('tabStateUpdated.' + _this.windowId, function(_, data) {
        _this.tabStateUpdated(data);
      });

      _this.eventEmitter.subscribe('currentCanvasIDUpdated.' + _this.windowId, function(event, canvasID) {
       // console.log(canvasID);
        //update layers for this canvasID
      });
    },

    bindEvents: function() {
      var _this = this;

    },

    render: function(state) {
     // console.log('Rendering layers tab');
      var _this = this;

      if (this.element) {
        _this.appendTo.find(".layersPanel").remove();
      }

      this.element = jQuery(_this.template()).appendTo(_this.appendTo);
      this.element.append(this.layers.getView());

      if (state.visible) {
        this.element.show();
      } else {
        this.element.hide();
      }
    },

    template: Handlebars.compile([
      '<div class="layersPanel">',
      '</div>',
      ].join(''))
  };

}(Mirador));
