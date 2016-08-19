'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GL_BUFFER_USAGE = exports.GL_TARGETS = exports.GL_DRAW_MODES = exports.GL_INDEX_TYPES = undefined;
exports.isWebGLRenderingContext = isWebGLRenderingContext;
exports.isWebGL2RenderingContext = isWebGL2RenderingContext;
exports.assertWebGLRenderingContext = assertWebGLRenderingContext;
exports.assertWebGL2RenderingContext = assertWebGL2RenderingContext;
exports.glKey = glKey;
exports.isIndexType = isIndexType;
exports.assertIndexType = assertIndexType;
exports.isDrawMode = isDrawMode;
exports.assertDrawMode = assertDrawMode;
exports.glTypeFromArray = glTypeFromArray;
exports.assertArrayTypeMatch = assertArrayTypeMatch;
exports.glArrayFromType = glArrayFromType;

var _webglTypes = require('./webgl-types');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Helper definitions for validation of webgl parameters
/* eslint-disable no-inline-comments, max-len */
var ERR_CONTEXT = 'Invalid WebGLRenderingContext';
var ERR_WEBGL2 = 'Requires WebGL2';

function isWebGLRenderingContext(gl) {
  return gl instanceof _webglTypes.WebGLRenderingContext || gl && gl.ARRAY_BUFFER === 0x8892;
}

function isWebGL2RenderingContext(gl) {
  return gl instanceof _webglTypes.WebGL2RenderingContext || gl && gl.TEXTURE_BINDING_3D === 0x806A;
}

function assertWebGLRenderingContext(gl) {
  // Need to handle debug context
  (0, _assert2.default)(isWebGLRenderingContext(gl), ERR_CONTEXT);
}

function assertWebGL2RenderingContext(gl) {
  // Need to handle debug context
  (0, _assert2.default)(isWebGL2RenderingContext(gl), ERR_WEBGL2);
}

// INDEX TYPES

// TODO - move to glGet
function glKey(value) {
  for (var key in _webglTypes.WebGL) {
    if (_webglTypes.WebGL[key] === value) {
      return key;
    }
  }
  return String(value);
}

// For drawElements, size of indices
var GL_INDEX_TYPES = exports.GL_INDEX_TYPES = ['UNSIGNED_BYTE', 'UNSIGNED_SHORT', 'UNSIGNED_INT'].map(function (constant) {
  return _webglTypes.WebGL[constant];
});

function isIndexType(type) {
  return GL_INDEX_TYPES.indexOf(type) !== -1;
}

function assertIndexType(glType, source) {
  (0, _assert2.default)(isIndexType(glType), 'Bad index type gl.' + glKey(glType) + ' ' + source);
}

// DRAW MODES

var GL_DRAW_MODES = exports.GL_DRAW_MODES = ['POINTS', 'LINE_STRIP', 'LINE_LOOP', 'LINES', 'TRIANGLE_STRIP', 'TRIANGLE_FAN', 'TRIANGLES'].map(function (constant) {
  return _webglTypes.WebGL[constant];
});

function isDrawMode(glMode) {
  return GL_DRAW_MODES.indexOf(glMode) !== -1;
}

function assertDrawMode(glType, source) {
  (0, _assert2.default)(isDrawMode(glType), 'Bad draw mode gl.' + glKey(glType) + ' ' + source);
}

// TARGET TYPES

var GL_TARGETS = exports.GL_TARGETS = ['ARRAY_BUFFER', // vertex attributes (e.g. vertex/texture coords or color)
'ELEMENT_ARRAY_BUFFER', // Buffer used for element indices.
// For WebGL 2 contexts
'COPY_READ_BUFFER', // Buffer for copying from one buffer object to another
'COPY_WRITE_BUFFER', // Buffer for copying from one buffer object to another
'TRANSFORM_FEEDBACK_BUFFER', // Buffer for transform feedback operations
'UNIFORM_BUFFER', // Buffer used for storing uniform blocks
'PIXEL_PACK_BUFFER', // Buffer used for pixel transfer operations
'PIXEL_UNPACK_BUFFER' // Buffer used for pixel transfer operations
].map(function (constant) {
  return _webglTypes.WebGL[constant];
}).filter(function (constant) {
  return constant;
});

