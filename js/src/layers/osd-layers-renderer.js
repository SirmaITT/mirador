//Can be static and stateless

(function ($) {

  $.OSDLayersRenderer = function (options) {
    jQuery.extend(true, this, {
      osd: null,
      manifest: null,
      canvasID:null
    }, options);

    this.init();
  };

  $.OSDLayersRenderer.prototype = {
    init: function () {
    },
    render:function(){
      console.log('Should rerender osd canvas based on the manifest and canvasID');

    }
  };

}(Mirador));
