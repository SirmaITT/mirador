// Main Component rendered in the layers tab


(function ($) {

  $.Layers = function (options) {
    jQuery.extend(true, this, {
      manifest: null,
      canvasID: null,
      state: null,
      eventEmitter: null
    }, options);

    this.init();
  };

  $.Layers.prototype = {
    init: function () {
      var _this = this;
      console.log('Layers', this);
      this.idToLayer = {};
      this.layers = [];
      //this.layers = [new $.Layer(), new $.Layer(), new $.Layer()];
      // this.layers.forEach(function (layer, index) {
      //   layer.getModel().setPosition(index);
      //   _this.idToLayer[layer.getModel().getId()] = layer;
      // });
      console.log('Layers:layers', this.layers);
      var br = 0;
      // var int = setInterval(function () {
      //   _this.addLayer(new $.Layer());
      //   console.log('Inserting');
      //   if (++br > 10) {
      //     clearInterval(int);
      //   }
      //
      // }, 5000);


      this.canvas = this.getCanvasFromManifest();
      this.parseCanvas(this.canvas);

      var tmplOpts = {
        layers: this.layers
      };
      this.render(tmplOpts);
    },
    getCanvasFromManifest: function () {
      return this.manifest.getCanvases()[$.getImageIndexById(this.manifest.getCanvases(), this.canvasID)];
    },
    parseCanvas: function (canvas) {
      console.log(canvas);
      var _this = this;
      var images = canvas.images;
      console.log('parsing',images);
      this.layers = images.map(function (image, index) {
        var layer = new $.Layer({
          position:index,
          image:image
        });
        _this.idToLayer[layer.getModel().getId()] = layer;
        return layer;
      });
    },
    render: function (tmplOpts) {
      console.log('Rendering layers component');
      var _this = this;
      this.element = jQuery(this.template(tmplOpts));
      this.view = this.element.find('ul');
      this.layers.forEach(function (layer,index,layers) {
        _this.addLayerView(layers[index]);
      });
      this.makeSortable();
    },
    addLayer: function (layer) {
      this.layers.push(layer);
      this.addLayerView(layer);
    },
    addLayerView: function (layer) {
      this.view.append(layer.getView());
    },
    removeLayer: function () {

    },
    makeSortable: function () {
      var _this = this;
      this.view.sortable({
        items: "> li",
        update: function () {
          _this.onSortableListUpdated(this);
        }
      });
    },
    onSortableListUpdated: function (el) {
      console.log("List is being reordered");
      var updatedList = jQuery(el).sortable('toArray');
      this.updateLayersPosition(updatedList);
      console.log('Model after reorder', this.layers);
    },
    updateLayersPosition: function (layers) {
      var _this = this;

      var currentIds = this.layers.map(function (layer) {
        return layer.getModel().getId();
      });

      //this.layers = must be properly arranged
      //getDiff with current arrangement
      var firstDiff = -1;
      var i;
      for (i = 0; i < this.layers.length; i++) {
        if (currentIds[i] !== layers[i]) {
          firstDiff = i;
          break;
          //rearange layers array / holding map with the references and only pushing them properly?
        }
      }

      for (i = firstDiff; i < this.layers.length; i++) {
        this.layers[i] = this.idToLayer[layers[i]];
        this.layers[i].getModel().setPosition(i);
      }
    },
    getView: function () {
      return this.element;
    },
    template: Handlebars.compile([
      '<div class="layers">',
      '<ul>',
      '</ul>',
      '</div>',
    ].join(''))
  };

}(Mirador));
