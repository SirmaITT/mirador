//Can be static and stateless

(function ($) {

  $.CanvasManifestPersistence = function (options) {
    jQuery.extend(true, this, {
      manifest: null,
      canvasID: null
    }, options);

    this.init();
  };

  $.CanvasManifestPersistence.prototype = {
    init: function () {
    },
    persistCanvas: function () {
      console.log('Should persist the layer/s model to the manifest');
    }
  };

}(Mirador));