// USAGE TYPES

var GL_BUFFER_USAGE = exports.GL_BUFFER_USAGE = ['STATIC_DRAW', // Buffer used often and not change often. Contents are written to the buffer, but not read.
'DYNAMIC_DRAW', // Buffer used often and change often. Contents are written to the buffer, but not read.
'STREAM_DRAW', // Buffer not used often. Contents are written to the buffer, but not read.
// For WebGL 2 contexts
'STATIC_READ', // Buffer used often and not change often. Contents are read from the buffer, but not written.
'DYNAMIC_READ', // Buffer used often and change often. Contents are read from the buffer, but not written.
'STREAM_READ', // Contents of the buffer are likely to not be used often. Contents are read from the buffer, but not written.
'STATIC_COPY', // Buffer used often and not change often. Contents are neither written or read by the user.
'DYNAMIC_COPY', // Buffer used often and change often. Contents are neither written or read by the user.
'STREAM_COPY' // Buffer used often and not change often. Contents are neither written or read by the user.
].map(function (constant) {
  return _webglTypes.WebGL[constant];
}).filter(function (constant) {
  return constant;
});

function glTypeFromArray(array) {
  // Sorted in some order of likelihood to reduce amount of comparisons
  if (array instanceof Float32Array) {
    return _webglTypes.WebGL.FLOAT;
  } else if (array instanceof Uint16Array) {
    return _webglTypes.WebGL.UNSIGNED_SHORT;
  } else if (array instanceof Uint32Array) {
    return _webglTypes.WebGL.UNSIGNED_INT;
  } else if (array instanceof Uint8Array) {
    return _webglTypes.WebGL.UNSIGNED_BYTE;
  } else if (array instanceof Uint8ClampedArray) {
    return _webglTypes.WebGL.UNSIGNED_BYTE;
  } else if (array instanceof Int8Array) {
    return _webglTypes.WebGL.BYTE;
  } else if (array instanceof Int16Array) {
    return _webglTypes.WebGL.SHORT;
  } else if (array instanceof Int32Array) {
    return _webglTypes.WebGL.INT;
  }
  throw new Error('Failed to deduce WebGL type from array');
}

function assertArrayTypeMatch(array, type, source) {
  (0, _assert2.default)(type === glTypeFromArray(array), (array.constructor.name || 'Array') + ' ' + ('does not match element type gl.' + glKey(type) + ' ' + source));
}

