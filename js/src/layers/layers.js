// Main Component rendered in the layers tab


(function ($) {

  $.Layers = function (options) {
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

  $.Layers.prototype = {
    init: function () {
      var _this = this;
      this.idToLayer = {};
      this.layers = [new $.Layer(), new $.Layer(), new $.Layer()];
      this.layers.forEach(function (layer, index) {
        layer.getModel().setPosition(index);
        _this.idToLayer[layer.getModel().getId()] = layer;
      });
      console.log('Layers', this.layers);
      var br = 0;
      // var int = setInterval(function () {
      //   _this.addLayer(new $.Layer());
      //   console.log('Inserting');
      //   if (++br > 10) {
      //     clearInterval(int);
      //   }
      //
      // }, 5000);

      var tmplOpts = {
        layers: this.layers
      };

      this.render(tmplOpts);
    },
    render: function (tmplOpts) {
      console.log('Rendering layers component');
      var _this = this;
      this.element = jQuery(this.template(tmplOpts));
      this.view = this.element.find('ul');
      this.layers.forEach(function (layer) {
        _this.addLayerView(layer);
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
      console.log('Model after reorder',this.layers);
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
      this.makeSortable();
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
