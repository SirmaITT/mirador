(function($) {
  $.Text = function(options) {
    jQuery.extend(this, {
      name: 'Text',
      logoClass: 'translate',
      idPrefix: 'text_'
    }, options);

    this.symbols = [];
    this.hints = [];
    if (options && options.Text && options.Text.symbols) {
      for (var symbol in options.Text.symbols) {
        this.symbols.push(symbol);
        this.hints.push(options.Text.symbols[symbol]);
      }
    }
    if (this.symbols.length === 0) {
      this.symbols.push('/');
      this.hints.push('predefined symbol');
    }
    this.currentSymbol = this.symbols[0];
    this.init();
  };

  $.Text.prototype = {
    init: function() {
    },

    initMenu: function(element) {
      var _this = this;
      var tool = element.find('.material-icons:contains(\'' + _this.logoClass + '\')');
      tool.addClass('mirador-symbol-tool');
      tool.append('<i class="currentSymbol">' + _this.currentSymbol + '</i>');
      var menu = '<ul class="dropdown mirador-symbol-list">';
      for (var i = 0; i < _this.symbols.length; i++) {
        menu += '<li><i class="fa"><pre>' + _this.symbols[i] + '</pre> ' + _this.hints[i] + '</i></li>';
      }
      menu += '</ul>';
      tool.append(menu);
      tool.on('mouseenter', function() {
        tool.find('.mirador-symbol-list').stop().slideFadeToggle(300);
      });
      tool.on('mouseleave', function() {
        tool.find('.mirador-symbol-list').stop().slideFadeToggle(300);
      });
      tool.find('ul li').on('click', function() {
        var symbol = jQuery(this).find('i pre').html();
        element.find('.currentSymbol').html(symbol);
        _this.currentSymbol = symbol;
      });
    },

    createShape: function(initialPoint, overlay) {
      overlay.mode = 'create';
      var _this = this;
      var fontSize = overlay.fixedShapeSize;
      var shape = new overlay.paperScope.PointText();
      shape.content = this.currentSymbol;
      shape.style = {
        fontFamily: 'Courier New',
        justification: 'left',
        fontWeight: 'normal',
        strokeWidth: 1 / overlay.paperScope.view.zoom
      };
      shape.bounds = new overlay.paperScope.Rectangle(initialPoint.x, initialPoint.y, fontSize * shape.content.length, 2 * fontSize);
      shape.name = overlay.getName(_this);
      shape.dashArray = [];
      shape.strokeColor = overlay.strokeColor;
      shape.fillColor = overlay.fillColor;
      shape.fillColor.alpha = overlay.fillColorAlpha;
      shape.fullySelected = true;
      shape.closed = true;
      overlay.fitFixedSizeShapes(shape);
      return shape;
    },

    onMouseUp: function(event, overlay) {
      // Empty block.
    },

    onMouseDrag: function(event, overlay) {
      if (overlay.mode === 'translate') {
        if (overlay.path) {
          overlay.path.position.x += event.delta.x;
          overlay.path.position.y += event.delta.y;
        }
      }
    },

    onMouseMove: function(event, overlay) {
      // Empty block.
    },

    onMouseDown: function(event, overlay) {
      var hitResult = overlay.paperScope.project.hitTest(event.point, overlay.hitOptions);
      if (hitResult && hitResult.item._name.toString().indexOf(this.idPrefix) != -1) {
        if (!overlay.path) {
          overlay.mode = 'translate';
          overlay.segment = null;
          overlay.path = null;
          document.body.style.cursor = "move";
        } else {
          document.body.style.cursor = "default";
        }
      } else {
        document.body.style.cursor = "default";
      }
      if (overlay.mode === '') {
        overlay.path = this.createShape(event.point, overlay);
        overlay.onDrawFinish();
      } else if (overlay.mode === 'translate') {
        if (hitResult) {
          if (overlay.path) {
            overlay.segment = null;
            overlay.path = null;
            overlay.mode = '';
          } else {
            overlay.path = hitResult.item;
          }
        }
      }
    },

    onDoubleClick: function(event, overlay) {
      // Empty block.
    }
  };
}(Mirador));