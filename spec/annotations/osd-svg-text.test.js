paper.install(window);

describe('Text', function() {
  var textNumber;

  function getEvent(delta, point) {
    return {
      'delta': delta,
      'point': point
    };
  }

  function getOverlay(paperScope, strokeColor, mode, path) {
    return {
      'fixedShapeSize': 1.0,
      'paperScope': paperScope,
      'strokeColor': strokeColor,
      'mode': mode,
      'path': path,
      'fixedShapeSize': 5,
      'hitOptions': {
        'fill': true,
        'stroke': true,
        'segments': true,
        'tolerance': 0
      },
      'fitFixedSizeShapes': function() {
      },
      onDrawFinish: function() {
      },
      getName: function(tool) {
        textNumber++;
        return tool.idPrefix + textNumber;
      }
    };
  }

  beforeAll(function() {
    this.canvas = jQuery('<canvas></canvas>');
    this.canvas.attr('id', 'paperId');
    jasmine.getFixtures().set(this.canvas);
    paper.setup(this.canvas.attr('id'));
    this.text = new Mirador.Text();
    textNumber = 0;
  });
  afterAll(function() {
    delete this.text;
  });

  it('should create text instance', function() {
    var text = new Mirador.Text();

    expect(text.symbols.length).toBe(1);

    var textTwo = new Mirador.Text({
      'Text': {
        'symbols': {
          'x': '1',
          'y': '2',
          'z': '3'
        }
      }
    });

    expect(textTwo.symbols.length).toBe(3);
  });

  it('should create text shape', function() {
    var initialPoint = {
      'x': 123,
      'y': 456
    };
    var overlay = getOverlay(paper, '#ff0000');
    var shape = this.text.createShape(initialPoint, overlay);

    expect(overlay.mode).toBe('create');

    expect(shape.strokeColor.red).toBe(1);
    expect(shape.strokeColor.green).toBe(0);
    expect(shape.strokeColor.blue).toBe(0);

    expect(shape.closed).toBe(true);

    expect(shape.fullySelected).toBe(true);

    expect(shape.name).toBe(this.text.idPrefix + '1');

    expect(shape.content).toBe(this.text.currentSymbol);
  });

  it('should initialize text shape menu', function() {
    var body = jQuery("body");

    body.append('<i class="material-icons">translate</i>');
    this.text.initMenu(body);

    expect(body.find('.currentSymbol').html()).toBe(this.text.currentSymbol);

    body.find('.mirador-symbol-list').mouseenter();
    body.find('ul li:last').click();
    body.find('.mirador-symbol-list').mouseleave();

    expect(body.find('.currentSymbol').html()).toBe(this.text.symbols[this.text.symbols.length - 1]);
  });

  describe('Text Mouse Tool', function() {
    var overlay;

    beforeEach(function() {
      overlay = getOverlay(paper, '#ff0000', '', null);
      this.text = new Mirador.Text();
      this.initialPoint = {
        'x': 987,
        'y': 654
      };
      this.shape = this.text.createShape(this.initialPoint, overlay);
    });

    afterEach(function() {
      delete this.shape;
      delete this.text;
    });

    it('should translate the whole text shape', function() {
      var event = getEvent({
        'x': 3,
        'y': -3
      });
      var bounds = {
        x: this.shape.bounds.x,
        y: this.shape.bounds.y,
        width: this.shape.bounds.width,
        height: this.shape.bounds.height,
      }
      overlay = getOverlay(paper, '#ff0000', 'translate', this.shape);
      this.text.onMouseDrag(event, overlay);

      expect(this.shape.bounds.x).toBe(bounds.x + event.delta.x);
      expect(this.shape.bounds.y).toBe(bounds.y + event.delta.y);
      expect(this.shape.bounds.width).toBe(bounds.width);
      expect(this.shape.bounds.height).toBe(bounds.height);

      overlay = getOverlay(paper, '#ff0000', 'translate', null);
      this.text.onMouseDrag(event, overlay);

      expect(this.shape.content).toBe(this.text.currentSymbol);

      overlay = getOverlay(paper, '#ff0000', '', null);
      this.text.onMouseDrag(event, overlay);

      expect(this.shape.content).toBe(this.text.currentSymbol);
    });

    it('should select text shape', function() {
      var event = getEvent({}, {
        'x': this.initialPoint.x,
        'y': this.initialPoint.y
      });
      overlay = getOverlay(paper, '#ff0000', '', null);
      this.text.onMouseDown(event, overlay);

      expect(overlay.mode).toBe('translate');
      expect(overlay.path).toBe(this.shape);
      expect(document.body.style.cursor).toBe('move');

      this.text.onMouseDown(event, overlay);

      expect(overlay.mode).toBe('');
      expect(overlay.path).toBeNull();

      event = getEvent({}, {
        'x': this.initialPoint.x + 100,
        'y': this.initialPoint.y + 100
      });
      overlay = getOverlay(paper, '#ff0000', 'translate', null);
      this.text.onMouseDown(event, overlay);

      expect(overlay.mode).toBe('translate');
      expect(overlay.path).toBeNull();

      overlay = getOverlay(paper, '#ff0000', 'deform', null);
      this.text.onMouseDown(event, overlay);

      expect(overlay.mode).toBe('deform');
      expect(overlay.path).toBeNull();

      event = getEvent({}, {
        'x': this.initialPoint.x,
        'y': this.initialPoint.y
      });
      overlay = getOverlay(paper, '#ff0000', 'translate', this.shape);
      this.text.onMouseDown(event, overlay);

      expect(overlay.mode).toBe('');
      expect(overlay.path).toBeNull();
      expect(document.body.style.cursor).toBe('default');

      event = getEvent({}, {
        'x': this.initialPoint.x + 100,
        'y': this.initialPoint.y + 100
      });
      overlay = getOverlay(paper, '#ff0000', '', null);
      this.text.onMouseDown(event, overlay);

      expect(overlay.mode).toBe('create');
    });
  });
});