/* eslint-disable complexity */
function glArrayFromType(glType) {
  var clamped = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  // Sorted in some order of likelihood to reduce amount of comparisons
  switch (glType) {
    case _webglTypes.WebGL.FLOAT:
      return Float32Array;
    case _webglTypes.WebGL.UNSIGNED_SHORT:
    case _webglTypes.WebGL.UNSIGNED_SHORT_5_6_5:
    case _webglTypes.WebGL.UNSIGNED_SHORT_4_4_4_4:
    case _webglTypes.WebGL.UNSIGNED_SHORT_5_5_5_1:
      return Uint16Array;
    case _webglTypes.WebGL.UNSIGNED_INT:
      // case WebGL.UNSIGNED_INT_2_10_10_10_REV:
      // case WebGL.UNSIGNED_INT_10F_11F_11F_REV:
      // case WebGL.UNSIGNED_INT_5_9_9_9_REV:
      // case WebGL.UNSIGNED_INT_24_8:
      return Uint32Array;
    case _webglTypes.WebGL.UNSIGNED_BYTE:
      return clamped ? Uint8ClampedArray : Uint8Array;
    case _webglTypes.WebGL.BYTE:
      return Int8Array;
    case _webglTypes.WebGL.SHORT:
      return Int16Array;
    case _webglTypes.WebGL.INT:
      return Int32Array;

    default:
      throw new Error('Failed to deduce type from array');
  }
}
/* eslint-enable complexity */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93ZWJnbC93ZWJnbC1jaGVja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBU2dCLHVCLEdBQUEsdUI7UUFLQSx3QixHQUFBLHdCO1FBS0EsMkIsR0FBQSwyQjtRQUtBLDRCLEdBQUEsNEI7UUFRQSxLLEdBQUEsSztRQWVBLFcsR0FBQSxXO1FBSUEsZSxHQUFBLGU7UUFZQSxVLEdBQUEsVTtRQUlBLGMsR0FBQSxjO1FBbUNBLGUsR0FBQSxlO1FBc0JBLG9CLEdBQUEsb0I7UUFPQSxlLEdBQUEsZTs7QUFqSWhCOztBQUVBOzs7Ozs7QUFKQTtBQUNBO0FBS0EsSUFBTSxjQUFjLCtCQUFwQjtBQUNBLElBQU0sYUFBYSxpQkFBbkI7O0FBRU8sU0FBUyx1QkFBVCxDQUFpQyxFQUFqQyxFQUFxQztBQUMxQyxTQUFPLG1EQUNKLE1BQU0sR0FBRyxZQUFILEtBQW9CLE1BRDdCO0FBRUQ7O0FBRU0sU0FBUyx3QkFBVCxDQUFrQyxFQUFsQyxFQUFzQztBQUMzQyxTQUFPLG9EQUNKLE1BQU0sR0FBRyxrQkFBSCxLQUEwQixNQURuQztBQUVEOztBQUVNLFNBQVMsMkJBQVQsQ0FBcUMsRUFBckMsRUFBeUM7QUFDOUM7QUFDQSx3QkFBTyx3QkFBd0IsRUFBeEIsQ0FBUCxFQUFvQyxXQUFwQztBQUNEOztBQUVNLFNBQVMsNEJBQVQsQ0FBc0MsRUFBdEMsRUFBMEM7QUFDL0M7QUFDQSx3QkFBTyx5QkFBeUIsRUFBekIsQ0FBUCxFQUFxQyxVQUFyQztBQUNEOztBQUVEOztBQUVBO0FBQ08sU0FBUyxLQUFULENBQWUsS0FBZixFQUFzQjtBQUMzQixPQUFLLElBQU0sR0FBWCx1QkFBeUI7QUFDdkIsUUFBSSxrQkFBTSxHQUFOLE1BQWUsS0FBbkIsRUFBMEI7QUFDeEIsYUFBTyxHQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sT0FBTyxLQUFQLENBQVA7QUFDRDs7QUFFRDtBQUNPLElBQU0sMENBQWlCLENBQzVCLGVBRDRCLEVBQ1gsZ0JBRFcsRUFD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RUFBMkMsTUFBM0MsRUFBbUQ7QUFDeEQsd0JBQU8sU0FBUyxnQkFBZ0IsS0FBaEIsQ0FBaEIsRUFDRSxDQUFHLE1BQU0sV0FBTixDQUFrQixJQUFsQixJQUEwQixPQUE3QiwrQ0FDa0MsTUFBTSxJQUFOLENBRGxDLFNBQ2lELE1BRGpELENBREY7QUFHRDs7QUFFRDtBQUNPLFNBQVMsZUFBVCxDQUF5QixNQUF6QixFQUFrRDtBQUFBLE1BQWpCLE9BQWlCLHlEQUFQLEtBQU87O0FBQ3ZEO0FBQ0EsVUFBUSxNQUFSO0FBQ0EsU0FBSyxrQkFBTSxLQUFYO0FBQ0UsYUFBTyxZQUFQO0FBQ0YsU0FBSyxrQkFBTSxjQUFYO0FBQ0EsU0FBSyxrQkFBTSxvQkFBWDtBQUNBLFNBQUssa0JBQU0sc0JBQVg7QUFDQSxTQUFLLGtCQUFNLHNCQUFYO0FBQ0UsYUFBTyxXQUFQO0FBQ0YsU0FBSyxrQkFBTSxZQUFYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRSxhQUFPLFdBQVA7QUFDRixTQUFLLGtCQUFNLGFBQVg7QUFDRSxhQUFPLFVBQVUsaUJBQVYsR0FBOEIsVUFBckM7QUFDRixTQUFLLGtCQUFNLElBQVg7QUFDRSxhQUFPLFNBQVA7QUFDRixTQUFLLGtCQUFNLEtBQVg7QUFDRSxhQUFPLFVBQVA7QUFDRixTQUFLLGtCQUFNLEdBQVg7QUFDRSxhQUFPLFVBQVA7O0FBR0Y7QUFDRSxZQUFNLElBQUksS0FBSixDQUFVLGtDQUFWLENBQU47QUF6QkY7QUEyQkQ7QUFDRCIsImZpbGUiOiJ3ZWJnbC1jaGVja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBIZWxwZXIgZGVmaW5pdGlvbnMgZm9yIHZhbGlkYXRpb24gb2Ygd2ViZ2wgcGFyYW1ldGVyc1xuLyogZXNsaW50LWRpc2FibGUgbm8taW5saW5lLWNvbW1lbnRzLCBtYXgtbGVuICovXG5pbXBvcnQge1dlYkdMLCBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIFdlYkdMMlJlbmRlcmluZ0NvbnRleHR9XG4gIGZyb20gJy4vd2ViZ2wtdHlwZXMnO1xuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuXG5jb25zdCBFUlJfQ09OVEVYVCA9ICdJbnZhbGlkIFdlYkdMUmVuZGVyaW5nQ29udGV4dCc7XG5jb25zdCBFUlJfV0VCR0wyID0gJ1JlcXVpcmVzIFdlYkdMMic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dlYkdMUmVuZGVyaW5nQ29udGV4dChnbCkge1xuICByZXR1cm4gZ2wgaW5zdGFuY2VvZiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfHxcbiAgICAoZ2wgJiYgZ2wuQVJSQVlfQlVGRkVSID09PSAweDg4OTIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNXZWJHTDJSZW5kZXJpbmdDb250ZXh0KGdsKSB7XG4gIHJldHVybiBnbCBpbnN0YW5jZW9mIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQgfHxcbiAgICAoZ2wgJiYgZ2wuVEVYVFVSRV9CSU5ESU5HXzNEID09PSAweDgwNkEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0V2ViR0xSZW5kZXJpbmdDb250ZXh0KGdsKSB7XG4gIC8vIE5lZWQgdG8gaGFuZGxlIGRlYnVnIGNvbnRleHRcbiAgYXNzZXJ0KGlzV2ViR0xSZW5kZXJpbmdDb250ZXh0KGdsKSwgRVJSX0NPTlRFWFQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0V2ViR0wyUmVuZGVyaW5nQ29udGV4dChnbCkge1xuICAvLyBOZWVkIHRvIGhhbmRsZSBkZWJ1ZyBjb250ZXh0XG4gIGFzc2VydChpc1dlYkdMMlJlbmRlcmluZ0NvbnRleHQoZ2wpLCBFUlJfV0VCR0wyKTtcbn1cblxuLy8gSU5ERVggVFlQRVNcblxuLy8gVE9ETyAtIG1vdmUgdG8gZ2xHZXRcbmV4cG9ydCBmdW5jdGlvbiBnbEtleSh2YWx1ZSkge1xuICBmb3IgKGNvbnN0IGtleSBpbiBXZWJHTCkge1xuICAgIGlmIChXZWJHTFtrZXldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG59XG5cbi8vIEZvciBkcmF3RWxlbWVudHMsIHNpemUgb2YgaW5kaWNlc1xuZXhwb3J0IGNvbnN0IEdMX0lOREVYX1RZUEVTID0gW1xuICAnVU5TSUdORURfQllURScsICdVTlNJR05FRF9TSE9SVCcsICdVTlNJR05FRF9JTlQnXG5dXG4ubWFwKGNvbnN0YW50ID0+IFdlYkdMW2NvbnN0YW50XSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luZGV4VHlwZSh0eXBlKSB7XG4gIHJldHVybiBHTF9JTkRFWF9UWVBFUy5pbmRleE9mKHR5cGUpICE9PSAtMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEluZGV4VHlwZShnbFR5cGUsIHNvdXJjZSkge1xuICBhc3NlcnQoaXNJbmRleFR5cGUoZ2xUeXBlKSwgYEJhZCBpbmRleCB0eXBlIGdsLiR7Z2xLZXkoZ2xUeXBlKX0gJHtzb3VyY2V9YCk7XG59XG5cbi8vIERSQVcgTU9ERVNcblxuZXhwb3J0IGNvbnN0IEdMX0RSQVdfTU9ERVMgPSBbXG4gICdQT0lOVFMnLCAnTElORV9TVFJJUCcsICdMSU5FX0xPT1AnLCAnTElORVMnLFxuICAnVFJJQU5HTEVfU1RSSVAnLCAnVFJJQU5HTEVfRkFOJywgJ1RSSUFOR0xFUydcbl1cbi5tYXAoY29uc3RhbnQgPT4gV2ViR0xbY29uc3RhbnRdKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRHJhd01vZGUoZ2xNb2RlKSB7XG4gIHJldHVybiBHTF9EUkFXX01PREVTLmluZGV4T2YoZ2xNb2RlKSAhPT0gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnREcmF3TW9kZShnbFR5cGUsIHNvdXJjZSkge1xuICBhc3NlcnQoaXNEcmF3TW9kZShnbFR5cGUpLCBgQmFkIGRyYXcgbW9kZSBnbC4ke2dsS2V5KGdsVHlwZSl9ICR7c291cmNlfWApO1xufVxuXG4vLyBUQVJHRVQgVFlQRVNcblxuZXhwb3J0IGNvbnN0IEdMX1RBUkdFVFMgPSBbXG4gICdBUlJBWV9CVUZGRVInLCAvLyB2ZXJ0ZXggYXR0cmlidXRlcyAoZS5nLiB2ZXJ0ZXgvdGV4dHVyZSBjb29yZHMgb3IgY29sb3IpXG4gICdFTEVNRU5UX0FSUkFZX0JVRkZFUicsIC8vIEJ1ZmZlciB1c2VkIGZvciBlbGVtZW50IGluZGljZXMuXG4gIC8vIEZvciBXZWJHTCAyIGNvbnRleHRzXG4gICdDT1BZX1JFQURfQlVGRkVSJywgLy8gQnVmZmVyIGZvciBjb3B5aW5nIGZyb20gb25lIGJ1ZmZlciBvYmplY3QgdG8gYW5vdGhlclxuICAnQ09QWV9XUklURV9CVUZGRVInLCAvLyBCdWZmZXIgZm9yIGNvcHlpbmcgZnJvbSBvbmUgYnVmZmVyIG9iamVjdCB0byBhbm90aGVyXG4gICdUUkFOU0ZPUk1fRkVFREJBQ0tfQlVGRkVSJywgLy8gQnVmZmVyIGZvciB0cmFuc2Zvcm0gZmVlZGJhY2sgb3BlcmF0aW9uc1xuICAnVU5JRk9STV9CVUZGRVInLCAvLyBCdWZmZXIgdXNlZCBmb3Igc3RvcmluZyB1bmlmb3JtIGJsb2Nrc1xuICAnUElYRUxfUEFDS19CVUZGRVInLCAvLyBCdWZmZXIgdXNlZCBmb3IgcGl4ZWwgdHJhbnNmZXIgb3BlcmF0aW9uc1xuICAnUElYRUxfVU5QQUNLX0JVRkZFUicgLy8gQnVmZmVyIHVzZWQgZm9yIHBpeGVsIHRyYW5zZmVyIG9wZXJhdGlvbnNcbl1cbi5tYXAoY29uc3RhbnQgPT4gV2ViR0xbY29uc3RhbnRdKS5maWx0ZXIoY29uc3RhbnQgPT4gY29uc3RhbnQpO1xuXG4vLyBVU0FHRSBUWVBFU1xuXG5leHBvcnQgY29uc3QgR0xfQlVGRkVSX1VTQUdFID0gW1xuICAnU1RBVElDX0RSQVcnLCAvLyBCdWZmZXIgdXNlZCBvZnRlbiBhbmQgbm90IGNoYW5nZSBvZnRlbi4gQ29udGVudHMgYXJlIHdyaXR0ZW4gdG8gdGhlIGJ1ZmZlciwgYnV0IG5vdCByZWFkLlxuICAnRFlOQU1JQ19EUkFXJywgLy8gQnVmZmVyIHVzZWQgb2Z0ZW4gYW5kIGNoYW5nZSBvZnRlbi4gQ29udGVudHMgYXJlIHdyaXR0ZW4gdG8gdGhlIGJ1ZmZlciwgYnV0IG5vdCByZWFkLlxuICAnU1RSRUFNX0RSQVcnLCAvLyBCdWZmZXIgbm90IHVzZWQgb2Z0ZW4uIENvbnRlbnRzIGFyZSB3cml0dGVuIHRvIHRoZSBidWZmZXIsIGJ1dCBub3QgcmVhZC5cbiAgLy8gRm9yIFdlYkdMIDIgY29udGV4dHNcbiAgJ1NUQVRJQ19SRUFEJywgLy8gQnVmZmVyIHVzZWQgb2Z0ZW4gYW5kIG5vdCBjaGFuZ2Ugb2Z0ZW4uIENvbnRlbnRzIGFyZSByZWFkIGZyb20gdGhlIGJ1ZmZlciwgYnV0IG5vdCB3cml0dGVuLlxuICAnRFlOQU1JQ19SRUFEJywgLy8gQnVmZmVyIHVzZWQgb2Z0ZW4gYW5kIGNoYW5nZSBvZnRlbi4gQ29udGVudHMgYXJlIHJlYWQgZnJvbSB0aGUgYnVmZmVyLCBidXQgbm90IHdyaXR0ZW4uXG4gICdTVFJFQU1fUkVBRCcsIC8vIENvbnRlbnRzIG9mIHRoZSBidWZmZXIgYXJlIGxpa2VseSB0byBub3QgYmUgdXNlZCBvZnRlbi4gQ29udGVudHMgYXJlIHJlYWQgZnJvbSB0aGUgYnVmZmVyLCBidXQgbm90IHdyaXR0ZW4uXG4gICdTVEFUSUNfQ09QWScsIC8vIEJ1ZmZlciB1c2VkIG9mdGVuIGFuZCBub3QgY2hhbmdlIG9mdGVuLiBDb250ZW50cyBhcmUgbmVpdGhlciB3cml0dGVuIG9yIHJlYWQgYnkgdGhlIHVzZXIuXG4gICdEWU5BTUlDX0NPUFknLCAvLyBCdWZmZXIgdXNlZCBvZnRlbiBhbmQgY2hhbmdlIG9mdGVuLiBDb250ZW50cyBhcmUgbmVpdGhlciB3cml0dGVuIG9yIHJlYWQgYnkgdGhlIHVzZXIuXG4gICdTVFJFQU1fQ09QWScgLy8gQnVmZmVyIHVzZWQgb2Z0ZW4gYW5kIG5vdCBjaGFuZ2Ugb2Z0ZW4uIENvbnRlbnRzIGFyZSBuZWl0aGVyIHdyaXR0ZW4gb3IgcmVhZCBieSB0aGUgdXNlci5cbl1cbi5tYXAoY29uc3RhbnQgPT4gV2ViR0xbY29uc3RhbnRdKS5maWx0ZXIoY29uc3RhbnQgPT4gY29uc3RhbnQpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2xUeXBlRnJvbUFycmF5KGFycmF5KSB7XG4gIC8vIFNvcnRlZCBpbiBzb21lIG9yZGVyIG9mIGxpa2VsaWhvb2QgdG8gcmVkdWNlIGFtb3VudCBvZiBjb21wYXJpc29uc1xuICBpZiAoYXJyYXkgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcbiAgICByZXR1cm4gV2ViR0wuRkxPQVQ7XG4gIH0gZWxzZSBpZiAoYXJyYXkgaW5zdGFuY2VvZiBVaW50MTZBcnJheSkge1xuICAgIHJldHVybiBXZWJHTC5VTlNJR05FRF9TSE9SVDtcbiAgfSBlbHNlIGlmIChhcnJheSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG4gICAgcmV0dXJuIFdlYkdMLlVOU0lHTkVEX0lOVDtcbiAgfSBlbHNlIGlmIChhcnJheSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICByZXR1cm4gV2ViR0wuVU5TSUdORURfQllURTtcbiAgfSBlbHNlIGlmIChhcnJheSBpbnN0YW5jZW9mIFVpbnQ4Q2xhbXBlZEFycmF5KSB7XG4gICAgcmV0dXJuIFdlYkdMLlVOU0lHTkVEX0JZVEU7XG4gIH0gZWxzZSBpZiAoYXJyYXkgaW5zdGFuY2VvZiBJbnQ4QXJyYXkpIHtcbiAgICByZXR1cm4gV2ViR0wuQllURTtcbiAgfSBlbHNlIGlmIChhcnJheSBpbnN0YW5jZW9mIEludDE2QXJyYXkpIHtcbiAgICByZXR1cm4gV2ViR0wuU0hPUlQ7XG4gIH0gZWxzZSBpZiAoYXJyYXkgaW5zdGFuY2VvZiBJbnQzMkFycmF5KSB7XG4gICAgcmV0dXJuIFdlYkdMLklOVDtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBkZWR1Y2UgV2ViR0wgdHlwZSBmcm9tIGFycmF5Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRBcnJheVR5cGVNYXRjaChhcnJheSwgdHlwZSwgc291cmNlKSB7XG4gIGFzc2VydCh0eXBlID09PSBnbFR5cGVGcm9tQXJyYXkoYXJyYXkpLFxuICAgIGAke2FycmF5LmNvbnN0cnVjdG9yLm5hbWUgfHwgJ0FycmF5J30gYCArXG4gICAgYGRvZXMgbm90IG1hdGNoIGVsZW1lbnQgdHlwZSBnbC4ke2dsS2V5KHR5cGUpfSAke3NvdXJjZX1gKTtcbn1cblxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdsQXJyYXlGcm9tVHlwZShnbFR5cGUsIGNsYW1wZWQgPSBmYWxzZSkge1xuICAvLyBTb3J0ZWQgaW4gc29tZSBvcmRlciBvZiBsaWtlbGlob29kIHRvIHJlZHVjZSBhbW91bnQgb2YgY29tcGFyaXNvbnNcbiAgc3dpdGNoIChnbFR5cGUpIHtcbiAgY2FzZSBXZWJHTC5GTE9BVDpcbiAgICByZXR1cm4gRmxvYXQzMkFycmF5O1xuICBjYXNlIFdlYkdMLlVOU0lHTkVEX1NIT1JUOlxuICBjYXNlIFdlYkdMLlVOU0lHTkVEX1NIT1JUXzVfNl81OlxuICBjYXNlIFdlYkdMLlVOU0lHTkVEX1NIT1JUXzRfNF80XzQ6XG4gIGNhc2UgV2ViR0wuVU5TSUdORURfU0hPUlRfNV81XzVfMTpcbiAgICByZXR1cm4gVWludDE2QXJyYXk7XG4gIGNhc2UgV2ViR0wuVU5TSUdORURfSU5UOlxuICAvLyBjYXNlIFdlYkdMLlVOU0lHTkVEX0lOVF8yXzEwXzEwXzEwX1JFVjpcbiAgLy8gY2FzZSBXZWJHTC5VTlNJR05FRF9JTlRfMTBGXzExRl8xMUZfUkVWOlxuICAvLyBjYXNlIFdlYkdMLlVOU0lHTkVEX0lOVF81XzlfOV85X1JFVjpcbiAgLy8gY2FzZSBXZWJHTC5VTlNJR05FRF9JTlRfMjRfODpcbiAgICByZXR1cm4gVWludDMyQXJyYXk7XG4gIGNhc2UgV2ViR0wuVU5TSUdORURfQllURTpcbiAgICByZXR1cm4gY2xhbXBlZCA/IFVpbnQ4Q2xhbXBlZEFycmF5IDogVWludDhBcnJheTtcbiAgY2FzZSBXZWJHTC5CWVRFOlxuICAgIHJldHVybiBJbnQ4QXJyYXk7XG4gIGNhc2UgV2ViR0wuU0hPUlQ6XG4gICAgcmV0dXJuIEludDE2QXJyYXk7XG4gIGNhc2UgV2ViR0wuSU5UOlxuICAgIHJldHVybiBJbnQzMkFycmF5O1xuXG5cbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBkZWR1Y2UgdHlwZSBmcm9tIGFycmF5Jyk7XG4gIH1cbn1cbi8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4iXX0=