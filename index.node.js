module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	/*global Buffer*/

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _ImageType = {
	  noImage: 0,
	  colorMapped: 1,
	  RGB: 2,
	  blackAndWhite: 3,
	  runlengthColorMapped: 9,
	  runlengthRGB: 10,
	  compressedBlackAndWhite: 11,
	  compressedColorMapped: 32,
	  compressed4PassQTColorMapped: 33
	};

	var _headerLength = 18;

	var TGAImage = function () {
	  /**
	   * constructor
	   * @param {Buffer|ArrayBuffer} data -
	   * @constructor
	   */
	  function TGAImage(data) {
	    var _this = this;

	    _classCallCheck(this, TGAImage);

	    if (data instanceof Buffer) {
	      this._buffer = data;
	    } else if (typeof data === 'string') {
	      this._buffer = Buffer.from(data, 'binary');
	    } else if (data) {
	      this._buffer = Buffer.from(data);
	    } else {
	      this._buffer = null;
	    }

	    // Header
	    this._idLength = 0;
	    this._colorMapType = 0;
	    this._imageType = 0;
	    this._colorMapOrigin = 0;
	    this._colorMapLength = 0;
	    this._colorMapDepth = 0;
	    this._imageXOrigin = 0;
	    this._imageYOrigin = 0;
	    this._imageWidth = 0;
	    this._imageHeight = 0;
	    this._imageDepth = 0;
	    this._alphaDepth = 0;
	    this._leftToRight = true;
	    this._topToBottom = false;
	    this._interleave = false;
	    this._hasAlpha = false;

	    // Image Identification Field
	    this._imageID = null;

	    // Image Data
	    this._canvas = null;
	    this._context = null;
	    this._imageData = null;
	    this._image = null;

	    // for HTML Image tag compatibility
	    this._src = null;
	    this.onload = null;
	    this.onerror = null;

	    this._resolveFunc = null;
	    this._rejectFunc = null;
	    this._didLoad = new Promise(function (resolve, reject) {
	      _this._resolveFunc = resolve;
	      _this._rejectFunc = reject;
	    });

	    if (data) {
	      this._parseData();
	    }
	  }

	  _createClass(TGAImage, [{
	    key: '_loadURL',
	    value: function _loadURL(url) {
	      var _this2 = this;

	      this._src = url;
	      this._requestBinaryFile(url).then(function (data) {
	        _this2._buffer = Buffer.from(data);
	        _this2._parseData();
	      }).catch(function (error) {
	        _this2._reject(error);
	      });
	    }
	  }, {
	    key: '_requestBinaryFile',
	    value: function _requestBinaryFile(url) {
	      return new Promise(function (resolve, reject) {
	        var request = new XMLHttpRequest();
	        request.open('GET', url);
	        request.responseType = 'arraybuffer';
	        request.onload = function (ev) {
	          if (request.response) {
	            resolve(request.response);
	          } else {
	            reject(request);
	          }
	        };
	        request.onerror = function (ev) {
	          reject(ev);
	        };
	        request.send(null);
	      });
	    }
	  }, {
	    key: '_parseData',
	    value: function _parseData() {
	      this._readHeader();
	      this._readImageID();
	      this._initImage();

	      var data = this._getImageData();

	      switch (this._imageType) {
	        case _ImageType.noImage:
	          {
	            // nothing to do
	            break;
	          }
	        case _ImageType.colorMapped:
	          {
	            this._parseColorMapData(data);
	            break;
	          }
	        case _ImageType.RGB:
	          {
	            this._parseRGBData(data);
	            break;
	          }
	        case _ImageType.blackAndWhite:
	          {
	            this._parseBlackAndWhiteData(data);
	            break;
	          }
	        case _ImageType.runlengthColorMapped:
	          {
	            this._parseColorMapData(data);
	            break;
	          }
	        case _ImageType.runlengthRGB:
	          {
	            this._parseRGBData(data);
	            break;
	          }
	        case _ImageType.compressedBlackAndWhite:
	          {
	            this._parseBlackAndWhiteData(data);
	            break;
	          }
	        case _ImageType.compressedColorMapped:
	          {
	            console.error('parser for compressed TGA is not implemeneted');
	            break;
	          }
	        case _ImageType.compressed4PassQTColorMapped:
	          {
	            console.error('parser for compressed TGA is not implemeneted');
	            break;
	          }
	        default:
	          {
	            throw new Error('unknown imageType: ' + this._imageType);
	          }
	      }

	      this._setImage();
	      this._deleteBuffer();
	    }
	  }, {
	    key: '_readHeader',
	    value: function _readHeader() {
	      this._idLength = this._buffer.readUIntLE(0, 1);
	      this._colorMapType = this._buffer.readUIntLE(1, 1);
	      this._imageType = this._buffer.readUIntLE(2, 1);
	      this._colorMapOrigin = this._buffer.readUIntLE(3, 2);
	      this._colorMapLength = this._buffer.readUIntLE(5, 2);
	      this._colorMapDepth = this._buffer.readUIntLE(7, 1);
	      this._imageXOrigin = this._buffer.readUIntLE(8, 2);
	      this._imageYOrigin = this._buffer.readUIntLE(10, 2);
	      this._imageWidth = this._buffer.readUIntLE(12, 2);
	      this._imageHeight = this._buffer.readUIntLE(14, 2);
	      this._imageDepth = this._buffer.readUIntLE(16, 1);

	      var descriptor = this._buffer.readUIntLE(17, 1);
	      this._alphaDepth = descriptor & 0x0F;
	      this._leftToRight = (descriptor & 0x10) === 0;
	      this._topToBottom = (descriptor & 0x20) > 0;
	      this._interleave = descriptor & 0xC0;
	    }
	  }, {
	    key: '_readImageID',
	    value: function _readImageID() {
	      if (this._idLength > 0) {
	        this._imageID = this._buffer.subarray(_headerLength, this._idLength);
	      }
	    }
	  }, {
	    key: '_initImage',
	    value: function _initImage() {
	      if (this._imageType === _ImageType.noImage) {
	        return;
	      }
	      if (this._imageWidth <= 0 || this._imageHeight <= 0) {
	        return;
	      }
	      this._canvas = document.createElement('canvas');
	      this._canvas.width = this._imageWidth;
	      this._canvas.height = this._imageHeight;
	      this._context = this._canvas.getContext('2d');
	      this._imageData = this._context.createImageData(this._imageWidth, this._imageHeight);
	    }
	  }, {
	    key: '_setImage',
	    value: function _setImage() {
	      var _this3 = this;

	      this._context.putImageData(this._imageData, 0, 0);
	      this._image = new Image();
	      this._image.width = this._imageWidth;
	      this._image.height = this._imageHeight;
	      this._image.onload = function () {
	        _this3._resolve();
	      };
	      this._image.src = this._canvas.toDataURL();
	    }
	  }, {
	    key: '_deleteBuffer',
	    value: function _deleteBuffer() {
	      if (this._buffer) {
	        delete this._buffer;
	        this._buffer = null;
	      }
	      if (this._imageData) {
	        delete this._imageData;
	        this._imageData = null;
	      }
	    }
	  }, {
	    key: '_parseColorMapData',
	    value: function _parseColorMapData(buf) {
	      if (this._colorMapDepth === 24 || this._colorMapDepth === 16 || this._colorMapDepth === 15) {
	        this._hasAlpha = false;
	      } else if (this._colorMapDepth === 32) {
	        this._hasAlpha = true;
	      } else {
	        throw new Error('unknown colorMapDepth: ' + this._colorMapDepth);
	      }

	      var colorMapDataPos = _headerLength + this._idLength;
	      var colorMapDataSize = Math.ceil(this._colorMapDepth / 8);
	      var colorMapDataLen = colorMapDataSize * this._colorMapLength;

	      var imageDataSize = 1;

	      var colorMap = [];
	      var pos = colorMapDataPos;
	      for (var i = 0; i < this._colorMapLength; i++) {
	        var rgba = this._getRGBA(this._buffer, pos, this._colorMapDepth);
	        colorMap.push(rgba);
	        pos += colorMapDataSize;
	      }

	      var data = this._imageData.data;
	      var initX = 0;
	      var initY = 0;
	      var xStep = 1;
	      var yStep = 1;
	      if (!this._leftToRight) {
	        initX = this._imageWidth - 1;
	        xStep = -1;
	      }
	      if (!this._topToBottom) {
	        initY = this._imageHeight - 1;
	        yStep = -1;
	      }

	      pos = 0;
	      var y = initY;
	      var defaultColor = [0xFF, 0xFF, 0xFF, 0xFF];
	      for (var iy = 0; iy < this._imageHeight; iy++) {
	        var x = initX;
	        for (var ix = 0; ix < this._imageWidth; ix++) {
	          var index = (y * this._imageWidth + x) * 4;
	          var color = defaultColor;
	          var mapNo = buf[pos] - this._colorMapOrigin;
	          if (mapNo >= 0) {
	            color = colorMap[mapNo];
	          }
	          data[index] = color[0];
	          data[index + 1] = color[1];
	          data[index + 2] = color[2];
	          data[index + 3] = color[3];

	          x += xStep;
	          pos += imageDataSize;
	        }
	        y += yStep;
	      }
	    }
	  }, {
	    key: '_parseRGBData',
	    value: function _parseRGBData(buf) {
	      if (this._imageDepth === 24 || this._imageDepth === 16 || this._imageDepth === 15) {
	        this._hasAlpha = false;
	      } else if (this._imageDepth === 32) {
	        this._hasAlpha = true;
	      } else {
	        throw new Error('unknown imageDepth: ' + this._imageDepth);
	      }

	      var imageDataSize = Math.ceil(this._imageDepth / 8);

	      var data = this._imageData.data;
	      var initX = 0;
	      var initY = 0;
	      var xStep = 1;
	      var yStep = 1;
	      if (!this._leftToRight) {
	        initX = this._imageWidth - 1;
	        xStep = -1;
	      }
	      if (!this._topToBottom) {
	        initY = this._imageHeight - 1;
	        yStep = -1;
	      }

	      var pos = 0;
	      var y = initY;
	      for (var iy = 0; iy < this._imageHeight; iy++) {
	        var x = initX;
	        for (var ix = 0; ix < this._imageWidth; ix++) {
	          var index = (y * this._imageWidth + x) * 4;
	          var rgba = this._getRGBA(buf, pos, this._imageDepth);
	          data[index] = rgba[0];
	          data[index + 1] = rgba[1];
	          data[index + 2] = rgba[2];
	          data[index + 3] = rgba[3];

	          x += xStep;
	          pos += imageDataSize;
	        }
	        y += yStep;
	      }
	    }
	  }, {
	    key: '_getRGBA',
	    value: function _getRGBA(buf, offset, depth) {
	      if (depth === 15) {
	        var r = (buf[offset + 1] & 0x7c) << 1;
	        var g = (buf[offset + 1] & 0x03) << 6 | (buf[offset] & 0xe0) >> 2;
	        var b = (buf[offset] & 0x1f) << 3;
	        //const a = (buf[offset+1] & 0x80) > 0 ? 255 : 0
	        var a = 255;
	        return [r, g, b, a];
	      } else if (depth === 16) {
	        var _r = (buf[offset + 1] & 0x7c) << 1;
	        var _g = (buf[offset + 1] & 0x03) << 6 | (buf[offset] & 0xe0) >> 2;
	        var _b = (buf[offset] & 0x1f) << 3;
	        var _a = 255;
	        return [_r, _g, _b, _a];
	      } else if (depth === 24) {
	        return [buf[offset + 2], buf[offset + 1], buf[offset], 255];
	      } else if (depth === 32) {
	        return [buf[offset + 2], buf[offset + 1], buf[offset], buf[offset + 3]];
	      }
	      throw new Error('unsupported imageDepth: ' + depth);
	    }
	  }, {
	    key: '_parseBlackAndWhiteData',
	    value: function _parseBlackAndWhiteData(buf) {
	      if (this._imageDepth == 8) {
	        this._hasAlpha = false;
	      } else if (this._imageDepth == 16) {
	        this._hasAlpha = true;
	      } else {
	        throw new Error('unknown imageDepth: ' + this._imageDepth);
	      }

	      var imageDataSize = this._imageDepth / 8;

	      var data = this._imageData.data;
	      var initX = 0;
	      var initY = 0;
	      var xStep = 1;
	      var yStep = 1;
	      if (!this._leftToRight) {
	        initX = this._imageWidth - 1;
	        xStep = -1;
	      }
	      if (!this._topToBottom) {
	        initY = this._imageHeight - 1;
	        yStep = -1;
	      }

	      var pos = 0;
	      if (this._hasAlpha) {
	        var y = initY;
	        for (var iy = 0; iy < this._imageHeight; iy++) {
	          var x = initX;
	          for (var ix = 0; ix < this._imageWidth; ix++) {
	            var index = (y * this._imageWidth + x) * 4;
	            var c = buf[pos];
	            var a = buf[pos + 1];
	            data[index] = c;
	            data[index + 1] = c;
	            data[index + 2] = c;
	            data[index + 3] = a;

	            x += xStep;
	            pos += imageDataSize;
	          }
	          y += yStep;
	        }
	      } else {
	        var _y = initY;
	        for (var _iy = 0; _iy < this._imageHeight; _iy++) {
	          var _x = initX;
	          for (var _ix = 0; _ix < this._imageWidth; _ix++) {
	            var _index = (_y * this._imageWidth + _x) * 4;
	            var _c = buf[pos];
	            var _a2 = 255;
	            data[_index] = _c;
	            data[_index + 1] = _c;
	            data[_index + 2] = _c;
	            data[_index + 3] = _a2;

	            _x += xStep;
	            pos += imageDataSize;
	          }
	          _y += yStep;
	        }
	      }
	    }
	  }, {
	    key: '_getImageData',
	    value: function _getImageData() {
	      var data = null;
	      if (this._imageType !== _ImageType.none) {
	        var colorMapDataLen = Math.ceil(this._colorMapDepth / 8) * this._colorMapLength;
	        var start = _headerLength + this._idLength + colorMapDataLen;
	        data = this._buffer.subarray(start);
	      }

	      if (this._imageType === _ImageType.runlengthColorMapped || this._imageType === _ImageType.runlengthRGB) {
	        data = this._decompressRunlengthData(data);
	      } else if (this._imageType === _ImageType.compressedBlackAndWhite) {
	        data = this._decompressRunlengthData(data);
	      } else if (this._imageType === _ImageType.compressedColorMapped) {
	        // TODO: implement
	        console.error('Compressed Color Mapped TGA Image data is not supported');
	      } else if (this._imageType === _ImageType.compressed4PassQTColorMapped) {
	        // TODO: implement
	        console.error('Compressed Color Mapped TGA Image data is not supported');
	      }
	      return data;
	    }
	  }, {
	    key: '_decompressRunlengthData',
	    value: function _decompressRunlengthData(data) {
	      var d = [];
	      var elementCount = Math.ceil(this._imageDepth / 8);
	      var dataLength = elementCount * this._imageWidth * this._imageHeight;
	      var pos = 0;

	      while (d.length < dataLength) {
	        var packet = data[pos];
	        pos += 1;
	        if ((packet & 0x80) !== 0) {
	          // RLE
	          var elements = data.slice(pos, pos + elementCount);
	          pos += elementCount;

	          var count = (packet & 0x7F) + 1;
	          for (var i = 0; i < count; i++) {
	            d.push.apply(d, _toConsumableArray(elements));
	          }
	        } else {
	          // RAW
	          var len = (packet + 1) * elementCount;
	          d.push.apply(d, _toConsumableArray(data.slice(pos, pos + len)));
	          pos += len;
	        }
	      }
	      return d;
	    }
	  }, {
	    key: '_resolve',
	    value: function _resolve(e) {
	      if (this.onload) {
	        this.onload(e);
	      }
	      this._resolveFunc(e);
	    }
	  }, {
	    key: '_reject',
	    value: function _reject(e) {
	      if (this.onerror) {
	        this.onerror(e);
	      }
	      this._rejectFunc(e);
	    }
	  }, {
	    key: 'image',
	    get: function get() {
	      return this._image;
	    }
	  }, {
	    key: 'canvas',
	    get: function get() {
	      return this._canvas;
	    }
	  }, {
	    key: 'didLoad',
	    get: function get() {
	      return this._didLoad;
	    }
	  }, {
	    key: 'src',
	    get: function get() {
	      return this._src;
	    },
	    set: function set(newValue) {
	      this._loadURL(newValue);
	    }
	  }], [{
	    key: 'imageWithData',
	    value: function imageWithData(data) {
	      return new TGAImage(data);
	    }
	  }, {
	    key: 'imageWithURL',
	    value: function imageWithURL(url) {
	      var image = new TGAImage();
	      image._loadURL(url);
	      return image;
	    }
	  }]);

	  return TGAImage;
	}();

	module.exports = TGAImage;

/***/ })
/******/ ]);