'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');

function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;
const {iterator, toStringTag} = Symbol;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
};

/**
 * Determine if a value is an empty object (safely handles Buffers)
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an empty object, otherwise false
 */
const isEmptyObject = (val) => {
  // Early return for non-objects or Buffers to prevent RangeError
  if (!isObject(val) || isBuffer(val)) {
    return false;
  }
  
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    // Fallback for any other objects that might cause RangeError with Object.keys()
    return false;
  }
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate$1 = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Buffer check
    if (isBuffer(obj)) {
      return;
    }

    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey$1(obj, key) {
  if (isBuffer(obj)){
    return null;
  }

  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey$1(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];

  const _iterator = generator.call(obj);

  let result;

  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      //Buffer check
      if (isBuffer(source)) {
        return source;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************


const isIterable = (thing) => thing != null && isFunction(thing[iterator]);


var utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate: isDate$1,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey: findKey$1,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError$1(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils$1.inherits(AxiosError$1, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype$1 = AxiosError$1.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError$1, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError$1.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$1.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError$1.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData$1(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$1.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (utils$1.isBoolean(value)) {
      return value.toString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError$1('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData$1(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (utils$1.isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

var platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
  navigator: _navigator,
  origin: origin
});

var platform = {
  ...utils,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData$1(data, new platform.classes.URLSearchParams(), {
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$1.isObject(data);

    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$1.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$1.isArrayBuffer(data) ||
      utils$1.isBuffer(data) ||
      utils$1.isStream(data) ||
      utils$1.isFile(data) ||
      utils$1.isBlob(data) ||
      utils$1.isReadableStream(data)
    ) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData$1(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }

    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

let AxiosHeaders$1 = class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils$1.isArray(entry)) {
          throw TypeError('Object iterator must return a key-value pair');
        }

        obj[key = entry[0]] = (dest = obj[key]) ?
          (utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]]) : entry[1];
      }

      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  getSetCookie() {
    return this.get("set-cookie") || [];
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
};

AxiosHeaders$1.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$1.freezeMethods(AxiosHeaders$1);

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel$1(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError$1(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError$1.call(this, message == null ? 'canceled' : message, AxiosError$1.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$1.inherits(CanceledError$1, AxiosError$1, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError$1(
      'Request failed with status code ' + response.status,
      [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
};

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};

const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

var isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, platform.origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;

var cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils$1.isString(path) && cookie.push('path=' + path);

      utils$1.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig$1(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({caseless}, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  utils$1.forEach(Object.keys({...config1, ...config2}), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

var resolveConfig = (config) => {
  const newConfig = mergeConfig$1({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError$1('Request aborted', AxiosError$1.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError$1(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError$1('Unsupported protocol ' + protocol + ':', AxiosError$1.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
      }
    };

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
    }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils$1.asap(unsubscribe);

    return signal;
  }
};

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
};

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
};

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => utils$1.isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
      });
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils$1.isBlob(body)) {
    return body.size;
  }

  if(utils$1.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(utils$1.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils$1.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};

const resolveBodyLength = async (headers, body) => {
  const length = utils$1.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
};

var fetchAdapter = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader);
      }

      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils$1.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request, fetchOptions);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw AxiosError$1.from(err, err && err.code, config, request);
  }
});

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};

utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError$1(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new AxiosError$1(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel$1(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const VERSION$1 = "1.11.0";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION$1 + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError$1(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError$1.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError$1('options must be an object', AxiosError$1.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError$1('option ' + opt + ' must be ' + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError$1('Unknown option ' + opt, AxiosError$1.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
let Axios$1 = class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig$1(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios$1.prototype[method] = generateHTTPMethod();

  Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
let CancelToken$1 = class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError$1(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread$1(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError$1(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode$1 = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
  HttpStatusCode$1[value] = key;
});

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$1.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError$1;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel$1;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData$1;

// Expose AxiosError class
axios.AxiosError = AxiosError$1;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread$1;

// Expose isAxiosError
axios.isAxiosError = isAxiosError$1;

// Expose mergeConfig
axios.mergeConfig = mergeConfig$1;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig
} = axios;

// Core types for the GEO Pilot SDK
// Error types
class GEOPilotError extends Error {
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'GEOPilotError';
    }
}

// Mock blog posts for demo purposes
const mockBlogPosts = [
    {
        id: '1',
        title: 'Getting Started with React 19',
        slug: 'getting-started-with-react-19',
        content: 'React 19 brings exciting new features and improvements...',
        excerpt: 'Learn about the latest features in React 19 and how to use them in your projects.',
        featuredImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
        seoTitle: 'Getting Started with React 19 - Complete Guide',
        seoDescription: 'Learn about the latest features in React 19 and how to use them in your projects.',
        seoKeywords: ['react', 'javascript', 'frontend', 'development'],
        categories: ['React', 'JavaScript', 'Frontend'],
        tags: ['react19', 'javascript', 'frontend'],
        publishedAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        readingTime: 5,
        wordCount: 800,
        authorName: 'John Doe',
        author: 'john-doe',
        status: 'published'
    },
    {
        id: '2',
        title: 'Building Modern Web Applications with Next.js',
        slug: 'building-modern-web-applications-nextjs',
        content: 'Next.js has revolutionized the way we build web applications...',
        excerpt: 'Explore the power of Next.js for building scalable web applications.',
        featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        seoTitle: 'Building Modern Web Applications with Next.js',
        seoDescription: 'Explore the power of Next.js for building scalable web applications.',
        seoKeywords: ['nextjs', 'react', 'web development', 'ssr'],
        categories: ['Next.js', 'React', 'Web Development'],
        tags: ['nextjs', 'react', 'ssr', 'web-development'],
        publishedAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
        readingTime: 8,
        wordCount: 1200,
        authorName: 'Jane Smith',
        author: 'jane-smith',
        status: 'published'
    },
    {
        id: '3',
        title: 'TypeScript Best Practices for Large Applications',
        slug: 'typescript-best-practices-large-applications',
        content: 'TypeScript provides excellent type safety and developer experience...',
        excerpt: 'Learn essential TypeScript patterns and best practices for enterprise applications.',
        featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        seoTitle: 'TypeScript Best Practices for Large Applications',
        seoDescription: 'Learn essential TypeScript patterns and best practices for enterprise applications.',
        seoKeywords: ['typescript', 'javascript', 'enterprise', 'best-practices'],
        categories: ['TypeScript', 'JavaScript', 'Best Practices'],
        tags: ['typescript', 'javascript', 'enterprise', 'best-practices'],
        publishedAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z',
        readingTime: 12,
        wordCount: 1800,
        authorName: 'Mike Johnson',
        author: 'mike-johnson',
        status: 'published'
    },
    {
        id: '4',
        title: 'The Future of Web Development',
        slug: 'future-of-web-development',
        content: 'Web development is constantly evolving with new technologies...',
        excerpt: 'Discover emerging trends and technologies shaping the future of web development.',
        featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
        seoTitle: 'The Future of Web Development - Trends & Technologies',
        seoDescription: 'Discover emerging trends and technologies shaping the future of web development.',
        seoKeywords: ['web development', 'future', 'trends', 'technology'],
        categories: ['Web Development', 'Technology', 'Future'],
        tags: ['web-development', 'future', 'trends', 'technology'],
        publishedAt: '2024-01-12T14:20:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
        readingTime: 6,
        wordCount: 900,
        authorName: 'Sarah Wilson',
        author: 'sarah-wilson',
        status: 'published'
    },
    {
        id: '5',
        title: 'Mastering CSS Grid and Flexbox',
        slug: 'mastering-css-grid-flexbox',
        content: 'CSS Grid and Flexbox are powerful layout systems...',
        excerpt: 'Master modern CSS layout techniques with Grid and Flexbox for responsive designs.',
        featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
        seoTitle: 'Mastering CSS Grid and Flexbox - Layout Guide',
        seoDescription: 'Master modern CSS layout techniques with Grid and Flexbox for responsive designs.',
        seoKeywords: ['css', 'grid', 'flexbox', 'layout', 'responsive'],
        categories: ['CSS', 'Frontend', 'Layout'],
        tags: ['css', 'grid', 'flexbox', 'layout', 'responsive'],
        publishedAt: '2024-01-11T11:45:00Z',
        updatedAt: '2024-01-11T11:45:00Z',
        readingTime: 10,
        wordCount: 1500,
        authorName: 'David Brown',
        author: 'david-brown',
        status: 'published'
    },
    {
        id: '6',
        title: 'Node.js Performance Optimization',
        slug: 'nodejs-performance-optimization',
        content: 'Optimizing Node.js applications for better performance...',
        excerpt: 'Learn techniques to optimize your Node.js applications for better performance and scalability.',
        featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
        seoTitle: 'Node.js Performance Optimization - Best Practices',
        seoDescription: 'Learn techniques to optimize your Node.js applications for better performance and scalability.',
        seoKeywords: ['nodejs', 'performance', 'optimization', 'javascript'],
        categories: ['Node.js', 'Performance', 'JavaScript'],
        tags: ['nodejs', 'performance', 'optimization', 'javascript'],
        publishedAt: '2024-01-10T16:30:00Z',
        updatedAt: '2024-01-10T16:30:00Z',
        readingTime: 15,
        wordCount: 2200,
        authorName: 'Emily Davis',
        author: 'emily-davis',
        status: 'published'
    }
];
// Mock blog metadata
const mockBlogMetadata = {
    projectId: 'demo-project',
    projectName: 'Demo Blog',
    description: 'A modern blog showcasing the latest in web development, technology, and programming.',
    seoTitle: 'Demo Blog - Web Development & Technology',
    seoDescription: 'Stay updated with the latest web development trends, React tutorials, and technology insights.',
    defaultAuthor: 'Demo Author',
    language: 'en',
    timezone: 'UTC',
    postsPerPage: 12,
    totalPosts: mockBlogPosts.length
};
// Mock categories
const mockCategories = ['React', 'JavaScript', 'Next.js', 'TypeScript', 'CSS', 'Node.js', 'Web Development', 'Technology', 'Frontend', 'Performance'];
// Mock tags
const mockTags = ['react19', 'javascript', 'frontend', 'nextjs', 'typescript', 'css', 'nodejs', 'web-development', 'performance', 'optimization', 'ssr', 'responsive', 'best-practices', 'enterprise', 'future', 'trends', 'technology', 'layout', 'grid', 'flexbox'];
// Generate mock pagination
function generateMockPagination(page, limit, total) {
    const pages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        pages
    };
}
// Generate mock blog posts response
function generateMockBlogPostsResponse(page = 1, limit = 12, search, category, tag) {
    let filteredPosts = [...mockBlogPosts];
    // Filter by search query
    if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = filteredPosts.filter(post => {
            var _a, _b;
            return post.title.toLowerCase().includes(searchLower) ||
                ((_a = post.excerpt) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower)) ||
                post.content.toLowerCase().includes(searchLower) ||
                ((_b = post.tags) === null || _b === void 0 ? void 0 : _b.some(tag => tag.toLowerCase().includes(searchLower)));
        });
    }
    // Filter by category
    if (category) {
        filteredPosts = filteredPosts.filter(post => { var _a; return (_a = post.categories) === null || _a === void 0 ? void 0 : _a.some(cat => cat.toLowerCase() === category.toLowerCase()); });
    }
    // Filter by tag
    if (tag) {
        filteredPosts = filteredPosts.filter(post => { var _a; return (_a = post.tags) === null || _a === void 0 ? void 0 : _a.some(t => t.toLowerCase() === tag.toLowerCase()); });
    }
    // Sort by published date (newest first)
    filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    return {
        posts: paginatedPosts,
        pagination: generateMockPagination(page, limit, filteredPosts.length)
    };
}
// Generate mock metadata response
function generateMockMetadataResponse() {
    return {
        metadata: mockBlogMetadata
    };
}
// Generate mock categories response
function generateMockCategoriesResponse() {
    return {
        categories: mockCategories
    };
}
// Generate mock tags response
function generateMockTagsResponse() {
    return {
        tags: mockTags
    };
}

class GEOPilotAPI {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        // Intelligent API URL resolution with fallbacks
        const apiUrl = this.resolveApiUrl(config.apiUrl);
        this.client = axios.create({
            baseURL: apiUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'X-Project-ID': config.projectId,
                'X-Secret-Key': config.secretKey,
                ...(config.apiKey && { 'X-API-Key': config.apiKey }) // Legacy support
            }
        });
        // Request interceptor
        this.client.interceptors.request.use((config) => {
            // Add language header if specified
            if (this.config.language) {
                config.headers['Accept-Language'] = this.config.language;
            }
            // Add timezone header if specified
            if (this.config.timezone) {
                config.headers['X-Timezone'] = this.config.timezone;
            }
            return config;
        }, (error) => Promise.reject(error));
        // Response interceptor
        this.client.interceptors.response.use((response) => response, (error) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const message = ((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) || error.message;
            const code = (_f = (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code;
            const statusCode = (_g = error.response) === null || _g === void 0 ? void 0 : _g.status;
            throw new GEOPilotError(message, code, statusCode);
        });
    }
    /**
     * Intelligently resolve API URL with fallbacks for common hosting scenarios
     */
    resolveApiUrl(providedUrl) {
        // If URL is explicitly provided, use it
        if (providedUrl) {
            return providedUrl.endsWith('/') ? providedUrl.slice(0, -1) : providedUrl;
        }
        // Environment-based defaults
        if (typeof window !== 'undefined') {
            // Browser environment
            const origin = window.location.origin;
            // Vercel deployment detection
            if (origin.includes('.vercel.app')) {
                return `${origin}/api`;
            }
            // Railway deployment detection
            if (origin.includes('.railway.app')) {
                return `${origin}/api`;
            }
            // Heroku deployment detection
            if (origin.includes('.herokuapp.com')) {
                return `${origin}/api`;
            }
            // Netlify deployment detection
            if (origin.includes('.netlify.app')) {
                return `${origin}/.netlify/functions`;
            }
            // Custom domain with common patterns
            if (origin.includes('.') && !origin.includes('localhost')) {
                return `${origin}/api`;
            }
        }
        // Development fallback - check if we're on localhost
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            return 'http://localhost:3001/api';
        }
        // Production fallback - use the live backend
        return 'https://geopilotbackend.vercel.app/api';
    }
    /**
     * Get cache key for request
     */
    getCacheKey(endpoint, params) {
        const paramString = params ? JSON.stringify(params) : '';
        return `${endpoint}:${paramString}`;
    }
    /**
     * Get data from cache if valid
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
    /**
     * Store data in cache
     */
    setCache(key, data, ttl = 300000) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }
    /**
     * Make cached GET request
     */
    async cachedGet(endpoint, params, ttl, forceRefresh = false) {
        var _a, _b;
        const cacheKey = this.getCacheKey(endpoint, params);
        if (!forceRefresh) {
            const cached = this.getFromCache(cacheKey);
            if (cached)
                return cached;
        }
        try {
            const response = await this.client.get(endpoint, { params });
            if (!response.data.success) {
                throw new GEOPilotError(((_a = response.data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Request failed', (_b = response.data.error) === null || _b === void 0 ? void 0 : _b.code);
            }
            this.setCache(cacheKey, response.data.data, ttl);
            return response.data.data;
        }
        catch (error) {
            // For demo credentials only, use mock data as fallback
            if (this.shouldUseMockData(endpoint)) {
                console.warn(`API request failed for ${endpoint}, using mock data:`, error);
                return this.getMockData(endpoint, params);
            }
            // For real API credentials, throw the error so the UI can handle it
            throw error;
        }
    }
    /**
     * Get published blog posts for the project
     */
    async getBlogPosts(options = {}) {
        const { page = 1, limit = 10, category, tag, search, orderBy = 'publishedAt', orderDirection = 'desc', forceRefresh = false } = options;
        const params = {
            page,
            limit,
            orderBy,
            orderDirection,
            ...(category && { category }),
            ...(tag && { tag }),
            ...(search && { search })
        };
        return this.cachedGet(`/public/projects/${this.config.projectId}/posts`, params, 300000, // 5 minutes cache
        forceRefresh);
    }
    /**
     * Get single blog post by slug
     */
    async getBlogPostBySlug(slug, forceRefresh = false) {
        return this.cachedGet(`/public/projects/${this.config.projectId}/posts/${slug}`, undefined, 600000, // 10 minutes cache
        forceRefresh);
    }
    /**
     * Get single blog post by ID
     */
    async getBlogPostById(postId, forceRefresh = false) {
        return this.cachedGet(`/public/posts/${postId}`, undefined, 600000, // 10 minutes cache
        forceRefresh);
    }
    /**
     * Get blog metadata
     */
    async getBlogMetadata(forceRefresh = false) {
        return this.cachedGet(`/public/projects/${this.config.projectId}/metadata`, undefined, 1800000, // 30 minutes cache
        forceRefresh);
    }
    /**
     * Get blog categories
     */
    async getBlogCategories(forceRefresh = false) {
        return this.cachedGet(`/public/projects/${this.config.projectId}/categories`, undefined, 900000, // 15 minutes cache
        forceRefresh);
    }
    /**
     * Get blog tags
     */
    async getBlogTags(forceRefresh = false) {
        return this.cachedGet(`/public/projects/${this.config.projectId}/tags`, undefined, 900000, // 15 minutes cache
        forceRefresh);
    }
    /**
     * Get related posts for a specific post
     */
    async getRelatedPosts(postId, limit = 3, forceRefresh = false) {
        return this.cachedGet(`/public/projects/${this.config.projectId}/posts/${postId}/related`, { limit }, 600000, // 10 minutes cache
        forceRefresh);
    }
    /**
     * Search blog posts
     */
    async searchBlogPosts(query, options = {}) {
        const { page = 1, limit = 10, filters, forceRefresh = false } = options;
        const params = {
            q: query,
            page,
            limit,
            ...((filters === null || filters === void 0 ? void 0 : filters.category) && { category: filters.category }),
            ...((filters === null || filters === void 0 ? void 0 : filters.tag) && { tag: filters.tag }),
            ...((filters === null || filters === void 0 ? void 0 : filters.author) && { author: filters.author }),
            ...((filters === null || filters === void 0 ? void 0 : filters.dateFrom) && { dateFrom: filters.dateFrom }),
            ...((filters === null || filters === void 0 ? void 0 : filters.dateTo) && { dateTo: filters.dateTo }),
            ...((filters === null || filters === void 0 ? void 0 : filters.sortBy) && { sortBy: filters.sortBy }),
            ...((filters === null || filters === void 0 ? void 0 : filters.sortOrder) && { sortOrder: filters.sortOrder })
        };
        return this.cachedGet(`/public/projects/${this.config.projectId}/search`, params, 60000, // 1 minute cache for search results
        forceRefresh);
    }
    /**
     * Get recent blog posts
     */
    async getRecentBlogPosts(limit = 5, forceRefresh = false) {
        return this.cachedGet(`/public/projects/${this.config.projectId}/recent`, { limit }, 300000, // 5 minutes cache
        forceRefresh);
    }
    /**
     * Get posts by category
     */
    async getPostsByCategory(category, options = {}) {
        const { page = 1, limit = 10, forceRefresh = false } = options;
        return this.cachedGet(`/public/projects/${this.config.projectId}/categories/${encodeURIComponent(category)}/posts`, { page, limit }, 300000, // 5 minutes cache
        forceRefresh);
    }
    /**
     * Get posts by tag
     */
    async getPostsByTag(tag, options = {}) {
        const { page = 1, limit = 10, forceRefresh = false } = options;
        return this.cachedGet(`/public/projects/${this.config.projectId}/tags/${encodeURIComponent(tag)}/posts`, { page, limit }, 300000, // 5 minutes cache
        forceRefresh);
    }
    /**
     * Track page view for analytics
     */
    async trackPageView(postId, analyticsData) {
        try {
            // Safely access browser APIs that might not be available
            const userAgent = (analyticsData === null || analyticsData === void 0 ? void 0 : analyticsData.userAgent) || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
            const referrer = (analyticsData === null || analyticsData === void 0 ? void 0 : analyticsData.referrer) || (typeof document !== 'undefined' ? document.referrer : '');
            await this.client.post(`/public/posts/${postId}/view`, {
                userAgent,
                referrer,
                sessionId: (analyticsData === null || analyticsData === void 0 ? void 0 : analyticsData.sessionId) || this.generateSessionId(),
                country: analyticsData === null || analyticsData === void 0 ? void 0 : analyticsData.country,
                region: analyticsData === null || analyticsData === void 0 ? void 0 : analyticsData.region,
                city: analyticsData === null || analyticsData === void 0 ? void 0 : analyticsData.city
            });
        }
        catch (error) {
            // Analytics tracking should not break the app
            console.warn('Failed to track page view:', error);
        }
    }
    /**
     * Track custom analytics event
     */
    async trackEvent(event) {
        if (!this.config.enableAnalytics)
            return;
        try {
            await this.client.post('/public/analytics/event', {
                ...event,
                projectId: this.config.projectId,
                timestamp: event.timestamp || new Date().toISOString()
            });
        }
        catch (error) {
            console.warn('Failed to track event:', error);
        }
    }
    /**
     * Get RSS feed URL
     */
    getRSSFeedUrl() {
        const baseUrl = this.client.defaults.baseURL || 'https://geopilotbackend.vercel.app/api';
        return `${baseUrl}/public/projects/${this.config.projectId}/rss`;
    }
    /**
     * Get sitemap URL
     */
    getSitemapUrl() {
        const baseUrl = this.client.defaults.baseURL || 'https://geopilotbackend.vercel.app/api';
        return `${baseUrl}/public/projects/${this.config.projectId}/sitemap`;
    }
    /**
     * Get blog design configuration for public preview
     */
    async getBlogDesignConfig(forceRefresh = false) {
        return this.cachedGet(`/blog-design/${this.config.projectId}/public-preview`, undefined, 300000, // 5 minutes cache
        forceRefresh);
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Generate session ID
     */
    generateSessionId() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        // Update client base URL if changed
        if (newConfig.apiUrl) {
            this.client.defaults.baseURL = newConfig.apiUrl;
        }
        // Update headers if project ID or secret key changed
        if (newConfig.projectId) {
            this.client.defaults.headers['X-Project-ID'] = newConfig.projectId;
        }
        if (newConfig.secretKey) {
            this.client.defaults.headers['X-Secret-Key'] = newConfig.secretKey;
        }
        // Update legacy API key if provided
        if (newConfig.apiKey) {
            this.client.defaults.headers['X-API-Key'] = newConfig.apiKey;
        }
        // Clear cache when config changes
        this.clearCache();
    }
    /**
     * Health check
     */
    async healthCheck() {
        try {
            await this.client.get('/health');
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get the resolved API base URL
     */
    getBaseUrl() {
        return this.client.defaults.baseURL || 'https://geopilotbackend.vercel.app/api';
    }
    /**
     * Check if we should use mock data for this endpoint (demo mode)
     */
    shouldUseMockData(endpoint) {
        // Only use mock data for demo credentials, not for real API credentials
        const isDemoCredentials = this.config.projectId === 'demo-project';
        // Use mock data only for demo credentials, not for real API
        return isDemoCredentials;
    }
    /**
     * Check if this is a critical endpoint that should always work (even with mock data)
     */
    isCriticalEndpoint(endpoint) {
        // Always provide mock data for these critical endpoints to ensure the UI works
        return endpoint.includes('/posts') ||
            endpoint.includes('/metadata') ||
            endpoint.includes('/categories') ||
            endpoint.includes('/tags') ||
            endpoint.includes('/search') ||
            endpoint.includes('/design');
    }
    /**
     * Get mock data for the given endpoint
     */
    getMockData(endpoint, params) {
        // Extract parameters
        const page = (params === null || params === void 0 ? void 0 : params.page) || 1;
        const limit = (params === null || params === void 0 ? void 0 : params.limit) || 10;
        const category = params === null || params === void 0 ? void 0 : params.category;
        const tag = params === null || params === void 0 ? void 0 : params.tag;
        const search = params === null || params === void 0 ? void 0 : params.search;
        // Return mock data based on endpoint
        if (endpoint.includes('/posts')) {
            return generateMockBlogPostsResponse(page, limit, search, category, tag);
        }
        if (endpoint.includes('/metadata')) {
            return generateMockMetadataResponse();
        }
        if (endpoint.includes('/categories')) {
            return generateMockCategoriesResponse();
        }
        if (endpoint.includes('/tags')) {
            return generateMockTagsResponse();
        }
        if (endpoint.includes('/search')) {
            return generateMockBlogPostsResponse(page, limit, search, category, tag);
        }
        // Default fallback
        return generateMockBlogPostsResponse(page, limit);
    }
}

// Create context with proper default values for React 18
const GEOPilotContext = React.createContext(null);
function useGEOPilot() {
    const context = React.useContext(GEOPilotContext);
    if (!context) {
        throw new Error('useGEOPilot must be used within a GEOPilotProvider');
    }
    return context;
}

/**
 * Merges static theme configuration with dynamic design configuration
 * Dynamic design takes precedence over static theme
 */
function mergeThemeConfig(staticConfig, dynamicDesign) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
    if (!dynamicDesign) {
        return staticConfig;
    }
    const mergedTheme = {
        // Start with static theme config
        ...staticConfig.theme,
        // Override with dynamic design theme
        primaryColor: ((_b = (_a = dynamicDesign.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || ((_c = staticConfig.theme) === null || _c === void 0 ? void 0 : _c.primaryColor),
        secondaryColor: ((_e = (_d = dynamicDesign.theme) === null || _d === void 0 ? void 0 : _d.customColors) === null || _e === void 0 ? void 0 : _e.secondary) || ((_f = staticConfig.theme) === null || _f === void 0 ? void 0 : _f.secondaryColor),
        fontFamily: ((_g = dynamicDesign.typography) === null || _g === void 0 ? void 0 : _g.fontFamily) || ((_h = staticConfig.theme) === null || _h === void 0 ? void 0 : _h.fontFamily),
        layout: ((_j = dynamicDesign.layout) === null || _j === void 0 ? void 0 : _j.type) || ((_k = staticConfig.theme) === null || _k === void 0 ? void 0 : _k.layout),
        // Component visibility settings
        showAuthor: (_o = (_m = (_l = dynamicDesign.components) === null || _l === void 0 ? void 0 : _l.blogCard) === null || _m === void 0 ? void 0 : _m.showAuthor) !== null && _o !== void 0 ? _o : (_p = staticConfig.theme) === null || _p === void 0 ? void 0 : _p.showAuthor,
        showDate: (_s = (_r = (_q = dynamicDesign.components) === null || _q === void 0 ? void 0 : _q.blogCard) === null || _r === void 0 ? void 0 : _r.showDate) !== null && _s !== void 0 ? _s : (_t = staticConfig.theme) === null || _t === void 0 ? void 0 : _t.showDate,
        showReadingTime: (_w = (_v = (_u = dynamicDesign.components) === null || _u === void 0 ? void 0 : _u.blogCard) === null || _v === void 0 ? void 0 : _v.showReadingTime) !== null && _w !== void 0 ? _w : (_x = staticConfig.theme) === null || _x === void 0 ? void 0 : _x.showReadingTime,
        showCategories: (_0 = (_z = (_y = dynamicDesign.components) === null || _y === void 0 ? void 0 : _y.blogCard) === null || _z === void 0 ? void 0 : _z.showCategories) !== null && _0 !== void 0 ? _0 : (_1 = staticConfig.theme) === null || _1 === void 0 ? void 0 : _1.showCategories,
        showTags: (_4 = (_3 = (_2 = dynamicDesign.components) === null || _2 === void 0 ? void 0 : _2.blogCard) === null || _3 === void 0 ? void 0 : _3.showTags) !== null && _4 !== void 0 ? _4 : (_5 = staticConfig.theme) === null || _5 === void 0 ? void 0 : _5.showTags,
        showExcerpt: (_8 = (_7 = (_6 = dynamicDesign.components) === null || _6 === void 0 ? void 0 : _6.blogCard) === null || _7 === void 0 ? void 0 : _7.showExcerpt) !== null && _8 !== void 0 ? _8 : (_9 = staticConfig.theme) === null || _9 === void 0 ? void 0 : _9.showExcerpt,
        showFeaturedImage: (_12 = (_11 = (_10 = dynamicDesign.components) === null || _10 === void 0 ? void 0 : _10.blogCard) === null || _11 === void 0 ? void 0 : _11.showImage) !== null && _12 !== void 0 ? _12 : (_13 = staticConfig.theme) === null || _13 === void 0 ? void 0 : _13.showFeaturedImage,
        // Custom CSS from dynamic design
        customCSS: dynamicDesign.customCSS || ((_14 = staticConfig.theme) === null || _14 === void 0 ? void 0 : _14.customCSS),
    };
    return {
        ...staticConfig,
        theme: mergedTheme,
        design: dynamicDesign
    };
}
/**
 * Gets CSS custom properties from design configuration
 */
function getCSSVariables(design) {
    var _a;
    if (!((_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors)) {
        return {};
    }
    const colors = design.theme.customColors;
    const vars = {
        '--primary-color': colors.primary,
        '--background-color': colors.background,
        '--text-color': colors.text,
        '--heading-color': colors.heading || colors.text,
    };
    // Include optional extras when present for backward compatibility
    if (colors.secondary)
        vars['--secondary-color'] = colors.secondary;
    if (colors.accent)
        vars['--accent-color'] = colors.accent;
    if (colors.surface)
        vars['--surface-color'] = colors.surface;
    if (colors.textSecondary)
        vars['--text-secondary-color'] = colors.textSecondary;
    if (colors.border)
        vars['--border-color'] = colors.border;
    if (colors.success)
        vars['--success-color'] = colors.success;
    if (colors.warning)
        vars['--warning-color'] = colors.warning;
    if (colors.error)
        vars['--error-color'] = colors.error;
    return vars;
}
/**
 * Gets font family CSS from typography configuration
 */
function getFontFamilyCSS(design) {
    if (!(design === null || design === void 0 ? void 0 : design.typography)) {
        return 'Inter, system-ui, sans-serif';
    }
    const { fontFamily, headingFont, bodyFont } = design.typography;
    // Map font values to actual CSS font families
    const fontMap = {
        'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'inter': 'var(--font-inter), Inter, sans-serif',
        'roboto': 'var(--font-roboto), Roboto, sans-serif',
        'open-sans': 'var(--font-open-sans), "Open Sans", sans-serif',
        'lato': 'var(--font-lato), Lato, sans-serif',
        'montserrat': 'var(--font-montserrat), Montserrat, sans-serif',
        'playfair': 'var(--font-playfair), "Playfair Display", serif',
        'merriweather': 'var(--font-merriweather), Merriweather, serif',
        'fira-code': 'var(--font-fira-code), "Fira Code", monospace',
        'poppins': 'var(--font-poppins), Poppins, sans-serif',
        'nunito': 'var(--font-nunito), Nunito, sans-serif',
        'raleway': 'var(--font-raleway), Raleway, sans-serif',
        'oswald': 'var(--font-oswald), Oswald, sans-serif',
        'lora': 'var(--font-lora), Lora, serif',
        'crimson-text': 'var(--font-crimson-text), "Crimson Text", serif',
        'libre-baskerville': 'var(--font-libre-baskerville), "Libre Baskerville", serif',
        'source-code-pro': 'var(--font-source-code-pro), "Source Code Pro", monospace',
        'jetbrains-mono': 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
        'work-sans': 'var(--font-work-sans), "Work Sans", sans-serif',
        'georgia': 'Georgia, serif',
        'times-new-roman': '"Times New Roman", serif',
        'arial': 'Arial, sans-serif',
        'helvetica': 'Helvetica, sans-serif',
        'verdana': 'Verdana, sans-serif',
        'trebuchet-ms': '"Trebuchet MS", sans-serif',
        'courier-new': '"Courier New", monospace',
        'impact': 'Impact, sans-serif',
        'comic-sans': '"Comic Sans MS", cursive',
        'papyrus': 'Papyrus, fantasy'
    };
    // Use specific fonts if available, otherwise fallback to general fontFamily
    const headingFontFamily = fontMap[headingFont] || fontMap[fontFamily] || 'Inter, system-ui, sans-serif';
    const bodyFontFamily = fontMap[bodyFont] || fontMap[fontFamily] || 'Inter, system-ui, sans-serif';
    return `${headingFontFamily}, ${bodyFontFamily}`;
}
/**
 * Gets heading font family CSS from typography configuration
 */
function getHeadingFontFamilyCSS(design) {
    if (!(design === null || design === void 0 ? void 0 : design.typography)) {
        return 'Inter, system-ui, sans-serif';
    }
    const { fontFamily, headingFont } = design.typography;
    // Map font values to actual CSS font families
    const fontMap = {
        'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'inter': 'var(--font-inter), Inter, sans-serif',
        'roboto': 'var(--font-roboto), Roboto, sans-serif',
        'open-sans': 'var(--font-open-sans), "Open Sans", sans-serif',
        'lato': 'var(--font-lato), Lato, sans-serif',
        'montserrat': 'var(--font-montserrat), Montserrat, sans-serif',
        'playfair': 'var(--font-playfair), "Playfair Display", serif',
        'merriweather': 'var(--font-merriweather), Merriweather, serif',
        'fira-code': 'var(--font-fira-code), "Fira Code", monospace',
        'poppins': 'var(--font-poppins), Poppins, sans-serif',
        'nunito': 'var(--font-nunito), Nunito, sans-serif',
        'raleway': 'var(--font-raleway), Raleway, sans-serif',
        'oswald': 'var(--font-oswald), Oswald, sans-serif',
        'lora': 'var(--font-lora), Lora, serif',
        'crimson-text': 'var(--font-crimson-text), "Crimson Text", serif',
        'libre-baskerville': 'var(--font-libre-baskerville), "Libre Baskerville", serif',
        'source-code-pro': 'var(--font-source-code-pro), "Source Code Pro", monospace',
        'jetbrains-mono': 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
        'work-sans': 'var(--font-work-sans), "Work Sans", sans-serif',
        'georgia': 'Georgia, serif',
        'times-new-roman': '"Times New Roman", serif',
        'arial': 'Arial, sans-serif',
        'helvetica': 'Helvetica, sans-serif',
        'verdana': 'Verdana, sans-serif',
        'trebuchet-ms': '"Trebuchet MS", sans-serif',
        'courier-new': '"Courier New", monospace',
        'impact': 'Impact, sans-serif',
        'comic-sans': '"Comic Sans MS", cursive',
        'papyrus': 'Papyrus, fantasy'
    };
    return fontMap[headingFont] || fontMap[fontFamily] || 'Inter, system-ui, sans-serif';
}
/**
 * Gets body font family CSS from typography configuration
 */
function getBodyFontFamilyCSS(design) {
    if (!(design === null || design === void 0 ? void 0 : design.typography)) {
        return 'Inter, system-ui, sans-serif';
    }
    const { fontFamily, bodyFont } = design.typography;
    // Map font values to actual CSS font families
    const fontMap = {
        'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'inter': 'var(--font-inter), Inter, sans-serif',
        'roboto': 'var(--font-roboto), Roboto, sans-serif',
        'open-sans': 'var(--font-open-sans), "Open Sans", sans-serif',
        'lato': 'var(--font-lato), Lato, sans-serif',
        'montserrat': 'var(--font-montserrat), Montserrat, sans-serif',
        'playfair': 'var(--font-playfair), "Playfair Display", serif',
        'merriweather': 'var(--font-merriweather), Merriweather, serif',
        'fira-code': 'var(--font-fira-code), "Fira Code", monospace',
        'poppins': 'var(--font-poppins), Poppins, sans-serif',
        'nunito': 'var(--font-nunito), Nunito, sans-serif',
        'raleway': 'var(--font-raleway), Raleway, sans-serif',
        'oswald': 'var(--font-oswald), Oswald, sans-serif',
        'lora': 'var(--font-lora), Lora, serif',
        'crimson-text': 'var(--font-crimson-text), "Crimson Text", serif',
        'libre-baskerville': 'var(--font-libre-baskerville), "Libre Baskerville", serif',
        'source-code-pro': 'var(--font-source-code-pro), "Source Code Pro", monospace',
        'jetbrains-mono': 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
        'work-sans': 'var(--font-work-sans), "Work Sans", sans-serif',
        'georgia': 'Georgia, serif',
        'times-new-roman': '"Times New Roman", serif',
        'arial': 'Arial, sans-serif',
        'helvetica': 'Helvetica, sans-serif',
        'verdana': 'Verdana, sans-serif',
        'trebuchet-ms': '"Trebuchet MS", sans-serif',
        'courier-new': '"Courier New", monospace',
        'impact': 'Impact, sans-serif',
        'comic-sans': '"Comic Sans MS", cursive',
        'papyrus': 'Papyrus, fantasy'
    };
    return fontMap[bodyFont] || fontMap[fontFamily] || 'Inter, system-ui, sans-serif';
}
/**
 * Gets responsive layout classes based on design configuration
 */
function getLayoutClasses$1(design) {
    if (!(design === null || design === void 0 ? void 0 : design.layout)) {
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
    const { type, columns, spacing } = design.layout;
    const spacingClasses = {
        xs: 'gap-2',
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
        xl: 'gap-12'
    };
    const columnClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
    };
    switch (type) {
        case 'list':
            return 'space-y-6';
        case 'masonry':
            return `columns-1 md:columns-2 lg:columns-${Math.min(columns, 3)} ${spacingClasses[spacing]}`;
        case 'mosaic':
            return `grid ${columnClasses[columns] || columnClasses[3]} ${spacingClasses[spacing]}`;
        case 'grid':
        default:
            return `grid ${columnClasses[columns] || columnClasses[3]} ${spacingClasses[spacing]}`;
    }
}
/**
 * Gets component visibility settings
 */
function getComponentSettings(design, component = 'blogCard') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (!(design === null || design === void 0 ? void 0 : design.components)) {
        return {
            showAuthor: true,
            showDate: true,
            showReadingTime: true,
            showCategories: true,
            showTags: true,
            showExcerpt: true,
            showFeaturedImage: true,
            showShareButtons: true,
            showRelatedPosts: true
        };
    }
    const componentConfig = design.components[component];
    if (!componentConfig) {
        return {
            showAuthor: true,
            showDate: true,
            showReadingTime: true,
            showCategories: true,
            showTags: true,
            showExcerpt: true,
            showFeaturedImage: true,
            showShareButtons: true,
            showRelatedPosts: true
        };
    }
    // Handle different component types
    if (component === 'blogCard') {
        const blogCardConfig = componentConfig; // Type assertion for blog card config
        return {
            showAuthor: (_a = blogCardConfig.showAuthor) !== null && _a !== void 0 ? _a : true,
            showDate: (_b = blogCardConfig.showDate) !== null && _b !== void 0 ? _b : true,
            showReadingTime: (_c = blogCardConfig.showReadingTime) !== null && _c !== void 0 ? _c : true,
            showCategories: (_d = blogCardConfig.showCategories) !== null && _d !== void 0 ? _d : true,
            showTags: (_e = blogCardConfig.showTags) !== null && _e !== void 0 ? _e : true,
            showExcerpt: (_f = blogCardConfig.showExcerpt) !== null && _f !== void 0 ? _f : true,
            showFeaturedImage: (_g = blogCardConfig.showImage) !== null && _g !== void 0 ? _g : true,
            showShareButtons: true, // Not applicable for blog cards
            showRelatedPosts: true // Not applicable for blog cards
        };
    }
    else {
        const blogPostConfig = componentConfig; // Type assertion for blog post config
        return {
            showAuthor: (_h = blogPostConfig.showAuthor) !== null && _h !== void 0 ? _h : true,
            showDate: (_j = blogPostConfig.showDate) !== null && _j !== void 0 ? _j : true,
            showReadingTime: (_k = blogPostConfig.showReadingTime) !== null && _k !== void 0 ? _k : true,
            showCategories: true, // Not applicable for blog posts
            showTags: true, // Not applicable for blog posts
            showExcerpt: true, // Not applicable for blog posts
            showFeaturedImage: true, // Not applicable for blog posts
            showShareButtons: (_l = blogPostConfig.showShareButtons) !== null && _l !== void 0 ? _l : true,
            showRelatedPosts: (_m = blogPostConfig.showRelatedPosts) !== null && _m !== void 0 ? _m : true
        };
    }
}
/**
 * Applies design configuration to a component's style
 */
function applyDesignStyles(design, baseStyles = {}) {
    var _a;
    const cssVariables = getCSSVariables(design);
    const fontFamily = getFontFamilyCSS(design);
    return {
        ...baseStyles,
        ...cssVariables,
        fontFamily,
        // Apply max width from layout if specified
        maxWidth: ((_a = design === null || design === void 0 ? void 0 : design.layout) === null || _a === void 0 ? void 0 : _a.maxWidth) || baseStyles.maxWidth,
    };
}
/**
 * Applies heading font styles from design configuration
 */
function applyHeadingFontStyles(design, baseStyles = {}) {
    var _a;
    const cssVariables = getCSSVariables(design);
    const headingFontFamily = getHeadingFontFamilyCSS(design);
    return {
        ...baseStyles,
        ...cssVariables,
        fontFamily: headingFontFamily,
        // Apply max width from layout if specified
        maxWidth: ((_a = design === null || design === void 0 ? void 0 : design.layout) === null || _a === void 0 ? void 0 : _a.maxWidth) || baseStyles.maxWidth,
    };
}
/**
 * Applies body font styles from design configuration
 */
function applyBodyFontStyles(design, baseStyles = {}) {
    var _a;
    const cssVariables = getCSSVariables(design);
    const bodyFontFamily = getBodyFontFamilyCSS(design);
    return {
        ...baseStyles,
        ...cssVariables,
        fontFamily: bodyFontFamily,
        // Apply max width from layout if specified
        maxWidth: ((_a = design === null || design === void 0 ? void 0 : design.layout) === null || _a === void 0 ? void 0 : _a.maxWidth) || baseStyles.maxWidth,
    };
}

function GEOPilotProvider({ config, children }) {
    const [isClient, setIsClient] = React.useState(false);
    const [api, setApi] = React.useState(null);
    const [apiReady, setApiReady] = React.useState(false);
    const [currentConfig, setCurrentConfig] = React.useState(config);
    const [design, setDesign] = React.useState(null);
    const [designLoading, setDesignLoading] = React.useState(true);
    const [designError, setDesignError] = React.useState(null);
    // SSR safety check
    React.useEffect(() => {
        setIsClient(true);
    }, []);
    // Initialize API first (only on client side)
    React.useEffect(() => {
        if (!isClient)
            return;
        const apiInstance = new GEOPilotAPI(currentConfig);
        setApi(apiInstance);
        setApiReady(true);
    }, [currentConfig, isClient]);
    // Fetch design configuration after API is initialized (only on client side)
    React.useEffect(() => {
        if (!isClient || !api || !currentConfig.projectId)
            return;
        const fetchDesign = async () => {
            var _a;
            try {
                setDesignLoading(true);
                setDesignError(null);
                // Check localStorage first for real-time updates
                const cachedDesign = localStorage.getItem(`blog-design-${currentConfig.projectId}`);
                if (cachedDesign) {
                    try {
                        const parsedDesign = JSON.parse(cachedDesign);
                        setDesign(parsedDesign);
                        setDesignLoading(false);
                        return;
                    }
                    catch (error) {
                        console.warn('Error parsing cached design:', error);
                    }
                }
                // Fetch design configuration from the backend using the public preview endpoint
                const baseUrl = api.getBaseUrl();
                const response = await fetch(`${baseUrl}/blog-design/${currentConfig.projectId}/public-preview`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch design: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && ((_a = result.data) === null || _a === void 0 ? void 0 : _a.design)) {
                    setDesign(result.data.design);
                    // Cache the design in localStorage
                    localStorage.setItem(`blog-design-${currentConfig.projectId}`, JSON.stringify(result.data.design));
                }
                else {
                    // Set minimal design configuration if none exists
                    const minimalDesign = {
                        theme: {
                            id: 'minimal',
                            name: 'Minimal',
                            colorScheme: 'light',
                            customColors: {
                                primary: '#3B82F6',
                                secondary: '#6B7280',
                                accent: '#10B981',
                                background: '#FFFFFF',
                                surface: '#F9FAFB',
                                text: '#111827',
                                heading: '#111827',
                                textSecondary: '#6B7280',
                                border: '#E5E7EB',
                                success: '#10B981',
                                warning: '#F59E0B',
                                error: '#EF4444'
                            }
                        },
                        layout: {
                            type: 'grid',
                            columns: 1,
                            spacing: 'md',
                            maxWidth: '1200px',
                            showSidebar: false,
                            sidebarPosition: 'right'
                        },
                        typography: {
                            fontFamily: 'inter',
                            headingFont: 'inter',
                            bodyFont: 'inter'
                        },
                        components: {
                            blogCard: {
                                style: 'card',
                                showImage: true,
                                showAuthor: true,
                                showDate: true,
                                showExcerpt: true,
                                showReadingTime: true,
                                showCategories: true,
                                showTags: true
                            },
                            blogPost: {
                                showAuthor: true,
                                showDate: true,
                                showReadingTime: true,
                                showShareButtons: true,
                                showRelatedPosts: true
                            }
                        },
                        ctaButtons: [],
                        blogSettings: {
                            audioReader: {
                                enabled: false,
                                voice: 'auto',
                                speed: 1.0,
                                autoPlay: false
                            },
                            sideSection: {
                                enabled: true,
                                showTableOfContents: true,
                                showRelatedPosts: true,
                                showSocialShare: true,
                                showAuthorBio: true,
                                showTags: true,
                                showCategories: true
                            },
                            readingExperience: {
                                showProgressBar: true,
                                enableDarkMode: true,
                                fontSize: 'medium',
                                lineHeight: 'normal',
                                maxWidth: 'medium'
                            },
                            seo: {
                                showMetaDescription: true,
                                showSchemaMarkup: true,
                                showOpenGraph: true,
                                showTwitterCards: true,
                                enableBreadcrumbs: true
                            },
                            social: {
                                showShareButtons: true,
                                showSocialProof: false,
                                showComments: false,
                                enableNewsletterSignup: false
                            },
                            branding: {
                                showPoweredBy: true
                            }
                        }
                    };
                    setDesign(minimalDesign);
                    localStorage.setItem(`blog-design-${currentConfig.projectId}`, JSON.stringify(minimalDesign));
                }
            }
            catch (err) {
                console.error('API request failed:', err);
                setDesignError(err instanceof Error ? err.message : 'Failed to fetch design');
                // Only use minimal design fallback for demo credentials
                if (currentConfig.projectId === 'demo-project') {
                    const minimalDesign = {
                        theme: {
                            id: 'minimal',
                            name: 'Minimal',
                            colorScheme: 'light',
                            customColors: {
                                primary: '#3B82F6',
                                secondary: '#6B7280',
                                accent: '#10B981',
                                background: '#FFFFFF',
                                surface: '#F9FAFB',
                                text: '#111827',
                                heading: '#111827',
                                textSecondary: '#6B7280',
                                border: '#E5E7EB',
                                success: '#10B981',
                                warning: '#F59E0B',
                                error: '#EF4444'
                            }
                        },
                        layout: {
                            type: 'grid',
                            columns: 1,
                            spacing: 'md',
                            maxWidth: '1200px',
                            showSidebar: false,
                            sidebarPosition: 'right'
                        },
                        typography: {
                            fontFamily: 'inter',
                            headingFont: 'inter',
                            bodyFont: 'inter'
                        },
                        components: {
                            blogCard: {
                                style: 'card',
                                showImage: true,
                                showAuthor: true,
                                showDate: true,
                                showExcerpt: true,
                                showReadingTime: true,
                                showCategories: true,
                                showTags: true
                            },
                            blogPost: {
                                showAuthor: true,
                                showDate: true,
                                showReadingTime: true,
                                showShareButtons: true,
                                showRelatedPosts: true
                            }
                        },
                        ctaButtons: [],
                        blogSettings: {
                            audioReader: {
                                enabled: false,
                                voice: 'auto',
                                speed: 1.0,
                                autoPlay: false
                            },
                            sideSection: {
                                enabled: true,
                                showTableOfContents: true,
                                showRelatedPosts: true,
                                showSocialShare: true,
                                showAuthorBio: true,
                                showTags: true,
                                showCategories: true
                            },
                            readingExperience: {
                                showProgressBar: true,
                                enableDarkMode: true,
                                fontSize: 'medium',
                                lineHeight: 'normal',
                                maxWidth: 'medium'
                            },
                            seo: {
                                showMetaDescription: true,
                                showSchemaMarkup: true,
                                showOpenGraph: true,
                                showTwitterCards: true,
                                enableBreadcrumbs: true
                            },
                            social: {
                                showShareButtons: true,
                                showSocialProof: false,
                                showComments: false,
                                enableNewsletterSignup: false
                            },
                            branding: {
                                showPoweredBy: true
                            }
                        }
                    };
                    setDesign(minimalDesign);
                    localStorage.setItem(`blog-design-${currentConfig.projectId}`, JSON.stringify(minimalDesign));
                }
            }
            finally {
                setDesignLoading(false);
            }
        };
        fetchDesign();
    }, [api, currentConfig.projectId, isClient]);
    // Merge static config with dynamic design
    const mergedConfig = React.useMemo(() => {
        return mergeThemeConfig(currentConfig, design);
    }, [currentConfig, design]);
    const updateConfig = React.useCallback((newConfig) => {
        setCurrentConfig(prev => {
            const updated = { ...prev, ...newConfig };
            // Update API config if API instance exists
            if (api) {
                api.updateConfig(newConfig);
            }
            return updated;
        });
    }, [api]);
    const contextValue = {
        api,
        apiReady,
        config: mergedConfig,
        updateConfig,
        design,
        designLoading,
        designError
    };
    // Always provide context, but with safe defaults during SSR
    const safeContextValue = !isClient ? {
        api: null,
        apiReady: false,
        config: currentConfig,
        updateConfig: () => { },
        design: null,
        designLoading: true,
        designError: null
    } : contextValue;
    return (jsxRuntime.jsx(GEOPilotContext.Provider, { value: safeContextValue, children: children }));
}

function useBlogPosts(options = {}) {
    const { page = 1, limit = 10, category, tag, search, filters, autoFetch = true, enableInfiniteScroll = false } = options;
    const { api, apiReady } = useGEOPilot();
    const [posts, setPosts] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [hasMore, setHasMore] = React.useState(false);
    const abortControllerRef = React.useRef(null);
    const currentPageRef = React.useRef(page);
    const fetchPosts = React.useCallback(async (pageNum = page, append = false, forceRefresh = false) => {
        if (!api || !apiReady) {
            // Don't set error if API is not initialized yet - just return silently
            // The hook will retry when the API becomes available
            return;
        }
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        try {
            setLoading(true);
            setError(null);
            // Use dedicated search endpoint when search query is provided
            if (search && search.trim()) {
                const response = await api.searchBlogPosts(search, {
                    page: pageNum,
                    limit,
                    filters: {
                        category,
                        tag,
                        sortBy: (filters === null || filters === void 0 ? void 0 : filters.sortBy) || 'publishedAt',
                        sortOrder: (filters === null || filters === void 0 ? void 0 : filters.sortOrder) || 'desc'
                    },
                    forceRefresh
                });
                if (append && enableInfiniteScroll) {
                    setPosts(prevPosts => [...prevPosts, ...response.posts]);
                }
                else {
                    setPosts(response.posts);
                }
                setPagination(response.pagination);
                setHasMore(response.pagination.page < response.pagination.pages);
                currentPageRef.current = pageNum;
                return;
            }
            // Use regular posts endpoint for non-search requests
            const requestOptions = {
                page: pageNum,
                limit,
                category,
                tag,
                orderBy: (filters === null || filters === void 0 ? void 0 : filters.sortBy) || 'publishedAt',
                orderDirection: (filters === null || filters === void 0 ? void 0 : filters.sortOrder) || 'desc',
                forceRefresh
            };
            const response = await api.getBlogPosts(requestOptions);
            if (append && enableInfiniteScroll) {
                setPosts(prevPosts => [...prevPosts, ...response.posts]);
            }
            else {
                setPosts(response.posts);
            }
            setPagination(response.pagination);
            setHasMore(response.pagination.page < response.pagination.pages);
            currentPageRef.current = pageNum;
        }
        catch (err) {
            if (err.name !== 'AbortError') {
                console.error('API request failed:', err.message);
                setError(err.message || 'Failed to fetch blog posts');
            }
        }
        finally {
            setLoading(false);
        }
    }, [api, apiReady, page, limit, category, tag, search, filters, enableInfiniteScroll]);
    const refetch = React.useCallback(async () => {
        await fetchPosts(currentPageRef.current, false, true);
    }, [fetchPosts]);
    const loadMore = React.useCallback(async () => {
        if (!hasMore || loading)
            return;
        const nextPage = currentPageRef.current + 1;
        await fetchPosts(nextPage, true);
    }, [hasMore, loading, fetchPosts]);
    // Auto-fetch on mount and when dependencies change
    React.useEffect(() => {
        if (autoFetch && api) {
            fetchPosts(page);
        }
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [autoFetch, api, apiReady, page, limit, category, tag, search, filters === null || filters === void 0 ? void 0 : filters.sortBy, filters === null || filters === void 0 ? void 0 : filters.sortOrder]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    return {
        posts,
        pagination,
        loading,
        error,
        refetch,
        loadMore,
        hasMore
    };
}

function useBlogMetadata(options = {}) {
    const { autoFetch = true } = options;
    const { api, apiReady } = useGEOPilot();
    const [metadata, setMetadata] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const abortControllerRef = React.useRef(null);
    const fetchMetadata = React.useCallback(async (forceRefresh = false) => {
        if (!api || !apiReady) {
            // Don't set error if API is not initialized yet - just return silently
            // The hook will retry when the API becomes available
            return;
        }
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        try {
            setLoading(true);
            setError(null);
            const response = await api.getBlogMetadata(forceRefresh);
            setMetadata(response.metadata);
        }
        catch (err) {
            if (err.name !== 'AbortError') {
                console.error('API request failed:', err.message);
                setError(err.message || 'Failed to fetch blog metadata');
            }
        }
        finally {
            setLoading(false);
        }
    }, [api, apiReady]);
    const refetch = React.useCallback(async () => {
        await fetchMetadata(true);
    }, [fetchMetadata]);
    // Auto-fetch on mount
    React.useEffect(() => {
        if (autoFetch && api) {
            fetchMetadata();
        }
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [autoFetch, api, apiReady, fetchMetadata]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    return {
        metadata,
        loading,
        error,
        refetch
    };
}

function useSEO(config, post, type = 'post') {
    const [seoData, setSeoData] = React.useState({
        metaTags: {},
        structuredData: [],
        loading: true,
        error: null
    });
    React.useEffect(() => {
        if (!config.projectId) {
            setSeoData({
                metaTags: {},
                structuredData: [],
                loading: false,
                error: 'Project ID is required'
            });
            return;
        }
        fetchSEOData();
    }, [config.projectId, post === null || post === void 0 ? void 0 : post.slug, type]);
    const fetchSEOData = async () => {
        try {
            setSeoData(prev => ({ ...prev, loading: true, error: null }));
            let endpoint = '';
            const baseUrl = config.apiUrl || 'https://geopilotbackend.vercel.app/api';
            if (type === 'post' && (post === null || post === void 0 ? void 0 : post.slug)) {
                endpoint = `${baseUrl}/seo/${config.projectId}/blog/${post.slug}/complete`;
            }
            else {
                endpoint = `${baseUrl}/seo/${config.projectId}/blog/complete`;
            }
            console.log('Fetching SEO data from:', endpoint);
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                setSeoData({
                    metaTags: result.data.metaTags,
                    structuredData: result.data.structuredData || [],
                    loading: false,
                    error: null
                });
            }
            else {
                throw new Error(result.message || 'Failed to fetch SEO data');
            }
        }
        catch (error) {
            console.error('API request failed:', error);
            // Only use fallback data for demo credentials
            if (config.projectId === 'demo-project') {
                const fallbackData = generateFallbackSEO(post, config, type);
                setSeoData({
                    metaTags: fallbackData.metaTags,
                    structuredData: fallbackData.structuredData,
                    loading: false,
                    error: null
                });
            }
            else {
                setSeoData({
                    metaTags: {},
                    structuredData: [],
                    loading: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch SEO data'
                });
            }
        }
    };
    return seoData;
}
// Fallback SEO data generation
function generateFallbackSEO(post, config, type = 'post') {
    var _a;
    const baseUrl = (config === null || config === void 0 ? void 0 : config.customDomain) || (typeof window !== 'undefined' ? window.location.origin : '');
    if (type === 'post' && post) {
        return {
            metaTags: {
                title: post.seoTitle || post.title || 'Blog Post',
                description: post.seoDescription || post.excerpt || 'Read this blog post',
                keywords: post.seoKeywords || post.tags || [],
                canonical: `${baseUrl}/blog/${post.slug}`,
                ogTitle: post.seoTitle || post.title || 'Blog Post',
                ogDescription: post.seoDescription || post.excerpt || 'Read this blog post',
                ogImage: post.featuredImage || `${baseUrl}/og-image.png`,
                ogUrl: `${baseUrl}/blog/${post.slug}`,
                ogType: 'article',
                ogSiteName: 'Blog',
                ogLocale: 'en_US',
                twitterCard: 'summary_large_image',
                twitterTitle: post.seoTitle || post.title || 'Blog Post',
                twitterDescription: post.seoDescription || post.excerpt || 'Read this blog post',
                twitterImage: post.featuredImage || `${baseUrl}/og-image.png`,
                twitterSite: '@blog',
                twitterCreator: '@blog',
                articleAuthor: post.author || 'Blog Author',
                articlePublishedTime: post.publishedAt,
                articleModifiedTime: post.updatedAt,
                articleSection: ((_a = post.categories) === null || _a === void 0 ? void 0 : _a[0]) || 'Blog',
                articleTag: post.tags || [],
                robots: post.status === 'published' ? 'index, follow' : 'noindex, nofollow',
                viewport: 'width=device-width, initial-scale=1.0',
                themeColor: '#3B82F6',
                msapplicationTileColor: '#3B82F6',
                appleMobileWebAppTitle: post.title || 'Blog',
                appleMobileWebAppCapable: 'yes',
                appleMobileWebAppStatusBarStyle: 'default'
            },
            structuredData: [
                {
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: post.title,
                    description: post.excerpt,
                    image: post.featuredImage,
                    url: `${baseUrl}/blog/${post.slug}`,
                    datePublished: post.publishedAt,
                    dateModified: post.updatedAt,
                    author: {
                        '@type': 'Person',
                        name: post.author || 'Blog Author'
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'Blog',
                        logo: {
                            '@type': 'ImageObject',
                            url: `${baseUrl}/logo.png`
                        }
                    }
                }
            ]
        };
    }
    else {
        return {
            metaTags: {
                title: 'Blog',
                description: 'Latest blog posts and articles',
                keywords: ['blog', 'articles', 'content'],
                canonical: `${baseUrl}/blog`,
                ogTitle: 'Blog',
                ogDescription: 'Latest blog posts and articles',
                ogImage: `${baseUrl}/og-image.png`,
                ogUrl: `${baseUrl}/blog`,
                ogType: 'website',
                ogSiteName: 'Blog',
                ogLocale: 'en_US',
                twitterCard: 'summary_large_image',
                twitterTitle: 'Blog',
                twitterDescription: 'Latest blog posts and articles',
                twitterImage: `${baseUrl}/og-image.png`,
                twitterSite: '@blog',
                twitterCreator: '@blog',
                articleAuthor: '',
                articlePublishedTime: '',
                articleModifiedTime: '',
                articleSection: '',
                articleTag: [],
                robots: 'index, follow',
                viewport: 'width=device-width, initial-scale=1.0',
                themeColor: '#3B82F6',
                msapplicationTileColor: '#3B82F6',
                appleMobileWebAppTitle: 'Blog',
                appleMobileWebAppCapable: 'yes',
                appleMobileWebAppStatusBarStyle: 'default'
            },
            structuredData: [
                {
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'Blog',
                    url: `${baseUrl}/blog`,
                    description: 'Latest blog posts and articles'
                }
            ]
        };
    }
}

function useBlogPost(options = {}) {
    const { postId, slug, autoFetch = true, trackView = true } = options;
    const { api } = useGEOPilot();
    const [post, setPost] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const abortControllerRef = React.useRef(null);
    const viewTrackedRef = React.useRef(false);
    const fetchPost = React.useCallback(async (forceRefresh = false) => {
        if (!api || (!postId && !slug)) {
            setError(!api ? 'GEO Pilot API not initialized' : 'Post ID or slug is required');
            return;
        }
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        try {
            setLoading(true);
            setError(null);
            let response;
            if (slug) {
                response = await api.getBlogPostBySlug(slug, forceRefresh);
            }
            else if (postId) {
                response = await api.getBlogPostById(postId, forceRefresh);
            }
            if (response) {
                setPost(response.post);
                // Track page view once per session
                if (trackView && !viewTrackedRef.current) {
                    try {
                        await api.trackPageView(response.post.id);
                        viewTrackedRef.current = true;
                    }
                    catch (trackError) {
                        // Don't fail the whole request if tracking fails
                        console.warn('Failed to track page view:', trackError);
                    }
                }
            }
        }
        catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Failed to fetch blog post');
                console.error('Error fetching blog post:', err);
            }
        }
        finally {
            setLoading(false);
        }
    }, [api, postId, slug, trackView]);
    const refetch = React.useCallback(async () => {
        viewTrackedRef.current = false; // Reset tracking for refetch
        await fetchPost(true);
    }, [fetchPost]);
    // Auto-fetch on mount and when dependencies change
    React.useEffect(() => {
        if (autoFetch && (postId || slug)) {
            fetchPost();
        }
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [autoFetch, postId, slug]);
    // Reset state when identifiers change
    React.useEffect(() => {
        setPost(null);
        setError(null);
        viewTrackedRef.current = false;
    }, [postId, slug]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    return {
        post,
        loading,
        error,
        refetch
    };
}

/**
 * Image optimization utilities for SEO and performance
 */
/**
 * Generate responsive image srcset for different screen sizes
 */
function generateSrcSet(baseUrl, widths = [320, 640, 768, 1024, 1280, 1536]) {
    return widths
        .map(width => `${baseUrl}?w=${width} ${width}w`)
        .join(', ');
}
/**
 * Generate responsive sizes attribute
 */
function generateSizes(breakpoints = {}) {
    const { mobile = '100vw', tablet = '50vw', desktop = '33vw', large = '25vw' } = breakpoints;
    return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1280px) ${desktop}, ${large}`;
}
/**
 * Generate optimized image configuration
 */
function createOptimizedImageConfig(src, alt, options = {}) {
    const { width = 400, height = 300, aspectRatio, loading = 'lazy', className = '', style = {}, enableResponsive = true, sizes } = options;
    // Calculate height from aspect ratio if provided
    const finalHeight = aspectRatio ? Math.round(width / aspectRatio) : height;
    const config = {
        src,
        alt,
        width,
        height: finalHeight,
        loading,
        className,
        style
    };
    // Add responsive features if enabled
    if (enableResponsive) {
        config.srcSet = generateSrcSet(src);
        config.sizes = sizes || generateSizes();
    }
    return config;
}
/**
 * Preload critical images for better performance
 */
function preloadImage(src, as = 'image') {
    if (typeof window === 'undefined')
        return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = as;
    document.head.appendChild(link);
}
/**
 * Generate WebP srcset for better compression
 */
function generateWebPSrcSet(baseUrl, widths = [320, 640, 768, 1024, 1280, 1536]) {
    return widths
        .map(width => `${baseUrl}?w=${width}&format=webp ${width}w`)
        .join(', ');
}
/**
 * Check if browser supports WebP
 */
function supportsWebP() {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(false);
            return;
        }
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}
/**
 * Get optimal image format based on browser support
 */
async function getOptimalImageFormat(baseUrl, widths = [320, 640, 768, 1024, 1280, 1536]) {
    const supportsWebPFormat = await supportsWebP();
    if (supportsWebPFormat) {
        return {
            srcSet: generateWebPSrcSet(baseUrl, widths),
            fallbackSrc: baseUrl
        };
    }
    return {
        srcSet: generateSrcSet(baseUrl, widths),
        fallbackSrc: baseUrl
    };
}

function OptimizedImage({ src, alt, width = 400, height = 300, aspectRatio, loading = 'lazy', className = '', style = {}, enableResponsive = true, sizes, enableWebP = true, preload = false, onLoad, onError }) {
    const [imageConfig, setImageConfig] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    React.useEffect(() => {
        const setupImage = async () => {
            try {
                let config;
                if (enableWebP && enableResponsive) {
                    const { srcSet, fallbackSrc } = await getOptimalImageFormat(src);
                    config = createOptimizedImageConfig(fallbackSrc, alt, {
                        width,
                        height,
                        aspectRatio,
                        loading,
                        className,
                        style,
                        enableResponsive,
                        sizes
                    });
                    config.srcSet = srcSet;
                }
                else {
                    config = createOptimizedImageConfig(src, alt, {
                        width,
                        height,
                        aspectRatio,
                        loading,
                        className,
                        style,
                        enableResponsive,
                        sizes
                    });
                }
                setImageConfig(config);
                // Preload if requested
                if (preload && loading === 'eager') {
                    preloadImage(src);
                }
            }
            catch (error) {
                console.error('Error setting up optimized image:', error);
                // Fallback to basic config
                setImageConfig(createOptimizedImageConfig(src, alt, {
                    width,
                    height,
                    aspectRatio,
                    loading,
                    className,
                    style,
                    enableResponsive: false
                }));
            }
        };
        setupImage();
    }, [src, alt, width, height, aspectRatio, loading, className, style, enableResponsive, sizes, enableWebP, preload]);
    const handleLoad = () => {
        setIsLoaded(true);
        onLoad === null || onLoad === void 0 ? void 0 : onLoad();
    };
    const handleError = () => {
        setHasError(true);
        onError === null || onError === void 0 ? void 0 : onError();
    };
    if (!imageConfig) {
        return (jsxRuntime.jsx("div", { className: `bg-gray-200 animate-pulse ${className}`, style: {
                width: `${width}px`,
                height: `${height}px`,
                aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
                ...style
            }, "aria-label": "Loading image" }));
    }
    if (hasError) {
        return (jsxRuntime.jsx("div", { className: `bg-gray-100 flex items-center justify-center ${className}`, style: {
                width: `${width}px`,
                height: `${height}px`,
                aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
                ...style
            }, role: "img", "aria-label": `Failed to load image: ${alt}`, children: jsxRuntime.jsx("svg", { className: "w-8 h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }));
    }
    return (jsxRuntime.jsx("img", { src: imageConfig.src, alt: imageConfig.alt, width: imageConfig.width, height: imageConfig.height, srcSet: imageConfig.srcSet, sizes: imageConfig.sizes, loading: imageConfig.loading, className: `${imageConfig.className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`, style: imageConfig.style, onLoad: handleLoad, onError: handleError, decoding: "async" }));
}

function BlogSiteHeader({ websiteName = "Website's Blog", blogHomeUrl = "/", mainWebsiteUrl = "/", logoUrl, navigationItems = [], className = '', style }) {
    var _a, _b, _c, _d;
    const { design } = useGEOPilot();
    const headerClasses = React.useMemo(() => {
        return `
      auto-blogify-site-header
      bg-white
      border-b
      border-gray-200
      sticky
      top-0
      z-50
      ${className}
    `.trim().replace(/\s+/g, ' ');
    }, [className]);
    const headerStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    return (jsxRuntime.jsx("header", { className: headerClasses, style: headerStyles, children: jsxRuntime.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: jsxRuntime.jsxs("div", { className: "flex justify-between items-center py-4", children: [jsxRuntime.jsxs("div", { className: "flex items-center space-x-4", children: [logoUrl && (jsxRuntime.jsx(OptimizedImage, { src: logoUrl, alt: `${websiteName} Logo`, width: 32, height: 32, aspectRatio: 1, loading: "eager", className: "h-8 w-auto", enableResponsive: false, preload: true })), jsxRuntime.jsx("a", { href: blogHomeUrl, className: "text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors", style: {
                                    ...applyHeadingFontStyles(design),
                                    color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#111827'
                                }, children: websiteName })] }), jsxRuntime.jsxs("nav", { className: "hidden md:flex items-center space-x-8", children: [jsxRuntime.jsx("a", { href: blogHomeUrl, className: "text-gray-600 hover:text-gray-900 transition-colors", children: "Blog Home" }), navigationItems.map((item, index) => (jsxRuntime.jsx("a", { href: item.url, className: "text-gray-600 hover:text-gray-900 transition-colors", children: item.label }, index))), jsxRuntime.jsx("a", { href: mainWebsiteUrl, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors", style: {
                                    backgroundColor: ((_d = (_c = design === null || design === void 0 ? void 0 : design.theme) === null || _c === void 0 ? void 0 : _c.customColors) === null || _d === void 0 ? void 0 : _d.primary) || '#3B82F6',
                                    color: 'white'
                                }, children: "Visit Main Website" })] }), jsxRuntime.jsx("div", { className: "md:hidden", children: jsxRuntime.jsx("button", { type: "button", className: "text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900", "aria-label": "Open menu", children: jsxRuntime.jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }) }) })] }) }) }));
}

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);

  // Clone the date
  if (argument instanceof Date || _typeof(argument) === 'object' && argStr === '[object Date]') {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      // eslint-disable-next-line no-console
      console.warn(new Error().stack);
    }
    return new Date(NaN);
  }
}

/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the milliseconds added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
}

var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}

/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

/**
 * @name compareAsc
 * @category Common Helpers
 * @summary Compare the two dates and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return 1 if the first date is after the second,
 * -1 if the first date is before the second or 0 if dates are equal.
 *
 * @param {Date|Number} dateLeft - the first date to compare
 * @param {Date|Number} dateRight - the second date to compare
 * @returns {Number} the result of the comparison
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989:
 * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
 * //=> -1
 *
 * @example
 * // Sort the array of dates:
 * const result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareAsc)
 * //=> [
 * //   Wed Feb 11 1987 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Sun Jul 02 1995 00:00:00
 * // ]
 */
function compareAsc(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var diff = dateLeft.getTime() - dateRight.getTime();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}

/**
 * Days in 1 week.
 *
 * @name daysInWeek
 * @constant
 * @type {number}
 * @default
 */

/**
 * Milliseconds in 1 minute
 *
 * @name millisecondsInMinute
 * @constant
 * @type {number}
 * @default
 */
var millisecondsInMinute = 60000;

/**
 * Milliseconds in 1 hour
 *
 * @name millisecondsInHour
 * @constant
 * @type {number}
 * @default
 */
var millisecondsInHour = 3600000;

/**
 * @name isDate
 * @category Common Helpers
 * @summary Is the given value a date?
 *
 * @description
 * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
 *
 * @param {*} value - the value to check
 * @returns {boolean} true if the given value is a date
 * @throws {TypeError} 1 arguments required
 *
 * @example
 * // For a valid date:
 * const result = isDate(new Date())
 * //=> true
 *
 * @example
 * // For an invalid date:
 * const result = isDate(new Date(NaN))
 * //=> true
 *
 * @example
 * // For some value:
 * const result = isDate('2014-02-31')
 * //=> false
 *
 * @example
 * // For an object:
 * const result = isDate({})
 * //=> false
 */
function isDate(value) {
  requiredArgs(1, arguments);
  return value instanceof Date || _typeof(value) === 'object' && Object.prototype.toString.call(value) === '[object Date]';
}

/**
 * @name isValid
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param {*} date - the date to check
 * @returns {Boolean} the date is valid
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // For the valid date:
 * const result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the value, convertable into a date:
 * const result = isValid(1393804800000)
 * //=> true
 *
 * @example
 * // For the invalid date:
 * const result = isValid(new Date(''))
 * //=> false
 */
function isValid(dirtyDate) {
  requiredArgs(1, arguments);
  if (!isDate(dirtyDate) && typeof dirtyDate !== 'number') {
    return false;
  }
  var date = toDate(dirtyDate);
  return !isNaN(Number(date));
}

/**
 * @name differenceInCalendarMonths
 * @category Month Helpers
 * @summary Get the number of calendar months between the given dates.
 *
 * @description
 * Get the number of calendar months between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar months
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many calendar months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInCalendarMonths(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 0, 31)
 * )
 * //=> 8
 */
function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
  return yearDiff * 12 + monthDiff;
}

/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of milliseconds
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * const result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */
function differenceInMilliseconds(dateLeft, dateRight) {
  requiredArgs(2, arguments);
  return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
}

var roundingMap = {
  ceil: Math.ceil,
  round: Math.round,
  floor: Math.floor,
  trunc: function trunc(value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  } // Math.trunc is not supported by IE
};

var defaultRoundingMethod = 'trunc';
function getRoundingMethod(method) {
  return roundingMap[defaultRoundingMethod];
}

/**
 * @name endOfDay
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the end of a day
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */
function endOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * @name endOfMonth
 * @category Month Helpers
 * @summary Return the end of a month for the given date.
 *
 * @description
 * Return the end of a month for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the end of a month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The end of a month for 2 September 2014 11:55:00:
 * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * @name isLastDayOfMonth
 * @category Month Helpers
 * @summary Is the given date the last day of a month?
 *
 * @description
 * Is the given date the last day of a month?
 *
 * @param {Date|Number} date - the date to check
 * @returns {Boolean} the date is the last day of a month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Is 28 February 2014 the last day of a month?
 * const result = isLastDayOfMonth(new Date(2014, 1, 28))
 * //=> true
 */
function isLastDayOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  return endOfDay(date).getTime() === endOfMonth(date).getTime();
}

/**
 * @name differenceInMonths
 * @category Month Helpers
 * @summary Get the number of full months between the given dates.
 *
 * @description
 * Get the number of full months between the given dates using trunc as a default rounding method.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of full months
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many full months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
 * //=> 7
 */
function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
  var result;

  // Check for the difference of less than month
  if (difference < 1) {
    result = 0;
  } else {
    if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
      // This will check if the date is end of Feb and assign a higher end of month date
      // to compare it with Jan
      dateLeft.setDate(30);
    }
    dateLeft.setMonth(dateLeft.getMonth() - sign * difference);

    // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
    // If so, result must be decreased by 1 in absolute value
    var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign;

    // Check for cases of one full calendar month
    if (isLastDayOfMonth(toDate(dirtyDateLeft)) && difference === 1 && compareAsc(dirtyDateLeft, dateRight) === 1) {
      isLastMonthNotFull = false;
    }
    result = sign * (difference - Number(isLastMonthNotFull));
  }

  // Prevent negative zero
  return result === 0 ? 0 : result;
}

/**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @param {Object} [options] - an object with options.
 * @param {String} [options.roundingMethod='trunc'] - a rounding method (`ceil`, `floor`, `round` or `trunc`)
 * @returns {Number} the number of seconds
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * const result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */
function differenceInSeconds(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMilliseconds(dateLeft, dateRight) / 1000;
  return getRoundingMethod()(diff);
}

/**
 * @name subMilliseconds
 * @category Millisecond Helpers
 * @summary Subtract the specified number of milliseconds from the given date.
 *
 * @description
 * Subtract the specified number of milliseconds from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the milliseconds subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
 * const result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:29.250
 */
function subMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}

var MILLISECONDS_IN_DAY = 86400000;
function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
}

function startOfUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

function startOfUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getUTCISOWeekYear(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary);
  return date;
}

var MILLISECONDS_IN_WEEK$1 = 604800000;
function getUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
}

function startOfUTCWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var defaultOptions = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);

  // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
  }
  var firstWeekOfNextYear = new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, options);
  var firstWeekOfThisYear = new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, options);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

function startOfUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  var year = getUTCWeekYear(dirtyDate, options);
  var firstWeek = new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, options);
  return date;
}

var MILLISECONDS_IN_WEEK = 604800000;
function getUTCWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? '-' : '';
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return sign + output;
}

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* |                                |
 * |  d  | Day of month                   |  D  |                                |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  m  | Minute                         |  M  | Month                          |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  y  | Year (abs)                     |  Y  |                                |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 */
var formatters$1 = {
  // Year
  y: function y(date, token) {
    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
    // |----------|-------|----|-------|-------|-------|
    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

    var signedYear = date.getUTCFullYear();
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length);
  },
  // Month
  M: function M(date, token) {
    var month = date.getUTCMonth();
    return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d: function d(date, token) {
    return addLeadingZeros(date.getUTCDate(), token.length);
  },
  // AM or PM
  a: function a(date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';
    switch (token) {
      case 'a':
      case 'aa':
        return dayPeriodEnumValue.toUpperCase();
      case 'aaa':
        return dayPeriodEnumValue;
      case 'aaaaa':
        return dayPeriodEnumValue[0];
      case 'aaaa':
      default:
        return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
    }
  },
  // Hour [1-12]
  h: function h(date, token) {
    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H: function H(date, token) {
    return addLeadingZeros(date.getUTCHours(), token.length);
  },
  // Minute
  m: function m(date, token) {
    return addLeadingZeros(date.getUTCMinutes(), token.length);
  },
  // Second
  s: function s(date, token) {
    return addLeadingZeros(date.getUTCSeconds(), token.length);
  },
  // Fraction of second
  S: function S(date, token) {
    var numberOfDigits = token.length;
    var milliseconds = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};

var dayPeriodEnum = {
  midnight: 'midnight',
  noon: 'noon',
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night'
};
/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |  D  | Day of year                    |
 * |  e  | Local day of week              |  E  | Day of week                    |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  | Stand-alone month              |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
 * |  p! | Long localized time            |  P! | Long localized date            |
 * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  | Local week of year             |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
 * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
 * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
 *   i.e. 7 for Sunday, 1 for Monday, etc.
 * - `I` is ISO week of year, as opposed to `w` which is local week of year.
 * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
 *   `R` is supposed to be used in conjunction with `I` and `i`
 *   for universal ISO week-numbering date, whereas
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 * - `P` is long localized date format
 * - `p` is long localized time format
 */

var formatters = {
  // Era
  G: function G(date, token, localize) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case 'G':
      case 'GG':
      case 'GGG':
        return localize.era(era, {
          width: 'abbreviated'
        });
      // A, B
      case 'GGGGG':
        return localize.era(era, {
          width: 'narrow'
        });
      // Anno Domini, Before Christ
      case 'GGGG':
      default:
        return localize.era(era, {
          width: 'wide'
        });
    }
  },
  // Year
  y: function y(date, token, localize) {
    // Ordinal number
    if (token === 'yo') {
      var signedYear = date.getUTCFullYear();
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize.ordinalNumber(year, {
        unit: 'year'
      });
    }
    return formatters$1.y(date, token);
  },
  // Local week-numbering year
  Y: function Y(date, token, localize, options) {
    var signedWeekYear = getUTCWeekYear(date, options);
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

    // Two digit year
    if (token === 'YY') {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }

    // Ordinal number
    if (token === 'Yo') {
      return localize.ordinalNumber(weekYear, {
        unit: 'year'
      });
    }

    // Padding
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function R(date, token) {
    var isoWeekYear = getUTCISOWeekYear(date);

    // Padding
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function u(date, token) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function Q(date, token, localize) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case 'Q':
        return String(quarter);
      // 01, 02, 03, 04
      case 'QQ':
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case 'Qo':
        return localize.ordinalNumber(quarter, {
          unit: 'quarter'
        });
      // Q1, Q2, Q3, Q4
      case 'QQQ':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case 'QQQQQ':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'formatting'
        });
      // 1st quarter, 2nd quarter, ...
      case 'QQQQ':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone quarter
  q: function q(date, token, localize) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case 'q':
        return String(quarter);
      // 01, 02, 03, 04
      case 'qq':
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case 'qo':
        return localize.ordinalNumber(quarter, {
          unit: 'quarter'
        });
      // Q1, Q2, Q3, Q4
      case 'qqq':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case 'qqqqq':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'standalone'
        });
      // 1st quarter, 2nd quarter, ...
      case 'qqqq':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // Month
  M: function M(date, token, localize) {
    var month = date.getUTCMonth();
    switch (token) {
      case 'M':
      case 'MM':
        return formatters$1.M(date, token);
      // 1st, 2nd, ..., 12th
      case 'Mo':
        return localize.ordinalNumber(month + 1, {
          unit: 'month'
        });
      // Jan, Feb, ..., Dec
      case 'MMM':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // J, F, ..., D
      case 'MMMMM':
        return localize.month(month, {
          width: 'narrow',
          context: 'formatting'
        });
      // January, February, ..., December
      case 'MMMM':
      default:
        return localize.month(month, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone month
  L: function L(date, token, localize) {
    var month = date.getUTCMonth();
    switch (token) {
      // 1, 2, ..., 12
      case 'L':
        return String(month + 1);
      // 01, 02, ..., 12
      case 'LL':
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case 'Lo':
        return localize.ordinalNumber(month + 1, {
          unit: 'month'
        });
      // Jan, Feb, ..., Dec
      case 'LLL':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // J, F, ..., D
      case 'LLLLL':
        return localize.month(month, {
          width: 'narrow',
          context: 'standalone'
        });
      // January, February, ..., December
      case 'LLLL':
      default:
        return localize.month(month, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // Local week of year
  w: function w(date, token, localize, options) {
    var week = getUTCWeek(date, options);
    if (token === 'wo') {
      return localize.ordinalNumber(week, {
        unit: 'week'
      });
    }
    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function I(date, token, localize) {
    var isoWeek = getUTCISOWeek(date);
    if (token === 'Io') {
      return localize.ordinalNumber(isoWeek, {
        unit: 'week'
      });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function d(date, token, localize) {
    if (token === 'do') {
      return localize.ordinalNumber(date.getUTCDate(), {
        unit: 'date'
      });
    }
    return formatters$1.d(date, token);
  },
  // Day of year
  D: function D(date, token, localize) {
    var dayOfYear = getUTCDayOfYear(date);
    if (token === 'Do') {
      return localize.ordinalNumber(dayOfYear, {
        unit: 'dayOfYear'
      });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function E(date, token, localize) {
    var dayOfWeek = date.getUTCDay();
    switch (token) {
      // Tue
      case 'E':
      case 'EE':
      case 'EEE':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T
      case 'EEEEE':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu
      case 'EEEEEE':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday
      case 'EEEE':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Local day of week
  e: function e(date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case 'e':
        return String(localDayOfWeek);
      // Padded numerical value
      case 'ee':
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case 'eo':
        return localize.ordinalNumber(localDayOfWeek, {
          unit: 'day'
        });
      case 'eee':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T
      case 'eeeee':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu
      case 'eeeeee':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday
      case 'eeee':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone local day of week
  c: function c(date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case 'c':
        return String(localDayOfWeek);
      // Padded numerical value
      case 'cc':
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case 'co':
        return localize.ordinalNumber(localDayOfWeek, {
          unit: 'day'
        });
      case 'ccc':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // T
      case 'ccccc':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'standalone'
        });
      // Tu
      case 'cccccc':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'standalone'
        });
      // Tuesday
      case 'cccc':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // ISO day of week
  i: function i(date, token, localize) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case 'i':
        return String(isoDayOfWeek);
      // 02
      case 'ii':
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd
      case 'io':
        return localize.ordinalNumber(isoDayOfWeek, {
          unit: 'day'
        });
      // Tue
      case 'iii':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T
      case 'iiiii':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu
      case 'iiiiii':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday
      case 'iiii':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // AM or PM
  a: function a(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
    switch (token) {
      case 'a':
      case 'aa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });
      case 'aaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        }).toLowerCase();
      case 'aaaaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });
      case 'aaaa':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // AM, PM, midnight, noon
  b: function b(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
    }
    switch (token) {
      case 'b':
      case 'bb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });
      case 'bbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        }).toLowerCase();
      case 'bbbbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });
      case 'bbbb':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function B(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case 'B':
      case 'BB':
      case 'BBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });
      case 'BBBBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });
      case 'BBBB':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Hour [1-12]
  h: function h(date, token, localize) {
    if (token === 'ho') {
      var hours = date.getUTCHours() % 12;
      if (hours === 0) hours = 12;
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }
    return formatters$1.h(date, token);
  },
  // Hour [0-23]
  H: function H(date, token, localize) {
    if (token === 'Ho') {
      return localize.ordinalNumber(date.getUTCHours(), {
        unit: 'hour'
      });
    }
    return formatters$1.H(date, token);
  },
  // Hour [0-11]
  K: function K(date, token, localize) {
    var hours = date.getUTCHours() % 12;
    if (token === 'Ko') {
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function k(date, token, localize) {
    var hours = date.getUTCHours();
    if (hours === 0) hours = 24;
    if (token === 'ko') {
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function m(date, token, localize) {
    if (token === 'mo') {
      return localize.ordinalNumber(date.getUTCMinutes(), {
        unit: 'minute'
      });
    }
    return formatters$1.m(date, token);
  },
  // Second
  s: function s(date, token, localize) {
    if (token === 'so') {
      return localize.ordinalNumber(date.getUTCSeconds(), {
        unit: 'second'
      });
    }
    return formatters$1.s(date, token);
  },
  // Fraction of second
  S: function S(date, token) {
    return formatters$1.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function X(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return 'Z';
    }
    switch (token) {
      // Hours and optional minutes
      case 'X':
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case 'XXXX':
      case 'XX':
        // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case 'XXXXX':
      case 'XXX': // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function x(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Hours and optional minutes
      case 'x':
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case 'xxxx':
      case 'xx':
        // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case 'xxxxx':
      case 'xxx': // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (GMT)
  O: function O(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Short
      case 'O':
      case 'OO':
      case 'OOO':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
      // Long
      case 'OOOO':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (specific non-location)
  z: function z(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Short
      case 'z':
      case 'zz':
      case 'zzz':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
      // Long
      case 'zzzz':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':');
    }
  },
  // Seconds timestamp
  t: function t(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1000);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function T(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};
function formatTimezoneShort(offset, dirtyDelimiter) {
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  var delimiter = dirtyDelimiter;
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
  if (offset % 60 === 0) {
    var sign = offset > 0 ? '-' : '+';
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, dirtyDelimiter);
}
function formatTimezone(offset, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

var dateLongFormatter = function dateLongFormatter(pattern, formatLong) {
  switch (pattern) {
    case 'P':
      return formatLong.date({
        width: 'short'
      });
    case 'PP':
      return formatLong.date({
        width: 'medium'
      });
    case 'PPP':
      return formatLong.date({
        width: 'long'
      });
    case 'PPPP':
    default:
      return formatLong.date({
        width: 'full'
      });
  }
};
var timeLongFormatter = function timeLongFormatter(pattern, formatLong) {
  switch (pattern) {
    case 'p':
      return formatLong.time({
        width: 'short'
      });
    case 'pp':
      return formatLong.time({
        width: 'medium'
      });
    case 'ppp':
      return formatLong.time({
        width: 'long'
      });
    case 'pppp':
    default:
      return formatLong.time({
        width: 'full'
      });
  }
};
var dateTimeLongFormatter = function dateTimeLongFormatter(pattern, formatLong) {
  var matchResult = pattern.match(/(P+)(p+)?/) || [];
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong);
  }
  var dateTimeFormat;
  switch (datePattern) {
    case 'P':
      dateTimeFormat = formatLong.dateTime({
        width: 'short'
      });
      break;
    case 'PP':
      dateTimeFormat = formatLong.dateTime({
        width: 'medium'
      });
      break;
    case 'PPP':
      dateTimeFormat = formatLong.dateTime({
        width: 'long'
      });
      break;
    case 'PPPP':
    default:
      dateTimeFormat = formatLong.dateTime({
        width: 'full'
      });
      break;
  }
  return dateTimeFormat.replace('{{date}}', dateLongFormatter(datePattern, formatLong)).replace('{{time}}', timeLongFormatter(timePattern, formatLong));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};

var protectedDayOfYearTokens = ['D', 'DD'];
var protectedWeekYearTokens = ['YY', 'YYYY'];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format, input) {
  if (token === 'YYYY') {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === 'YY') {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === 'D') {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === 'DD') {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  }
}

var formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'less than a second',
    other: 'less than {{count}} seconds'
  },
  xSeconds: {
    one: '1 second',
    other: '{{count}} seconds'
  },
  halfAMinute: 'half a minute',
  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes'
  },
  xMinutes: {
    one: '1 minute',
    other: '{{count}} minutes'
  },
  aboutXHours: {
    one: 'about 1 hour',
    other: 'about {{count}} hours'
  },
  xHours: {
    one: '1 hour',
    other: '{{count}} hours'
  },
  xDays: {
    one: '1 day',
    other: '{{count}} days'
  },
  aboutXWeeks: {
    one: 'about 1 week',
    other: 'about {{count}} weeks'
  },
  xWeeks: {
    one: '1 week',
    other: '{{count}} weeks'
  },
  aboutXMonths: {
    one: 'about 1 month',
    other: 'about {{count}} months'
  },
  xMonths: {
    one: '1 month',
    other: '{{count}} months'
  },
  aboutXYears: {
    one: 'about 1 year',
    other: 'about {{count}} years'
  },
  xYears: {
    one: '1 year',
    other: '{{count}} years'
  },
  overXYears: {
    one: 'over 1 year',
    other: 'over {{count}} years'
  },
  almostXYears: {
    one: 'almost 1 year',
    other: 'almost {{count}} years'
  }
};
var formatDistance$1 = function formatDistance(token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === 'string') {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace('{{count}}', count.toString());
  }
  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return 'in ' + result;
    } else {
      return result + ' ago';
    }
  }
  return result;
};

function buildFormatLongFn(args) {
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // TODO: Remove String()
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

var dateFormats = {
  full: 'EEEE, MMMM do, y',
  long: 'MMMM do, y',
  medium: 'MMM d, y',
  short: 'MM/dd/yyyy'
};
var timeFormats = {
  full: 'h:mm:ss a zzzz',
  long: 'h:mm:ss a z',
  medium: 'h:mm:ss a',
  short: 'h:mm a'
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: '{{date}}, {{time}}',
  short: '{{date}}, {{time}}'
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: 'full'
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: 'full'
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: 'full'
  })
};

var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: 'P'
};
var formatRelative = function formatRelative(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};

function buildLocalizeFn(args) {
  return function (dirtyIndex, options) {
    var context = options !== null && options !== void 0 && options.context ? String(options.context) : 'standalone';
    var valuesArray;
    if (context === 'formatting' && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;
      var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index];
  };
}

var eraValues = {
  narrow: ['B', 'A'],
  abbreviated: ['BC', 'AD'],
  wide: ['Before Christ', 'Anno Domini']
};
var quarterValues = {
  narrow: ['1', '2', '3', '4'],
  abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
  wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
};

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
var monthValues = {
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
var dayValues = {
  narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
var dayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  }
};
var ordinalNumber = function ordinalNumber(dirtyNumber, _options) {
  var number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`.
  //
  // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'.

  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st';
      case 2:
        return number + 'nd';
      case 3:
        return number + 'rd';
    }
  }
  return number + 'th';
};
var localize = {
  ordinalNumber: ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: 'wide'
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: 'wide',
    argumentCallback: function argumentCallback(quarter) {
      return quarter - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: 'wide'
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: 'wide'
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: 'wide',
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: 'wide'
  })
};

function buildMatchFn(args) {
  return function (string) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function (pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function (pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value: value,
      rest: rest
    };
  };
}
function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
  return undefined;
}
function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return undefined;
}

function buildMatchPatternFn(args) {
  return function (string) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value: value,
      rest: rest
    };
  };
}

var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function valueCallback(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseEraPatterns,
    defaultParseWidth: 'any'
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: 'any',
    valueCallback: function valueCallback(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: 'any'
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseDayPatterns,
    defaultParseWidth: 'any'
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: 'any',
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: 'any'
  })
};

/**
 * @type {Locale}
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
 * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
 */
var locale = {
  code: 'en-US',
  formatDistance: formatDistance$1,
  formatLong: formatLong,
  formatRelative: formatRelative,
  localize: localize,
  match: match,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1
  }
};

// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;

/**
 * @name format
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. The result may vary by locale.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * The characters wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 * (see the last example)
 *
 * Format of the string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 7 below the table).
 *
 * Accepted patterns:
 * | Unit                            | Pattern | Result examples                   | Notes |
 * |---------------------------------|---------|-----------------------------------|-------|
 * | Era                             | G..GGG  | AD, BC                            |       |
 * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 | GGGGG   | A, B                              |       |
 * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
 * |                                 | yy      | 44, 01, 00, 17                    | 5     |
 * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
 * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
 * |                                 | yyyyy   | ...                               | 3,5   |
 * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
 * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
 * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
 * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
 * |                                 | YYYYY   | ...                               | 3,5   |
 * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
 * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
 * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
 * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
 * |                                 | RRRRR   | ...                               | 3,5,7 |
 * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
 * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
 * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
 * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
 * |                                 | uuuuu   | ...                               | 3,5   |
 * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
 * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | QQ      | 01, 02, 03, 04                    |       |
 * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
 * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | qq      | 01, 02, 03, 04                    |       |
 * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
 * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
 * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | MM      | 01, 02, ..., 12                   |       |
 * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 | MMMM    | January, February, ..., December  | 2     |
 * |                                 | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
 * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | LL      | 01, 02, ..., 12                   |       |
 * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 | LLLL    | January, February, ..., December  | 2     |
 * |                                 | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | w       | 1, 2, ..., 53                     |       |
 * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
 * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | II      | 01, 02, ..., 53                   | 7     |
 * | Day of month                    | d       | 1, 2, ..., 31                     |       |
 * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
 * |                                 | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
 * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
 * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
 * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 | DDDD    | ...                               | 3     |
 * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
 * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
 * |                                 | ii      | 01, 02, ..., 07                   | 7     |
 * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
 * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
 * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
 * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
 * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | ee      | 02, 03, ..., 01                   |       |
 * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | cc      | 02, 03, ..., 01                   |       |
 * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | AM, PM                          | a..aa   | AM, PM                            |       |
 * |                                 | aaa     | am, pm                            |       |
 * |                                 | aaaa    | a.m., p.m.                        | 2     |
 * |                                 | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
 * |                                 | bbb     | am, pm, noon, midnight            |       |
 * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
 * |                                 | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
 * |                                 | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
 * |                                 | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
 * |                                 | KK      | 01, 02, ..., 11, 00               |       |
 * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
 * |                                 | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          | m       | 0, 1, ..., 59                     |       |
 * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | mm      | 00, 01, ..., 59                   |       |
 * | Second                          | s       | 0, 1, ..., 59                     |       |
 * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | ss      | 00, 01, ..., 59                   |       |
 * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
 * |                                 | SS      | 00, 01, ..., 99                   |       |
 * |                                 | SSS     | 000, 001, ..., 999                |       |
 * |                                 | SSSS    | ...                               | 3     |
 * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
 * |                                 | XX      | -0800, +0530, Z                   |       |
 * |                                 | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
 * |                                 | xx      | -0800, +0530, +0000               |       |
 * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
 * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
 * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
 * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
 * | Seconds timestamp               | t       | 512969520                         | 7     |
 * |                                 | tt      | ...                               | 3,7   |
 * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
 * |                                 | TT      | ...                               | 3,7   |
 * | Long localized date             | P       | 04/29/1453                        | 7     |
 * |                                 | PP      | Apr 29, 1453                      | 7     |
 * |                                 | PPP     | April 29th, 1453                  | 7     |
 * |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
 * | Long localized time             | p       | 12:00 AM                          | 7     |
 * |                                 | pp      | 12:00:00 AM                       | 7     |
 * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
 * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
 * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
 * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
 * |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
 * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
 *    the output will be the same as default pattern for this unit, usually
 *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
 *    are marked with "2" in the last column of the table.
 *
 *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
 *
 * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
 *    The output will be padded with zeros to match the length of the pattern.
 *
 *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
 *
 * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 5. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` always returns the last two digits of a year,
 *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
 *
 *    | Year | `yy` | `uu` |
 *    |------|------|------|
 *    | 1    |   01 |   01 |
 *    | 14   |   14 |   14 |
 *    | 376  |   76 |  376 |
 *    | 1453 |   53 | 1453 |
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
 *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
 *
 * 6. Specific non-location timezones are currently unavailable in `date-fns`,
 *    so right now these tokens fall back to GMT timezones.
 *
 * 7. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `t`: seconds timestamp
 *    - `T`: milliseconds timestamp
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 9. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * @param {Date|Number} date - the original date
 * @param {String} format - the string of tokens
 * @param {Object} [options] - an object with options.
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
 * @param {Boolean} [options.useAdditionalWeekYearTokens=false] - if true, allows usage of the week-numbering year tokens `YY` and `YYYY`;
 *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @param {Boolean} [options.useAdditionalDayOfYearTokens=false] - if true, allows usage of the day of year tokens `D` and `DD`;
 *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @returns {String} the formatted date string
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `date` must not be Invalid Date
 * @throws {RangeError} `options.locale` must contain `localize` property
 * @throws {RangeError} `options.locale` must contain `formatLong` property
 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
 * @throws {RangeError} use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws {RangeError} use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws {RangeError} use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws {RangeError} use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws {RangeError} format string contains an unescaped latin alphabet character
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * const result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
 *   locale: eoLocale
 * })
 * //=> '2-a de julio 2014'
 *
 * @example
 * // Escape string by single quote characters:
 * const result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
 * //=> "3 o'clock"
 */

function format(dirtyDate, dirtyFormatStr, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _defaultOptions$local3, _defaultOptions$local4;
  requiredArgs(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var defaultOptions = getDefaultOptions();
  var locale$1 = (_ref = (_options$locale = void 0 ) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions.locale) !== null && _ref !== void 0 ? _ref : locale;
  var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = void 0 ) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : void 0 ) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);

  // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
  }
  var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = void 0 ) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : void 0 ) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }
  if (!locale$1.localize) {
    throw new RangeError('locale must contain localize property');
  }
  if (!locale$1.formatLong) {
    throw new RangeError('locale must contain formatLong property');
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError('Invalid time value');
  }

  // Convert the date in system timezone to the same date in UTC+00:00 timezone.
  // This ensures that when UTC functions will be implemented, locales will be compatible with them.
  // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376
  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate: firstWeekContainsDate,
    weekStartsOn: weekStartsOn,
    locale: locale$1,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp).map(function (substring) {
    var firstCharacter = substring[0];
    if (firstCharacter === 'p' || firstCharacter === 'P') {
      var longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale$1.formatLong);
    }
    return substring;
  }).join('').match(formattingTokensRegExp).map(function (substring) {
    // Replace two single quote characters with one single quote character
    if (substring === "''") {
      return "'";
    }
    var firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return cleanEscapedString(substring);
    }
    var formatter = formatters[firstCharacter];
    if (formatter) {
      if (isProtectedWeekYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      if (isProtectedDayOfYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      return formatter(utcDate, substring, locale$1.localize, formatterOptions);
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
    }
    return substring;
  }).join('');
  return result;
}
function cleanEscapedString(input) {
  var matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}

function assign(target, object) {
  if (target == null) {
    throw new TypeError('assign requires that input parameter not be null or undefined');
  }
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property)) {
      target[property] = object[property];
    }
  }
  return target;
}

function cloneObject(object) {
  return assign({}, object);
}

var MINUTES_IN_DAY = 1440;
var MINUTES_IN_ALMOST_TWO_DAYS = 2520;
var MINUTES_IN_MONTH = 43200;
var MINUTES_IN_TWO_MONTHS = 86400;

/**
 * @name formatDistance
 * @category Common Helpers
 * @summary Return the distance between the given dates in words.
 *
 * @description
 * Return the distance between the given dates in words.
 *
 * | Distance between dates                                            | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance between dates | Result               |
 * |------------------------|----------------------|
 * | 0 secs ... 5 secs      | less than 5 seconds  |
 * | 5 secs ... 10 secs     | less than 10 seconds |
 * | 10 secs ... 20 secs    | less than 20 seconds |
 * | 20 secs ... 40 secs    | half a minute        |
 * | 40 secs ... 60 secs    | less than a minute   |
 * | 60 secs ... 90 secs    | 1 minute             |
 *
 * @param {Date|Number} date - the date
 * @param {Date|Number} baseDate - the date to compare with
 * @param {Object} [options] - an object with options.
 * @param {Boolean} [options.includeSeconds=false] - distances less than a minute are more detailed
 * @param {Boolean} [options.addSuffix=false] - result indicates if the second date is earlier or later than the first
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @returns {String} the distance in words
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `date` must not be Invalid Date
 * @throws {RangeError} `baseDate` must not be Invalid Date
 * @throws {RangeError} `options.locale` must contain `formatDistance` property
 *
 * @example
 * // What is the distance between 2 July 2014 and 1 January 2015?
 * const result = formatDistance(new Date(2014, 6, 2), new Date(2015, 0, 1))
 * //=> '6 months'
 *
 * @example
 * // What is the distance between 1 January 2015 00:00:15
 * // and 1 January 2015 00:00:00, including seconds?
 * const result = formatDistance(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   new Date(2015, 0, 1, 0, 0, 0),
 *   { includeSeconds: true }
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, with a suffix?
 * const result = formatDistance(new Date(2015, 0, 1), new Date(2016, 0, 1), {
 *   addSuffix: true
 * })
 * //=> 'about 1 year ago'
 *
 * @example
 * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = formatDistance(new Date(2016, 7, 1), new Date(2015, 0, 1), {
 *   locale: eoLocale
 * })
 * //=> 'pli ol 1 jaro'
 */

function formatDistance(dirtyDate, dirtyBaseDate, options) {
  var _ref, _options$locale;
  requiredArgs(2, arguments);
  var defaultOptions = getDefaultOptions();
  var locale$1 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions.locale) !== null && _ref !== void 0 ? _ref : locale;
  if (!locale$1.formatDistance) {
    throw new RangeError('locale must contain formatDistance property');
  }
  var comparison = compareAsc(dirtyDate, dirtyBaseDate);
  if (isNaN(comparison)) {
    throw new RangeError('Invalid time value');
  }
  var localizeOptions = assign(cloneObject(options), {
    addSuffix: Boolean(options === null || options === void 0 ? void 0 : options.addSuffix),
    comparison: comparison
  });
  var dateLeft;
  var dateRight;
  if (comparison > 0) {
    dateLeft = toDate(dirtyBaseDate);
    dateRight = toDate(dirtyDate);
  } else {
    dateLeft = toDate(dirtyDate);
    dateRight = toDate(dirtyBaseDate);
  }
  var seconds = differenceInSeconds(dateRight, dateLeft);
  var offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1000;
  var minutes = Math.round((seconds - offsetInSeconds) / 60);
  var months;

  // 0 up to 2 mins
  if (minutes < 2) {
    if (options !== null && options !== void 0 && options.includeSeconds) {
      if (seconds < 5) {
        return locale$1.formatDistance('lessThanXSeconds', 5, localizeOptions);
      } else if (seconds < 10) {
        return locale$1.formatDistance('lessThanXSeconds', 10, localizeOptions);
      } else if (seconds < 20) {
        return locale$1.formatDistance('lessThanXSeconds', 20, localizeOptions);
      } else if (seconds < 40) {
        return locale$1.formatDistance('halfAMinute', 0, localizeOptions);
      } else if (seconds < 60) {
        return locale$1.formatDistance('lessThanXMinutes', 1, localizeOptions);
      } else {
        return locale$1.formatDistance('xMinutes', 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale$1.formatDistance('lessThanXMinutes', 1, localizeOptions);
      } else {
        return locale$1.formatDistance('xMinutes', minutes, localizeOptions);
      }
    }

    // 2 mins up to 0.75 hrs
  } else if (minutes < 45) {
    return locale$1.formatDistance('xMinutes', minutes, localizeOptions);

    // 0.75 hrs up to 1.5 hrs
  } else if (minutes < 90) {
    return locale$1.formatDistance('aboutXHours', 1, localizeOptions);

    // 1.5 hrs up to 24 hrs
  } else if (minutes < MINUTES_IN_DAY) {
    var hours = Math.round(minutes / 60);
    return locale$1.formatDistance('aboutXHours', hours, localizeOptions);

    // 1 day up to 1.75 days
  } else if (minutes < MINUTES_IN_ALMOST_TWO_DAYS) {
    return locale$1.formatDistance('xDays', 1, localizeOptions);

    // 1.75 days up to 30 days
  } else if (minutes < MINUTES_IN_MONTH) {
    var days = Math.round(minutes / MINUTES_IN_DAY);
    return locale$1.formatDistance('xDays', days, localizeOptions);

    // 1 month up to 2 months
  } else if (minutes < MINUTES_IN_TWO_MONTHS) {
    months = Math.round(minutes / MINUTES_IN_MONTH);
    return locale$1.formatDistance('aboutXMonths', months, localizeOptions);
  }
  months = differenceInMonths(dateRight, dateLeft);

  // 2 months up to 12 months
  if (months < 12) {
    var nearestMonth = Math.round(minutes / MINUTES_IN_MONTH);
    return locale$1.formatDistance('xMonths', nearestMonth, localizeOptions);

    // 1 year up to max Date
  } else {
    var monthsSinceStartOfYear = months % 12;
    var years = Math.floor(months / 12);

    // N years up to 1 years 3 months
    if (monthsSinceStartOfYear < 3) {
      return locale$1.formatDistance('aboutXYears', years, localizeOptions);

      // N years 3 months up to N years 9 months
    } else if (monthsSinceStartOfYear < 9) {
      return locale$1.formatDistance('overXYears', years, localizeOptions);

      // N years 9 months up to N year 12 months
    } else {
      return locale$1.formatDistance('almostXYears', years + 1, localizeOptions);
    }
  }
}

/**
 * @name formatDistanceToNow
 * @category Common Helpers
 * @summary Return the distance between the given date and now in words.
 * @pure false
 *
 * @description
 * Return the distance between the given date and now in words.
 *
 * | Distance to now                                                   | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance to now     | Result               |
 * |---------------------|----------------------|
 * | 0 secs ... 5 secs   | less than 5 seconds  |
 * | 5 secs ... 10 secs  | less than 10 seconds |
 * | 10 secs ... 20 secs | less than 20 seconds |
 * | 20 secs ... 40 secs | half a minute        |
 * | 40 secs ... 60 secs | less than a minute   |
 * | 60 secs ... 90 secs | 1 minute             |
 *
 * > ⚠️ Please note that this function is not present in the FP submodule as
 * > it uses `Date.now()` internally hence impure and can't be safely curried.
 *
 * @param {Date|Number} date - the given date
 * @param {Object} [options] - the object with options
 * @param {Boolean} [options.includeSeconds=false] - distances less than a minute are more detailed
 * @param {Boolean} [options.addSuffix=false] - result specifies if now is earlier or later than the passed date
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @returns {String} the distance in words
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `date` must not be Invalid Date
 * @throws {RangeError} `options.locale` must contain `formatDistance` property
 *
 * @example
 * // If today is 1 January 2015, what is the distance to 2 July 2014?
 * const result = formatDistanceToNow(
 *   new Date(2014, 6, 2)
 * )
 * //=> '6 months'
 *
 * @example
 * // If now is 1 January 2015 00:00:00,
 * // what is the distance to 1 January 2015 00:00:15, including seconds?
 * const result = formatDistanceToNow(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   {includeSeconds: true}
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 January 2016, with a suffix?
 * const result = formatDistanceToNow(
 *   new Date(2016, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> 'in about 1 year'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 August 2016 in Esperanto?
 * const eoLocale = require('date-fns/locale/eo')
 * const result = formatDistanceToNow(
 *   new Date(2016, 7, 1),
 *   {locale: eoLocale}
 * )
 * //=> 'pli ol 1 jaro'
 */
function formatDistanceToNow(dirtyDate, options) {
  requiredArgs(1, arguments);
  return formatDistance(dirtyDate, Date.now(), options);
}

/**
 * @name parseISO
 * @category Common Helpers
 * @summary Parse ISO string
 *
 * @description
 * Parse the given string in ISO 8601 format and return an instance of Date.
 *
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If the argument isn't a string, the function cannot parse the string or
 * the values are invalid, it returns Invalid Date.
 *
 * @param {String} argument - the value to convert
 * @param {Object} [options] - an object with options.
 * @param {0|1|2} [options.additionalDigits=2] - the additional number of digits in the extended year format
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * const result = parseISO('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * const result = parseISO('+02014101', { additionalDigits: 1 })
 * //=> Fri Apr 11 2014 00:00:00
 */
function parseISO(argument, options) {
  var _options$additionalDi;
  requiredArgs(1, arguments);
  var additionalDigits = toInteger((_options$additionalDi = void 0 ) !== null && _options$additionalDi !== void 0 ? _options$additionalDi : 2);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError('additionalDigits must be 0, 1 or 2');
  }
  if (!(typeof argument === 'string' || Object.prototype.toString.call(argument) === '[object String]')) {
    return new Date(NaN);
  }
  var dateStrings = splitDateString(argument);
  var date;
  if (dateStrings.date) {
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }
  if (!date || isNaN(date.getTime())) {
    return new Date(NaN);
  }
  var timestamp = date.getTime();
  var time = 0;
  var offset;
  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return new Date(NaN);
    }
  }
  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) {
      return new Date(NaN);
    }
  } else {
    var dirtyDate = new Date(timestamp + time);
    // js parsed string assuming it's in UTC timezone
    // but we need it to be parsed in our timezone
    // so we use utc values to build date in our timezone.
    // Year values from 0 to 99 map to the years 1900 to 1999
    // so set year explicitly with setFullYear.
    var result = new Date(0);
    result.setFullYear(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate());
    result.setHours(dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
    return result;
  }
  return new Date(timestamp + time + offset);
}
var patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
};
var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimiter);
  var timeString;

  // The regex match should only return at maximum two array elements.
  // [date], [time], or [date, time].
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(dateStrings.date.length, dateString.length);
    }
  }
  if (timeString) {
    var token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], '');
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  var regex = new RegExp('^(?:(\\d{4}|[+-]\\d{' + (4 + additionalDigits) + '})|(\\d{2}|[+-]\\d{' + (2 + additionalDigits) + '})$)');
  var captures = dateString.match(regex);
  // Invalid ISO-formatted year
  if (!captures) return {
    year: NaN,
    restDateString: ''
  };
  var year = captures[1] ? parseInt(captures[1]) : null;
  var century = captures[2] ? parseInt(captures[2]) : null;

  // either year or century is null, not both
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}
function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) return new Date(NaN);
  var captures = dateString.match(dateRegex);
  // Invalid ISO-formatted string
  if (!captures) return new Date(NaN);
  var isWeekDate = !!captures[4];
  var dayOfYear = parseDateUnit(captures[1]);
  var month = parseDateUnit(captures[2]) - 1;
  var day = parseDateUnit(captures[3]);
  var week = parseDateUnit(captures[4]);
  var dayOfWeek = parseDateUnit(captures[5]) - 1;
  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    var date = new Date(0);
    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}
function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
  var captures = timeString.match(timeRegex);
  if (!captures) return NaN; // Invalid ISO-formatted time

  var hours = parseTimeUnit(captures[1]);
  var minutes = parseTimeUnit(captures[2]);
  var seconds = parseTimeUnit(captures[3]);
  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }
  return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1000;
}
function parseTimeUnit(value) {
  return value && parseFloat(value.replace(',', '.')) || 0;
}
function parseTimezone(timezoneString) {
  if (timezoneString === 'Z') return 0;
  var captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;
  var sign = captures[1] === '+' ? -1 : 1;
  var hours = parseInt(captures[2]);
  var minutes = captures[3] && parseInt(captures[3]) || 0;
  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }
  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  var date = new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// Validation functions

// February is null to handle the leap year (using ||)
var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }
  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}

/**
 * Format date string for display
 */
function formatDate(dateString, language = 'en') {
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM dd, yyyy');
    }
    catch (error) {
        console.warn('Invalid date format:', dateString);
        return dateString;
    }
}
/**
 * Format date as relative time (e.g., "2 days ago")
 */
function formatRelativeDate(dateString, language = 'en') {
    try {
        const date = parseISO(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    }
    catch (error) {
        console.warn('Invalid date format:', dateString);
        return dateString;
    }
}
/**
 * Format reading time
 */
function formatReadingTime(minutes, language = 'en') {
    if (minutes < 1) {
        return language === 'en' ? 'Less than 1 min read' : '< 1 min de lecture';
    }
    if (language === 'en') {
        return `${minutes} min read`;
    }
    // Add more language support as needed
    return `${minutes} min de lecture`;
}
/**
 * Format word count
 */
function formatWordCount(words, language = 'en') {
    if (language === 'en') {
        return `${words.toLocaleString()} words`;
    }
    return `${words.toLocaleString()} mots`;
}
/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - suffix.length) + suffix;
}
/**
 * Strip HTML tags from content
 */
function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
}
/**
 * Generate excerpt from content
 */
function generateExcerpt(content, maxLength = 150) {
    const stripped = stripHtml(content);
    return truncateText(stripped, maxLength);
}
/**
 * Slugify text for URLs
 */
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
/**
 * Capitalize first letter of each word
 */
function titleCase(text) {
    return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * Format number with appropriate suffixes (K, M, B)
 */
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}
/**
 * Get reading time estimate from content
 */
function calculateReadingTime(content, wordsPerMinute = 225) {
    const text = stripHtml(content);
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}
/**
 * Get word count from content
 */
function getWordCount(content) {
    const text = stripHtml(content);
    return text.trim().split(/\s+/).filter(Boolean).length;
}
/**
 * Format categories for display
 */
function formatCategories(categories, maxDisplay = 3) {
    if (categories.length <= maxDisplay) {
        return { displayed: categories, remaining: 0 };
    }
    return {
        displayed: categories.slice(0, maxDisplay),
        remaining: categories.length - maxDisplay
    };
}
/**
 * Format tags for display
 */
function formatTags(tags, maxDisplay = 5) {
    if (tags.length <= maxDisplay) {
        return { displayed: tags, remaining: 0 };
    }
    return {
        displayed: tags.slice(0, maxDisplay),
        remaining: tags.length - maxDisplay
    };
}
/**
 * Get first paragraph from content
 */
function getFirstParagraph(content) {
    const stripped = stripHtml(content);
    const paragraphs = stripped.split('\n\n');
    return paragraphs[0] || '';
}
/**
 * Format URL for display (remove protocol, www, etc.)
 */
function formatUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, '') + urlObj.pathname;
    }
    catch (_a) {
        return url;
    }
}
/**
 * Generate color from string (for avatars, tags, etc.)
 */
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
}
/**
 * Check if string is a valid URL
 */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    }
    catch (_a) {
        return false;
    }
}
/**
 * Extract domain from URL
 */
function extractDomain(url) {
    try {
        return new URL(url).hostname;
    }
    catch (_a) {
        return url;
    }
}

function ContentFreshness({ publishedAt, updatedAt, showIndicator = true, showLastUpdated = true, freshnessThreshold = 30, // 30 days
className = '', style }) {
    const { design } = useGEOPilot();
    const freshnessData = React.useMemo(() => {
        const now = new Date();
        const published = new Date(publishedAt);
        const updated = updatedAt ? new Date(updatedAt) : published;
        const daysSincePublished = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24));
        const daysSinceUpdated = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
        const isFresh = daysSinceUpdated <= freshnessThreshold;
        const isRecentlyUpdated = updatedAt && updated.getTime() > published.getTime();
        return {
            daysSincePublished,
            daysSinceUpdated,
            isFresh,
            isRecentlyUpdated,
            published,
            updated
        };
    }, [publishedAt, updatedAt, freshnessThreshold]);
    const containerClasses = React.useMemo(() => {
        return `
      auto-blogify-content-freshness
      flex
      items-center
      space-x-2
      text-sm
      ${className}
    `.trim().replace(/\s+/g, ' ');
    }, [className]);
    const containerStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    const getFreshnessIndicator = () => {
        if (!showIndicator)
            return null;
        const { isFresh, isRecentlyUpdated } = freshnessData;
        let indicatorColor = '#10B981'; // Green for fresh
        let indicatorText = 'Fresh';
        let indicatorIcon = '🟢';
        if (!isFresh) {
            indicatorColor = '#F59E0B'; // Amber for stale
            indicatorText = 'Stale';
            indicatorIcon = '🟡';
        }
        if (isRecentlyUpdated) {
            indicatorColor = '#3B82F6'; // Blue for recently updated
            indicatorText = 'Updated';
            indicatorIcon = '🔵';
        }
        return (jsxRuntime.jsxs("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", style: {
                backgroundColor: `${indicatorColor}20`,
                color: indicatorColor,
                border: `1px solid ${indicatorColor}40`
            }, title: `Content ${indicatorText.toLowerCase()}`, children: [jsxRuntime.jsx("span", { className: "mr-1", "aria-hidden": "true", children: indicatorIcon }), indicatorText] }));
    };
    const getLastUpdatedText = () => {
        if (!showLastUpdated)
            return null;
        const { daysSinceUpdated, isRecentlyUpdated, updated } = freshnessData;
        if (isRecentlyUpdated) {
            if (daysSinceUpdated === 0) {
                return 'Updated today';
            }
            else if (daysSinceUpdated === 1) {
                return 'Updated yesterday';
            }
            else if (daysSinceUpdated < 7) {
                return `Updated ${daysSinceUpdated} days ago`;
            }
            else if (daysSinceUpdated < 30) {
                const weeks = Math.floor(daysSinceUpdated / 7);
                return `Updated ${weeks} week${weeks > 1 ? 's' : ''} ago`;
            }
            else {
                return `Updated ${updated.toLocaleDateString()}`;
            }
        }
        return null;
    };
    const getAgeText = () => {
        const { daysSincePublished } = freshnessData;
        if (daysSincePublished === 0) {
            return 'Published today';
        }
        else if (daysSincePublished === 1) {
            return 'Published yesterday';
        }
        else if (daysSincePublished < 7) {
            return `Published ${daysSincePublished} days ago`;
        }
        else if (daysSincePublished < 30) {
            const weeks = Math.floor(daysSincePublished / 7);
            return `Published ${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
        else if (daysSincePublished < 365) {
            const months = Math.floor(daysSincePublished / 30);
            return `Published ${months} month${months > 1 ? 's' : ''} ago`;
        }
        else {
            const years = Math.floor(daysSincePublished / 365);
            return `Published ${years} year${years > 1 ? 's' : ''} ago`;
        }
    };
    return (jsxRuntime.jsxs("div", { className: containerClasses, style: containerStyles, children: [getFreshnessIndicator(), jsxRuntime.jsx("span", { className: "text-gray-600", children: getAgeText() }), getLastUpdatedText() && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("span", { className: "text-gray-400", "aria-hidden": "true", children: "\u2022" }), jsxRuntime.jsx("span", { className: "text-gray-600", children: getLastUpdatedText() })] }))] }));
}

function BlogPostMetadata({ title, coverImage, publishDate, updatedDate, author, readingTime, showContentFreshness = false, className = '', style }) {
    var _a, _b;
    const { design } = useGEOPilot();
    const containerClasses = React.useMemo(() => {
        return `
      auto-blogify-post-metadata
      max-w-4xl
      mx-auto
      px-4
      py-8
      ${className}
    `.trim().replace(/\s+/g, ' ');
    }, [className]);
    const containerStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    const formattedDate = React.useMemo(() => {
        if (!publishDate)
            return null;
        return formatDate(publishDate instanceof Date ? publishDate.toISOString() : publishDate);
    }, [publishDate]);
    return (jsxRuntime.jsxs("div", { className: containerClasses, style: containerStyles, children: [coverImage && (jsxRuntime.jsx("div", { className: "mb-8", children: jsxRuntime.jsx(OptimizedImage, { src: coverImage, alt: title, width: 800, height: 600, aspectRatio: 4 / 3, loading: "eager", className: "w-full h-64 md:h-96 object-cover rounded-lg shadow-lg", enableResponsive: true, sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw", preload: true }) })), jsxRuntime.jsxs("header", { className: "mb-6", children: [jsxRuntime.jsx("h1", { className: "text-4xl md:text-5xl font-bold leading-tight mb-6", style: {
                            ...applyHeadingFontStyles(design),
                            color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#111827'
                        }, children: title }), jsxRuntime.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-gray-600", children: [formattedDate && (jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), jsxRuntime.jsx("span", { children: formattedDate })] })), author && (jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), jsxRuntime.jsxs("span", { children: ["By ", author] })] })), readingTime && (jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), jsxRuntime.jsxs("span", { children: [readingTime, " min read"] })] }))] }), showContentFreshness && publishDate && (jsxRuntime.jsx("div", { className: "mt-4", children: jsxRuntime.jsx(ContentFreshness, { publishedAt: publishDate instanceof Date ? publishDate.toISOString() : publishDate, updatedAt: updatedDate ? (updatedDate instanceof Date ? updatedDate.toISOString() : updatedDate) : undefined, showIndicator: true, showLastUpdated: true, freshnessThreshold: 30 }) }))] })] }));
}

function BlogTableOfContents({ items, isSticky = true, position = 'right', className = '', style }) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { design } = useGEOPilot();
    const [activeId, setActiveId] = React.useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const tocRef = React.useRef(null);
    // Flatten TOC items for easier rendering
    const flattenedItems = React.useMemo(() => {
        const flatten = (items, level = 0) => {
            return items.reduce((acc, item) => {
                acc.push({ ...item, level });
                if (item.children) {
                    acc.push(...flatten(item.children, level + 1));
                }
                return acc;
            }, []);
        };
        return flatten(items);
    }, [items]);
    // Intersection Observer to track active section
    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        });
        // Observe all headings
        flattenedItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });
        return () => observer.disconnect();
    }, [flattenedItems]);
    // Show/hide TOC based on scroll position - always visible for sidebar and fixed positions
    React.useEffect(() => {
        const handleScroll = () => {
            if (position === 'sidebar' || position === 'left' || position === 'right') {
                setIsVisible(true);
            }
            else {
                const scrollTop = window.pageYOffset;
                setIsVisible(scrollTop > 300);
            }
        };
        // For sidebar and fixed positions, set visible immediately
        if (position === 'sidebar' || position === 'left' || position === 'right') {
            setIsVisible(true);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [position]);
    const containerClasses = React.useMemo(() => {
        const baseClasses = `
      auto-blogify-toc
      bg-white
      border
      border-gray-200
      rounded-lg
      shadow-lg
      p-6
      max-w-sm
    `;
        // Handle different positioning modes
        let positionClasses = '';
        let stickyClasses = '';
        let zIndexClasses = '';
        if (position === 'sidebar') {
            // Sidebar mode - normal flow with optional sticky
            positionClasses = 'block';
            stickyClasses = isSticky ? 'sticky top-24' : '';
            zIndexClasses = 'z-10';
        }
        else if (position === 'left') {
            // Fixed on the left for desktop so it follows scrolling
            positionClasses = 'hidden lg:block fixed left-6 top-24';
            stickyClasses = '';
            zIndexClasses = 'z-20';
        }
        else {
            // Fixed on the right for desktop so it follows scrolling
            positionClasses = 'hidden lg:block fixed right-6 top-24';
            stickyClasses = '';
            zIndexClasses = 'z-20';
        }
        return `${baseClasses} ${positionClasses} ${stickyClasses} ${zIndexClasses} ${className}`.trim().replace(/\s+/g, ' ');
    }, [position, isSticky, className]);
    const containerStyles = React.useMemo(() => {
        const base = applyDesignStyles(design, style) || {};
        const shouldConstrainHeight = position === 'sidebar' || isSticky;
        return {
            ...base,
            ...(shouldConstrainHeight
                ? {
                    maxHeight: 'calc(100vh - 6rem)',
                    overflowY: 'auto'
                }
                : {})
        };
    }, [design, style, position, isSticky]);
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
    if (!flattenedItems.length) {
        return null;
    }
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [position !== 'sidebar' && (jsxRuntime.jsx("button", { onClick: () => setIsMobileOpen(!isMobileOpen), className: "lg:hidden fixed left-6 top-6 z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors", "aria-label": "Toggle Table of Contents", children: jsxRuntime.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }) })), position !== 'sidebar' && isMobileOpen && (jsxRuntime.jsx("div", { className: "lg:hidden fixed inset-0 z-[9998] bg-black bg-opacity-50", onClick: () => setIsMobileOpen(false), children: jsxRuntime.jsx("div", { className: "fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl overflow-y-auto", onClick: (e) => e.stopPropagation(), children: jsxRuntime.jsxs("div", { className: "p-6", children: [jsxRuntime.jsxs("div", { className: "flex justify-between items-center mb-4", children: [jsxRuntime.jsx("h3", { className: "text-lg font-semibold", style: {
                                            color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.heading) || ((_d = (_c = design === null || design === void 0 ? void 0 : design.theme) === null || _c === void 0 ? void 0 : _c.customColors) === null || _d === void 0 ? void 0 : _d.primary) || '#111827'
                                        }, children: "Table of Contents" }), jsxRuntime.jsx("button", { onClick: () => setIsMobileOpen(false), className: "p-2 hover:bg-gray-100 rounded-full", children: jsxRuntime.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), jsxRuntime.jsx("nav", { className: "space-y-2", children: flattenedItems.map((item, index) => {
                                    var _a, _b;
                                    return (jsxRuntime.jsx("button", { onClick: () => {
                                            scrollToSection(item.id);
                                            setIsMobileOpen(false);
                                        }, className: `
                      block w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                      ${activeId === item.id
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                    `, style: {
                                            paddingLeft: `${item.level * 12 + 12}px`,
                                            color: activeId === item.id
                                                ? (((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#1D4ED8')
                                                : undefined
                                        }, children: item.title }, index));
                                }) })] }) }) })), jsxRuntime.jsxs("div", { ref: tocRef, className: `${containerClasses} ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`, style: containerStyles, children: [jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-4", style: {
                            color: ((_f = (_e = design === null || design === void 0 ? void 0 : design.theme) === null || _e === void 0 ? void 0 : _e.customColors) === null || _f === void 0 ? void 0 : _f.heading) || ((_h = (_g = design === null || design === void 0 ? void 0 : design.theme) === null || _g === void 0 ? void 0 : _g.customColors) === null || _h === void 0 ? void 0 : _h.primary) || '#111827'
                        }, children: "Table of Contents" }), jsxRuntime.jsx("nav", { className: "space-y-2", children: flattenedItems.map((item, index) => {
                            var _a, _b;
                            return (jsxRuntime.jsx("button", { onClick: () => scrollToSection(item.id), className: `
                block w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                ${activeId === item.id
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
              `, style: {
                                    paddingLeft: `${item.level * 12 + 12}px`,
                                    color: activeId === item.id
                                        ? (((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#1D4ED8')
                                        : undefined
                                }, children: item.title }, index));
                        }) })] })] }));
}

function BlogSocialShare({ url, title, description = '', platforms = ['twitter', 'facebook', 'linkedin'], position = 'inline', className = '', style }) {
    const { design } = useGEOPilot();
    const containerClasses = React.useMemo(() => {
        const baseClasses = 'auto-blogify-social-share';
        const positionClasses = {
            top: 'mb-6',
            bottom: 'mt-6',
            floating: 'fixed right-4 top-1/2 transform -translate-y-1/2 z-50',
            inline: 'my-6'
        };
        return `${baseClasses} ${positionClasses[position]} ${className}`.trim().replace(/\s+/g, ' ');
    }, [position, className]);
    const containerStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);
    const shareDescription = encodeURIComponent(description);
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
        email: `mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${shareUrl}`
    };
    const platformIcons = {
        twitter: (jsxRuntime.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { d: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" }) })),
        facebook: (jsxRuntime.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) })),
        linkedin: (jsxRuntime.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }) })),
        email: (jsxRuntime.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }))
    };
    const platformColors = {
        twitter: '#1DA1F2',
        facebook: '#4267B2',
        linkedin: '#0077B5',
        email: '#6B7280'
    };
    const handleShare = (platform) => {
        const shareWindow = window.open(shareLinks[platform], 'share', 'width=600,height=400,scrollbars=yes,resizable=yes');
        if (shareWindow) {
            shareWindow.focus();
        }
    };
    if (position === 'floating') {
        return (jsxRuntime.jsx("div", { className: containerClasses, style: containerStyles, children: jsxRuntime.jsx("div", { className: "flex flex-col space-y-3", children: platforms.map((platform) => (jsxRuntime.jsx("button", { onClick: () => handleShare(platform), className: "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow", style: { backgroundColor: platformColors[platform] }, "aria-label": `Share on ${platform}`, children: platformIcons[platform] }, platform))) }) }));
    }
    return (jsxRuntime.jsx("div", { className: containerClasses, style: containerStyles, children: jsxRuntime.jsxs("div", { className: "flex items-center space-x-4", children: [jsxRuntime.jsx("span", { className: "text-sm font-medium text-gray-700", children: "Share this article:" }), jsxRuntime.jsx("div", { className: "flex space-x-3", children: platforms.map((platform) => (jsxRuntime.jsx("button", { onClick: () => handleShare(platform), className: "w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity", style: { backgroundColor: platformColors[platform] }, "aria-label": `Share on ${platform}`, children: platformIcons[platform] }, platform))) })] }) }));
}

function BlogConclusionFAQ({ conclusion, faqItems = [], title = "Answering Your Top Questions", className = '', style }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { design } = useGEOPilot();
    const [openFAQ, setOpenFAQ] = React.useState(null);
    const containerClasses = React.useMemo(() => {
        return `
      auto-blogify-conclusion-faq
      max-w-4xl
      mx-auto
      px-4
      py-8
      ${className}
    `.trim().replace(/\s+/g, ' ');
    }, [className]);
    const containerStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    const toggleFAQ = (id) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };
    return (jsxRuntime.jsxs("div", { className: containerClasses, style: containerStyles, children: [conclusion && (jsxRuntime.jsxs("div", { className: "mb-12", children: [jsxRuntime.jsx("h2", { className: "text-3xl font-bold mb-6", style: {
                            ...applyHeadingFontStyles(design),
                            color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#111827'
                        }, children: "Conclusion" }), jsxRuntime.jsx("div", { className: "prose prose-lg max-w-none text-gray-700 leading-relaxed", dangerouslySetInnerHTML: { __html: conclusion }, style: {
                            ...applyBodyFontStyles(design),
                            '--tw-prose-body': ((_d = (_c = design === null || design === void 0 ? void 0 : design.theme) === null || _c === void 0 ? void 0 : _c.customColors) === null || _d === void 0 ? void 0 : _d.primary) || '#374151',
                            '--tw-prose-headings': ((_f = (_e = design === null || design === void 0 ? void 0 : design.theme) === null || _e === void 0 ? void 0 : _e.customColors) === null || _f === void 0 ? void 0 : _f.primary) || '#111827',
                            '--tw-prose-links': ((_h = (_g = design === null || design === void 0 ? void 0 : design.theme) === null || _g === void 0 ? void 0 : _g.customColors) === null || _h === void 0 ? void 0 : _h.primary) || '#3B82F6',
                            '--tw-prose-headings-font-family': getHeadingFontFamilyCSS(design),
                            '--tw-prose-body-font-family': getBodyFontFamilyCSS(design)
                        } })] })), faqItems.length > 0 && (jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("h2", { className: "text-3xl font-bold mb-8", style: {
                            ...applyHeadingFontStyles(design),
                            color: ((_k = (_j = design === null || design === void 0 ? void 0 : design.theme) === null || _j === void 0 ? void 0 : _j.customColors) === null || _k === void 0 ? void 0 : _k.primary) || '#111827'
                        }, children: title }), jsxRuntime.jsx("div", { className: "space-y-4", children: faqItems.map((item) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            return (jsxRuntime.jsxs("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: [jsxRuntime.jsx("button", { onClick: () => toggleFAQ(item.id), className: "w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset", children: jsxRuntime.jsxs("div", { className: "flex justify-between items-center", children: [jsxRuntime.jsx("h3", { className: "text-lg font-semibold", style: {
                                                        color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#111827'
                                                    }, children: item.question }), jsxRuntime.jsx("svg", { className: `w-5 h-5 transform transition-transform ${openFAQ === item.id ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }) }), openFAQ === item.id && (jsxRuntime.jsx("div", { className: "px-6 py-4 bg-white border-t border-gray-200", children: jsxRuntime.jsx("div", { className: "prose prose-sm max-w-none text-gray-700", dangerouslySetInnerHTML: { __html: item.answer }, style: {
                                                '--tw-prose-body': ((_d = (_c = design === null || design === void 0 ? void 0 : design.theme) === null || _c === void 0 ? void 0 : _c.customColors) === null || _d === void 0 ? void 0 : _d.primary) || '#374151',
                                                '--tw-prose-headings': ((_f = (_e = design === null || design === void 0 ? void 0 : design.theme) === null || _e === void 0 ? void 0 : _e.customColors) === null || _f === void 0 ? void 0 : _f.primary) || '#111827',
                                                '--tw-prose-links': ((_h = (_g = design === null || design === void 0 ? void 0 : design.theme) === null || _g === void 0 ? void 0 : _g.customColors) === null || _h === void 0 ? void 0 : _h.primary) || '#3B82F6'
                                            } }) }))] }, item.id));
                        }) })] }))] }));
}

function BlogCTAFooter({ ctaButtons = [], footerText = "© 2025 Your Website. All rights reserved.", showFooter = true, className = '', style }) {
    var _a, _b;
    const { design } = useGEOPilot();
    const containerClasses = React.useMemo(() => {
        return `
      auto-blogify-cta-footer
      max-w-4xl
      mx-auto
      px-4
      py-8
      ${className}
    `.trim().replace(/\s+/g, ' ');
    }, [className]);
    const containerStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    const getButtonClasses = (buttonStyle, size) => {
        const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
        const styleClasses = {
            primary: 'text-white shadow-sm hover:opacity-90 focus:ring-blue-500',
            secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500',
            outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
        };
        const sizeClasses = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg'
        };
        return `${baseClasses} ${styleClasses[buttonStyle]} ${sizeClasses[size]}`;
    };
    const getButtonStyles = (buttonStyle) => {
        var _a, _b;
        if (buttonStyle === 'primary') {
            return {
                backgroundColor: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#3B82F6'
            };
        }
        return {};
    };
    return (jsxRuntime.jsxs("div", { className: containerClasses, style: containerStyles, children: [ctaButtons.length > 0 && (jsxRuntime.jsx("div", { className: "mb-12 text-center", children: jsxRuntime.jsxs("div", { className: "bg-gray-50 rounded-lg p-8", children: [jsxRuntime.jsx("h3", { className: "text-2xl font-bold mb-4", style: {
                                color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#111827'
                            }, children: "Ready to Get Started?" }), jsxRuntime.jsx("p", { className: "text-gray-600 mb-6 max-w-2xl mx-auto", children: "Take the next step and explore more content or get in touch with us." }), jsxRuntime.jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: ctaButtons.map((button) => (jsxRuntime.jsx("a", { href: button.url, className: getButtonClasses(button.style, button.size), style: getButtonStyles(button.style), children: button.text }, button.id))) })] }) })), showFooter && (jsxRuntime.jsx("footer", { className: "border-t border-gray-200 pt-8", children: jsxRuntime.jsxs("div", { className: "text-center", children: [jsxRuntime.jsx("p", { className: "text-sm text-gray-500", children: footerText }), jsxRuntime.jsxs("div", { className: "mt-4 flex justify-center space-x-6", children: [jsxRuntime.jsx("a", { href: "/privacy", className: "text-sm text-gray-500 hover:text-gray-700 transition-colors", children: "Privacy Policy" }), jsxRuntime.jsx("a", { href: "/terms", className: "text-sm text-gray-500 hover:text-gray-700 transition-colors", children: "Terms of Service" }), jsxRuntime.jsx("a", { href: "/contact", className: "text-sm text-gray-500 hover:text-gray-700 transition-colors", children: "Contact" })] })] }) }))] }));
}

function BlogRelatedPosts({ config, postId, limit = 3, onPostClick, className = '' }) {
    const { api } = useGEOPilot();
    const [relatedPosts, setRelatedPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.getRelatedPosts(postId, limit);
                setRelatedPosts(response.posts);
            }
            catch (err) {
                setError('Failed to fetch related posts');
                console.error('Error fetching related posts:', err);
            }
            finally {
                setLoading(false);
            }
        };
        if (postId) {
            fetchRelatedPosts();
        }
    }, [api, postId, limit]);
    if (loading) {
        return (jsxRuntime.jsxs("div", { className: `blog-related-posts loading ${className}`, children: [jsxRuntime.jsx("div", { className: "loading-spinner" }), jsxRuntime.jsx("span", { children: "Loading related posts..." })] }));
    }
    if (error) {
        return (jsxRuntime.jsx("div", { className: `blog-related-posts error ${className}`, children: jsxRuntime.jsx("p", { className: "error-message", children: error }) }));
    }
    if (relatedPosts.length === 0) {
        return (jsxRuntime.jsx("div", { className: `blog-related-posts empty ${className}`, children: jsxRuntime.jsx("p", { children: "No related posts found." }) }));
    }
    return (jsxRuntime.jsxs("div", { className: `blog-related-posts ${className}`, children: [jsxRuntime.jsx("h3", { className: "related-posts-title text-xl font-semibold mb-4", children: "Related Posts" }), jsxRuntime.jsx("div", { className: "related-posts-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: relatedPosts.map((post) => (jsxRuntime.jsx("div", { className: "related-post-item", children: jsxRuntime.jsxs("button", { onClick: () => onPostClick === null || onPostClick === void 0 ? void 0 : onPostClick(post), className: "related-post-link w-full text-left bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4", children: [post.featuredImage && (jsxRuntime.jsx("div", { className: "related-post-image mb-3", children: jsxRuntime.jsx(OptimizedImage, { src: post.featuredImage, alt: post.title, width: 300, height: 200, aspectRatio: 3 / 2, loading: "lazy", className: "post-thumbnail w-full h-32 object-cover rounded", enableResponsive: true, sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" }) })), jsxRuntime.jsxs("div", { className: "related-post-content", children: [jsxRuntime.jsx("h4", { className: "related-post-title text-lg font-medium mb-2 line-clamp-2", children: post.title }), post.excerpt && (jsxRuntime.jsx("p", { className: "related-post-excerpt text-gray-600 text-sm mb-3 line-clamp-2", children: post.excerpt })), jsxRuntime.jsxs("div", { className: "related-post-meta flex items-center text-xs text-gray-500 space-x-3", children: [jsxRuntime.jsx("span", { className: "post-date", children: new Date(post.publishedAt).toLocaleDateString() }), post.readingTime && (jsxRuntime.jsxs("span", { className: "post-reading-time", children: [post.readingTime, " min read"] }))] })] })] }) }, post.id))) })] }));
}

function LoadingSpinner({ size = 'md', color = '#3B82F6', className = '' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };
    return (jsxRuntime.jsx("div", { className: `auto-blogify-loading-spinner flex justify-center items-center ${className}`, children: jsxRuntime.jsx("div", { className: `animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]}`, style: { borderTopColor: color }, children: jsxRuntime.jsx("span", { className: "sr-only", children: "Loading..." }) }) }));
}

function ErrorMessage({ message, onRetry, className = '', style }) {
    return (jsxRuntime.jsx("div", { className: `auto-blogify-error-message bg-red-50 border border-red-200 rounded-lg p-6 ${className}`, style: style, children: jsxRuntime.jsxs("div", { className: "flex items-start", children: [jsxRuntime.jsx("div", { className: "flex-shrink-0", children: jsxRuntime.jsx("svg", { className: "h-5 w-5 text-red-400", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), jsxRuntime.jsxs("div", { className: "ml-3 flex-1", children: [jsxRuntime.jsx("h3", { className: "text-sm font-medium text-red-800", children: "Something went wrong" }), jsxRuntime.jsx("p", { className: "mt-2 text-sm text-red-700", children: message }), onRetry && (jsxRuntime.jsx("div", { className: "mt-4", children: jsxRuntime.jsx("button", { type: "button", onClick: onRetry, className: "bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors", children: "Try again" }) }))] })] }) }));
}

const DEFAULT_COLORS = {
    primary: '#3B82F6', secondary: '#6B7280', accent: '#10B981', background: '#FFFFFF',
    surface: '#F9FAFB', text: '#111827', textSecondary: '#6B7280', border: '#E5E7EB',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444'
};
const getStyles = (colors) => `.audio-reader{background:${colors.primary};border-radius:16px;padding:20px;margin:20px 0;box-shadow:0 8px 32px rgba(0,0,0,0.1);backdrop-filter:blur(10px);border:1px solid ${colors.border};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}.audio-reader-container{display:flex;align-items:center;gap:16px}.audio-reader-play-btn{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);border-radius:50%;width:56px;height:56px;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;transition:all 0.3s ease;backdrop-filter:blur(10px);position:relative}.audio-reader-play-btn:hover:not(:disabled){background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.5);transform:scale(1.05)}.audio-reader-play-btn:disabled{opacity:0.6;cursor:not-allowed}.audio-reader-play-btn.playing{background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.6);animation:pulse 2s infinite}.audio-reader-play-btn.loading{background:rgba(255,255,255,0.2)}@keyframes pulse{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,255,255,0.4)}70%{transform:scale(1.05);box-shadow:0 0 0 10px rgba(255,255,255,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,255,255,0)}}.spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.audio-reader-info{flex:1;color:white;min-width:0}.audio-reader-title{font-weight:600;font-size:16px;margin-bottom:4px;text-shadow:0 2px 4px rgba(0,0,0,0.1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audio-reader-duration{font-size:14px;opacity:0.9;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audio-reader-controls{display:flex;gap:8px;align-items:center}.audio-reader-control-btn,.audio-reader-settings-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:8px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;transition:all 0.3s ease}.audio-reader-control-btn:hover,.audio-reader-settings-btn:hover{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.4);transform:translateY(-1px)}.audio-reader-settings-btn.active{background:rgba(255,255,255,0.25);border-color:rgba(255,255,255,0.5)}.audio-reader-progress-container{margin-top:16px;padding:0 4px}.audio-reader-progress-slider{width:100%;height:8px;border-radius:4px;background:rgba(255,255,255,0.2);outline:none;cursor:pointer;-webkit-appearance:none;transition:all 0.3s ease}.audio-reader-progress-slider:disabled{opacity:0.5;cursor:not-allowed}.audio-reader-progress-slider::-webkit-slider-track{height:8px;border-radius:4px;background:rgba(255,255,255,0.2)}.audio-reader-progress-slider::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:white;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:all 0.3s ease;border:2px solid rgba(255,255,255,0.8);margin-top:-8px}.audio-reader-progress-slider::-webkit-slider-thumb:hover{transform:scale(1.1);box-shadow:0 4px 16px rgba(0,0,0,0.4)}.audio-reader-progress-slider::-moz-range-track{height:8px;border-radius:4px;background:rgba(255,255,255,0.2);border:none}.audio-reader-progress-slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:white;cursor:pointer;border:2px solid rgba(255,255,255,0.8);box-shadow:0 2px 8px rgba(0,0,0,0.3)}.audio-reader-progress-labels{display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:rgba(255,255,255,0.7)}.audio-reader-settings{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:16px;margin-top:16px;backdrop-filter:blur(10px)}.audio-reader-setting{display:flex;flex-direction:column;gap:12px}.audio-reader-setting label{color:white;font-size:14px;font-weight:500;text-shadow:0 1px 2px rgba(0,0,0,0.1)}.audio-reader-slider{width:100%;height:6px;border-radius:3px;background:rgba(255,255,255,0.2);outline:none;cursor:pointer;-webkit-appearance:none}.audio-reader-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:white;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:all 0.3s ease;margin-top:-7px}.audio-reader-slider::-webkit-slider-thumb:hover{transform:scale(1.1);box-shadow:0 4px 12px rgba(0,0,0,0.3)}.audio-reader-slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:white;cursor:pointer;border:none;box-shadow:0 2px 6px rgba(0,0,0,0.2)}.audio-reader-speed-presets{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.audio-reader-preset-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 12px;color:white;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.3s ease;min-width:44px}.audio-reader-preset-btn:hover{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.4)}.audio-reader-preset-btn.active{background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.6);box-shadow:0 2px 8px rgba(0,0,0,0.2)}.audio-reader-error{display:flex;align-items:center;gap:8px;background:${colors.error}20;color:${colors.error};border:1px solid ${colors.error}50;border-radius:8px;padding:12px 16px;margin-top:16px;font-size:14px;backdrop-filter:blur(10px);position:relative}.audio-reader-error span{flex:1}.audio-reader-error-close{background:none;border:none;color:${colors.error};font-size:18px;font-weight:bold;cursor:pointer;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:all 0.2s ease}.audio-reader-error-close:hover{background:rgba(255,255,255,0.1)}.audio-reader svg{width:24px;height:24px;flex-shrink:0}.audio-reader-settings-btn svg,.audio-reader-control-btn svg{width:18px;height:18px}.audio-reader-error svg{width:16px;height:16px}@media (max-width:640px){.audio-reader{padding:16px;margin:16px 0}.audio-reader-container{gap:12px}.audio-reader-play-btn{width:48px;height:48px}.audio-reader-title{font-size:14px}.audio-reader-duration{font-size:12px}.audio-reader-controls{gap:6px}.audio-reader-control-btn,.audio-reader-settings-btn{width:36px;height:36px}.audio-reader-speed-presets{gap:6px}.audio-reader-preset-btn{padding:4px 8px;font-size:11px;min-width:36px}.audio-reader-settings{padding:12px}}@media (prefers-color-scheme:dark){.audio-reader{box-shadow:0 8px 32px rgba(0,0,0,0.3)}}@media (prefers-contrast:high){.audio-reader{border:2px solid white}.audio-reader-play-btn,.audio-reader-control-btn,.audio-reader-settings-btn{border-width:2px}}@media (prefers-reduced-motion:reduce){.audio-reader-play-btn,.audio-reader-control-btn,.audio-reader-settings-btn,.audio-reader-preset-btn,.audio-reader-progress-slider::-webkit-slider-thumb,.audio-reader-slider::-webkit-slider-thumb{transition:none}.audio-reader-play-btn.playing{animation:none}.spin{animation:none}}.audio-reader-play-btn:focus,.audio-reader-control-btn:focus,.audio-reader-settings-btn:focus,.audio-reader-preset-btn:focus{outline:2px solid rgba(255,255,255,0.8);outline-offset:2px}.audio-reader-progress-slider:focus,.audio-reader-slider:focus{outline:2px solid rgba(255,255,255,0.8);outline-offset:2px;border-radius:4px}`;
function AudioReader({ post, config, className, style }) {
    var _a, _b;
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [speed, setSpeed] = React.useState(1.0);
    const [showSettings, setShowSettings] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [currentTextIndex, setCurrentTextIndex] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    const themeColors = React.useMemo(() => { var _a, _b; return ((_b = (_a = config.design) === null || _a === void 0 ? void 0 : _a.theme) === null || _b === void 0 ? void 0 : _b.customColors) ? { ...DEFAULT_COLORS, ...config.design.theme.customColors } : DEFAULT_COLORS; }, [(_b = (_a = config.design) === null || _a === void 0 ? void 0 : _a.theme) === null || _b === void 0 ? void 0 : _b.customColors]);
    const speechSynthesisRef = React.useRef(null);
    const progressIntervalRef = React.useRef(null);
    const textChunksRef = React.useRef([]);
    const startTimeRef = React.useRef(0);
    const pausedTimeRef = React.useRef(0);
    const totalPausedTimeRef = React.useRef(0);
    const voicesLoadedRef = React.useRef(false);
    const isIntentionallyStoppedRef = React.useRef(false);
    // Wait for voices to load
    React.useEffect(() => {
        const loadVoices = () => {
            voicesLoadedRef.current = true;
        };
        if (speechSynthesis.getVoices().length > 0) {
            voicesLoadedRef.current = true;
        }
        else {
            speechSynthesis.addEventListener('voiceschanged', loadVoices);
            return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        }
    }, []);
    const prepareTextForSpeech = React.useCallback(() => {
        const parts = [post.title, post.excerpt].filter(Boolean);
        if (post.content) {
            const cleanContent = post.content
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'")
                .trim();
            parts.push(cleanContent);
        }
        return parts.join('. ');
    }, [post]);
    const splitTextIntoChunks = React.useCallback((text) => {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const chunks = [];
        let currentChunk = '';
        for (const sentence of sentences) {
            const trimmed = sentence.trim();
            if (currentChunk.length + trimmed.length > 150 && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = trimmed;
            }
            else {
                currentChunk += (currentChunk ? '. ' : '') + trimmed;
            }
        }
        if (currentChunk.trim())
            chunks.push(currentChunk.trim());
        return chunks.length > 0 ? chunks : [text];
    }, []);
    const getEstimatedDuration = React.useCallback(() => {
        const text = prepareTextForSpeech();
        const wordsPerMinute = 150 / speed;
        const estimatedWords = text.length / 5;
        return Math.ceil(estimatedWords / wordsPerMinute * 60);
    }, [prepareTextForSpeech, speed]);
    const formatTime = React.useCallback((time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);
    const startProgressTracking = React.useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        const estimatedDuration = getEstimatedDuration();
        setDuration(estimatedDuration);
        startTimeRef.current = Date.now();
        progressIntervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current + totalPausedTimeRef.current) / 1000;
            const newCurrentTime = Math.min(elapsed, estimatedDuration);
            const newProgress = estimatedDuration > 0 ? (newCurrentTime / estimatedDuration) * 100 : 0;
            setCurrentTime(newCurrentTime);
            setProgress(Math.min(newProgress, 100));
            // Auto-stop when estimated duration is reached
            if (newCurrentTime >= estimatedDuration && isPlaying) {
                stopAudio();
            }
        }, 100);
    }, [getEstimatedDuration, isPlaying]);
    const stopProgressTracking = React.useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);
    const resetProgress = React.useCallback(() => {
        setProgress(0);
        setCurrentTime(0);
        setCurrentTextIndex(0);
        totalPausedTimeRef.current = 0;
        pausedTimeRef.current = 0;
        stopProgressTracking();
    }, [stopProgressTracking]);
    const getBestVoice = React.useCallback(() => {
        const voices = speechSynthesis.getVoices();
        const englishVoices = voices.filter(v => v.lang.startsWith('en') && v.localService);
        if (englishVoices.length > 0) {
            return englishVoices.find(v => v.lang === 'en-US') ||
                englishVoices.find(v => v.lang === 'en-GB') ||
                englishVoices[0];
        }
        return voices.find(v => v.lang.startsWith('en')) || voices[0];
    }, []);
    const playWithBrowserTTS = React.useCallback((startFromIndex = 0) => {
        if (!('speechSynthesis' in window)) {
            setError('Text-to-speech not supported in this browser');
            return;
        }
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        const text = prepareTextForSpeech();
        if (!text.trim()) {
            setError('No content to read');
            return;
        }
        textChunksRef.current = splitTextIntoChunks(text);
        if (startFromIndex >= textChunksRef.current.length) {
            setIsPlaying(false);
            resetProgress();
            return;
        }
        const currentChunk = textChunksRef.current[startFromIndex];
        const utterance = new SpeechSynthesisUtterance(currentChunk);
        // Configure voice
        const selectedVoice = getBestVoice();
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = Math.max(0.5, Math.min(2.0, speed));
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';
        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
            setError(null);
            setCurrentTextIndex(startFromIndex);
            if (startFromIndex === 0) {
                resetProgress();
            }
            startProgressTracking();
        };
        utterance.onend = () => {
            const nextIndex = startFromIndex + 1;
            if (nextIndex < textChunksRef.current.length && isPlaying) {
                // Small delay between chunks
                setTimeout(() => playWithBrowserTTS(nextIndex), 50);
            }
            else {
                // Finished reading
                setIsPlaying(false);
                setIsPaused(false);
                setProgress(100);
                setCurrentTime(duration);
                stopProgressTracking();
            }
        };
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            // Don't show error for intentional interruptions (stop/pause)
            if (isIntentionallyStoppedRef.current) {
                isIntentionallyStoppedRef.current = false;
                return;
            }
            // Only show error for actual speech synthesis errors
            if (event.error !== 'interrupted') {
                const errorMessage = event.error || 'Unknown speech synthesis error';
                setError(`Speech error: ${errorMessage}`);
            }
            setIsPlaying(false);
            setIsPaused(false);
            stopProgressTracking();
        };
        speechSynthesisRef.current = utterance;
        // Small delay to ensure proper initialization
        setTimeout(() => {
            try {
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                }
                speechSynthesis.speak(utterance);
            }
            catch (err) {
                console.error('Error starting speech:', err);
                setError('Failed to start speech synthesis');
                setIsPlaying(false);
                stopProgressTracking();
            }
        }, 10);
    }, [prepareTextForSpeech, splitTextIntoChunks, speed, getBestVoice, resetProgress, startProgressTracking, isPlaying, duration, stopProgressTracking]);
    const togglePlayPause = React.useCallback(() => {
        if (!voicesLoadedRef.current && speechSynthesis.getVoices().length === 0) {
            setError('Voices are still loading, please try again in a moment');
            return;
        }
        if (isPlaying) {
            // Pause
            isIntentionallyStoppedRef.current = true;
            speechSynthesis.cancel();
            setIsPlaying(false);
            setIsPaused(true);
            pausedTimeRef.current = Date.now();
            stopProgressTracking();
        }
        else if (isPaused) {
            // Resume from where we left off
            totalPausedTimeRef.current += Date.now() - pausedTimeRef.current;
            playWithBrowserTTS(currentTextIndex);
        }
        else {
            // Start from beginning or resume from current position
            if (progress > 0) {
                // Resume from current position (user stopped and wants to continue)
                playWithBrowserTTS(currentTextIndex);
            }
            else {
                // Start from beginning (first time playing)
                resetProgress();
                playWithBrowserTTS(0);
            }
        }
    }, [voicesLoadedRef, isPlaying, isPaused, currentTextIndex, stopProgressTracking, playWithBrowserTTS, resetProgress, progress]);
    const stopAudio = React.useCallback(() => {
        isIntentionallyStoppedRef.current = true;
        speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        // Don't reset progress when stopping - preserve position for resume
        stopProgressTracking();
    }, [stopProgressTracking]);
    const handleProgressChange = React.useCallback((e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        const text = prepareTextForSpeech();
        const chunks = splitTextIntoChunks(text);
        const targetIndex = Math.floor((newProgress / 100) * chunks.length);
        const clampedIndex = Math.max(0, Math.min(targetIndex, chunks.length - 1));
        // Update time based on progress
        const newTime = (newProgress / 100) * duration;
        setCurrentTime(newTime);
        if (isPlaying || isPaused) {
            // Stop current speech and start from new position
            isIntentionallyStoppedRef.current = true;
            speechSynthesis.cancel();
            setCurrentTextIndex(clampedIndex);
            // Reset timing for new position
            totalPausedTimeRef.current = newTime * 1000;
            if (isPlaying) {
                // Continue playing from new position
                setTimeout(() => playWithBrowserTTS(clampedIndex), 100);
            }
            else {
                // Just paused at new position
                setIsPaused(true);
                setIsPlaying(false);
            }
        }
    }, [prepareTextForSpeech, splitTextIntoChunks, duration, isPlaying, isPaused, playWithBrowserTTS]);
    const handleSpeedChange = React.useCallback((e) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
        // If currently playing, restart with new speed
        if (isPlaying) {
            isIntentionallyStoppedRef.current = true;
            speechSynthesis.cancel();
            setTimeout(() => playWithBrowserTTS(currentTextIndex), 100);
        }
    }, [isPlaying, currentTextIndex, playWithBrowserTTS]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            stopProgressTracking();
            speechSynthesis.cancel();
        };
    }, [stopProgressTracking]);
    // Handle page visibility changes
    React.useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isPlaying) {
                // Page became hidden, pause to prevent issues
                togglePlayPause();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isPlaying, togglePlayPause]);
    return (jsxRuntime.jsxs("div", { className: `audio-reader ${className || ''}`, style: style, children: [jsxRuntime.jsxs("div", { className: "audio-reader-container", children: [jsxRuntime.jsx("button", { onClick: togglePlayPause, disabled: isLoading, className: `audio-reader-play-btn ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`, title: isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Listen to article', children: isLoading ? (jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "spin", children: jsxRuntime.jsx("path", { d: "M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z" }) })) : isPlaying ? (jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: jsxRuntime.jsx("path", { d: "M6 4h4v16H6V4zm8 0h4v16h-4V4z" }) })) : (jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: jsxRuntime.jsx("path", { d: "M8 5v14l11-7z" }) })) }), jsxRuntime.jsxs("div", { className: "audio-reader-info", children: [jsxRuntime.jsx("div", { className: "audio-reader-title", children: isLoading ? 'Loading...' : isPlaying ? 'Now Playing' : isPaused ? 'Paused' : 'Listen to Article' }), jsxRuntime.jsx("div", { className: "audio-reader-duration", children: (isPlaying || isPaused || progress > 0) ?
                                    `${formatTime(currentTime)} / ${formatTime(duration)} • ${Math.round(progress)}%` :
                                    `~${formatTime(getEstimatedDuration())} estimated` })] }), jsxRuntime.jsxs("div", { className: "audio-reader-controls", children: [(isPlaying || isPaused) && (jsxRuntime.jsx("button", { onClick: stopAudio, className: "audio-reader-control-btn", title: "Stop", children: jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: jsxRuntime.jsx("path", { d: "M6 6h12v12H6V6z" }) }) })), jsxRuntime.jsx("button", { onClick: () => setShowSettings(!showSettings), className: `audio-reader-settings-btn ${showSettings ? 'active' : ''}`, title: "Audio Settings", children: jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: jsxRuntime.jsx("path", { d: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" }) }) })] })] }), (isPlaying || isPaused || progress > 0) && (jsxRuntime.jsxs("div", { className: "audio-reader-progress-container", children: [jsxRuntime.jsx("input", { type: "range", min: "0", max: "100", step: "0.1", value: progress, onChange: handleProgressChange, className: "audio-reader-progress-slider", disabled: isLoading }), jsxRuntime.jsxs("div", { className: "audio-reader-progress-labels", children: [jsxRuntime.jsx("span", { children: formatTime(currentTime) }), jsxRuntime.jsx("span", { children: formatTime(duration) })] })] })), showSettings && (jsxRuntime.jsx("div", { className: "audio-reader-settings", children: jsxRuntime.jsxs("div", { className: "audio-reader-setting", children: [jsxRuntime.jsxs("label", { children: ["Speed: ", speed.toFixed(1), "x"] }), jsxRuntime.jsx("input", { type: "range", min: "0.5", max: "2.0", step: "0.1", value: speed, onChange: handleSpeedChange, className: "audio-reader-slider" }), jsxRuntime.jsx("div", { className: "audio-reader-speed-presets", children: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(preset => (jsxRuntime.jsxs("button", { onClick: () => {
                                    setSpeed(preset);
                                    if (isPlaying) {
                                        isIntentionallyStoppedRef.current = true;
                                        speechSynthesis.cancel();
                                        setTimeout(() => playWithBrowserTTS(currentTextIndex), 100);
                                    }
                                }, className: `audio-reader-preset-btn ${speed === preset ? 'active' : ''}`, children: [preset, "x"] }, preset))) })] }) })), error && (jsxRuntime.jsxs("div", { className: "audio-reader-error", children: [jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: jsxRuntime.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) }), jsxRuntime.jsx("span", { children: error }), jsxRuntime.jsx("button", { onClick: () => setError(null), className: "audio-reader-error-close", title: "Close", children: "\u00D7" })] })), jsxRuntime.jsx("style", { dangerouslySetInnerHTML: { __html: getStyles(themeColors) } })] }));
}

function SEOHead({ post, config, title, description, image, url, type = post ? 'article' : 'website', structuredData, metaTags, enableAdvancedSEO = true, enablePerformanceOptimizations = true }) {
    var _a;
    const seoConfig = config.seo || {};
    const baseUrl = config.customDomain || (typeof window !== 'undefined' ? window.location.origin : '');
    // Use provided meta tags or generate defaults
    const finalMetaTags = metaTags || {
        title: title || (post === null || post === void 0 ? void 0 : post.seoTitle) || (post === null || post === void 0 ? void 0 : post.title) || 'Blog',
        description: description || (post === null || post === void 0 ? void 0 : post.seoDescription) || (post === null || post === void 0 ? void 0 : post.excerpt) || 'Blog posts',
        canonical: url || (typeof window !== 'undefined' ? window.location.href : baseUrl),
        ogTitle: title || (post === null || post === void 0 ? void 0 : post.seoTitle) || (post === null || post === void 0 ? void 0 : post.title) || 'Blog',
        ogDescription: description || (post === null || post === void 0 ? void 0 : post.seoDescription) || (post === null || post === void 0 ? void 0 : post.excerpt) || 'Blog posts',
        ogImage: image || (post === null || post === void 0 ? void 0 : post.featuredImage) || `${baseUrl}/og-image.png`,
        twitterTitle: title || (post === null || post === void 0 ? void 0 : post.seoTitle) || (post === null || post === void 0 ? void 0 : post.title) || 'Blog',
        twitterDescription: description || (post === null || post === void 0 ? void 0 : post.seoDescription) || (post === null || post === void 0 ? void 0 : post.excerpt) || 'Blog posts',
        twitterImage: image || (post === null || post === void 0 ? void 0 : post.featuredImage) || `${baseUrl}/og-image.png`,
        robots: ((post === null || post === void 0 ? void 0 : post.status) === 'published' || !(post === null || post === void 0 ? void 0 : post.status)) ? 'index, follow' : 'noindex, nofollow'
    };
    // Determine values
    const finalTitle = finalMetaTags.title;
    const finalDescription = finalMetaTags.description;
    const finalImage = finalMetaTags.ogImage;
    const finalUrl = finalMetaTags.canonical;
    // Keywords
    const keywords = ((_a = post === null || post === void 0 ? void 0 : post.seoKeywords) === null || _a === void 0 ? void 0 : _a.join(', ')) || '';
    // Canonical URL
    const canonicalUrl = seoConfig.canonicalUrl || finalUrl;
    // Performance optimizations - only run in browser
    React.useEffect(() => {
        if (typeof window !== 'undefined' && enablePerformanceOptimizations) {
            // Preload critical images
            if (finalImage) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = finalImage;
                link.as = 'image';
                document.head.appendChild(link);
            }
            // Preconnect to API domain
            const baseUrl = config.apiUrl || 'https://geopilotbackend.vercel.app';
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = new URL(baseUrl).origin;
            document.head.appendChild(link);
            // DNS prefetch for external domains
            if (config.customDomain) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = config.customDomain;
                document.head.appendChild(link);
            }
        }
    }, [enablePerformanceOptimizations, finalImage, config.customDomain]);
    // Set meta tags in browser environment only
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            document.title = finalTitle;
            // Set meta description
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', finalDescription);
            // Set keywords if provided
            if (keywords) {
                let metaKeywords = document.querySelector('meta[name="keywords"]');
                if (!metaKeywords) {
                    metaKeywords = document.createElement('meta');
                    metaKeywords.setAttribute('name', 'keywords');
                    document.head.appendChild(metaKeywords);
                }
                metaKeywords.setAttribute('content', keywords);
            }
            // Set robots
            let metaRobots = document.querySelector('meta[name="robots"]');
            if (!metaRobots) {
                metaRobots = document.createElement('meta');
                metaRobots.setAttribute('name', 'robots');
                document.head.appendChild(metaRobots);
            }
            metaRobots.setAttribute('content', 'index, follow');
            // Set canonical URL
            let linkCanonical = document.querySelector('link[rel="canonical"]');
            if (!linkCanonical) {
                linkCanonical = document.createElement('link');
                linkCanonical.setAttribute('rel', 'canonical');
                document.head.appendChild(linkCanonical);
            }
            linkCanonical.setAttribute('href', canonicalUrl);
        }
    }, [finalTitle, finalDescription, keywords, canonicalUrl]);
    // Return only structured data - no DOM manipulation during build
    return (jsxRuntime.jsxs(React.Fragment, { children: [enableAdvancedSEO && structuredData && structuredData.map((data, index) => (jsxRuntime.jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
                    __html: JSON.stringify(data)
                } }, index))), enableAdvancedSEO && !structuredData && post && (jsxRuntime.jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": finalTitle,
                        "description": finalDescription,
                        "image": finalImage,
                        "url": finalUrl,
                        "datePublished": post.publishedAt,
                        "dateModified": post.updatedAt || post.publishedAt,
                        "author": {
                            "@type": "Person",
                            "name": post.author || post.authorName || "Blog Author"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Blog",
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${baseUrl}/logo.png`
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": finalUrl
                        }
                    })
                } }))] }));
}

function Breadcrumbs({ items, showHome = true, homeLabel = 'Home', homeUrl = '/', separator = '/', className = '', style, enableStructuredData = true }) {
    const { design } = useGEOPilot();
    const breadcrumbItems = React.useMemo(() => {
        const allItems = [];
        if (showHome) {
            allItems.push({
                label: homeLabel,
                url: homeUrl,
                position: 1
            });
        }
        // Add other items with adjusted positions
        items.forEach((item, index) => {
            allItems.push({
                ...item,
                position: showHome ? index + 2 : index + 1
            });
        });
        return allItems;
    }, [items, showHome, homeLabel, homeUrl]);
    const containerClasses = React.useMemo(() => {
        return `
      auto-blogify-breadcrumbs
      flex
      items-center
      space-x-2
      text-sm
      text-gray-600
      ${className}
    `.trim().replace(/\s+/g, ' ');
    }, [className]);
    const containerStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    const linkClasses = React.useMemo(() => {
        return `
      hover:text-gray-900
      transition-colors
      duration-200
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:ring-opacity-50
      rounded
      px-1
      py-0.5
    `.trim().replace(/\s+/g, ' ');
    }, []);
    const currentItemClasses = React.useMemo(() => {
        var _a, _b;
        return `
      text-gray-900
      font-medium
      ${((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) ? '' : 'text-blue-600'}
    `.trim().replace(/\s+/g, ' ');
    }, [design]);
    const structuredData = React.useMemo(() => {
        if (!enableStructuredData)
            return null;
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems.map(item => ({
                "@type": "ListItem",
                "position": item.position,
                "name": item.label,
                "item": item.url
            }))
        };
    }, [breadcrumbItems, enableStructuredData]);
    if (breadcrumbItems.length === 0) {
        return null;
    }
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [structuredData && (jsxRuntime.jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
                    __html: JSON.stringify(structuredData)
                } })), jsxRuntime.jsx("nav", { className: containerClasses, style: containerStyles, "aria-label": "Breadcrumb", role: "navigation", children: jsxRuntime.jsx("ol", { className: "flex items-center space-x-2", itemScope: true, itemType: "https://schema.org/BreadcrumbList", children: breadcrumbItems.map((item, index) => {
                        var _a, _b, _c, _d;
                        return (jsxRuntime.jsxs("li", { className: "flex items-center", itemProp: "itemListElement", itemScope: true, itemType: "https://schema.org/ListItem", children: [index > 0 && (jsxRuntime.jsx("span", { className: "mx-2 text-gray-400", "aria-hidden": "true", children: separator })), index === breadcrumbItems.length - 1 ? (
                                // Current page (last item)
                                jsxRuntime.jsx("span", { className: currentItemClasses, style: {
                                        color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || '#2563EB'
                                    }, itemProp: "name", "aria-current": "page", children: item.label })) : (
                                // Link to other pages
                                jsxRuntime.jsx("a", { href: item.url, className: linkClasses, itemProp: "item", style: {
                                        color: ((_d = (_c = design === null || design === void 0 ? void 0 : design.theme) === null || _c === void 0 ? void 0 : _c.customColors) === null || _d === void 0 ? void 0 : _d.primary) ? `${design.theme.customColors.primary}80` : '#6B7280'
                                    }, children: jsxRuntime.jsx("span", { itemProp: "name", children: item.label }) })), jsxRuntime.jsx("meta", { itemProp: "position", content: item.position.toString() })] }, item.position));
                    }) }) })] }));
}

/**
 * Extract headings from HTML content and generate table of contents
 */
function extractHeadingsFromContent(content) {
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const level = parseInt(match[1]);
        const id = match[2];
        const title = match[3].replace(/<[^>]*>/g, ''); // Remove HTML tags
        headings.push({
            id,
            title,
            level
        });
    }
    return headings;
}
/**
 * Add IDs to headings in HTML content if they don't exist
 */
function addIdsToHeadings(content) {
    const headingRegex = /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi;
    return content.replace(headingRegex, (match, level, attributes, title) => {
        // Check if ID already exists
        if (attributes.includes('id=')) {
            return match;
        }
        // Generate ID from title
        const id = title
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();
        return `<h${level}${attributes} id="${id}">${title}</h${level}>`;
    });
}
/**
 * Parse content into sections based on headings
 */
function parseContentIntoSections(content) {
    const sections = [];
    // First, add IDs to headings if they don't exist
    const contentWithIds = addIdsToHeadings(content);
    // Split content by headings
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
    const parts = contentWithIds.split(headingRegex);
    for (let i = 0; i < parts.length; i += 4) {
        if (parts[i + 1] && parts[i + 2] && parts[i + 3]) {
            const level = parseInt(parts[i + 1]);
            const id = parts[i + 2];
            const title = parts[i + 3].replace(/<[^>]*>/g, '');
            const sectionContent = parts[i + 4] || '';
            sections.push({
                id,
                title,
                level,
                content: sectionContent.trim()
            });
        }
    }
    return sections;
}
/**
 * Generate structured content with proper heading hierarchy
 */
function generateStructuredContent(content, options = {}) {
    const { addIds = true, generateTOC = true, maxHeadingLevel = 6 } = options;
    let processedContent = content;
    if (addIds) {
        processedContent = addIdsToHeadings(content);
    }
    const toc = generateTOC ? extractHeadingsFromContent(processedContent) : [];
    const sections = parseContentIntoSections(processedContent);
    return {
        content: processedContent,
        toc,
        sections
    };
}

function BlogPost({ config, postId, slug, onBack, showRelatedPosts = true, enableComments = false, enableSharing = true, websiteName = "Website's Blog", blogHomeUrl = "/", mainWebsiteUrl = "/", logoUrl, navigationItems = [], showSiteHeader = true, showTOC = true, showSocialShare = true, showConclusionFAQ = true, showCTAFooter = true, showBreadcrumbs = true, showContentFreshness = true, conclusion, faqItems = [], ctaButtons = [], footerText, className = '', style }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const { design } = useGEOPilot();
    const { post, loading, error, refetch } = useBlogPost({
        postId,
        slug,
        autoFetch: true,
        trackView: true
    });
    const { metaTags, structuredData, loading: seoLoading } = useSEO(config, post, 'post');
    // Get component settings from design configuration
    const componentSettings = getComponentSettings(design, 'blogPost');
    // Get CTA buttons from design configuration if not provided as props
    const designCTAButtons = ((_a = design === null || design === void 0 ? void 0 : design.ctaButtons) === null || _a === void 0 ? void 0 : _a.filter(btn => btn.enabled).map(btn => ({
        id: btn.id,
        text: btn.text,
        url: btn.url,
        style: (btn.style === 'primary' || btn.style === 'secondary' || btn.style === 'outline')
            ? btn.style
            : 'primary',
        size: (btn.size === 'sm' || btn.size === 'md' || btn.size === 'lg')
            ? btn.size
            : 'md'
    }))) || [];
    const finalCTAButtons = ctaButtons.length > 0 ? ctaButtons : designCTAButtons;
    // Generate structured content with TOC
    const structuredContent = React.useMemo(() => {
        if (!(post === null || post === void 0 ? void 0 : post.content))
            return { content: '', toc: [], sections: [] };
        return generateStructuredContent(post.content, {
            addIds: true,
            generateTOC: true,
            maxHeadingLevel: 6
        });
    }, [post === null || post === void 0 ? void 0 : post.content]);
    const containerClasses = React.useMemo(() => {
        return `
      auto-blogify-blog-post-enhanced
      min-h-screen
      bg-white
      ${className}
    `.trim().replace(/\s+/g, ' ');
    }, [className]);
    const containerStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    if (loading) {
        return (jsxRuntime.jsx("div", { className: "auto-blogify-blog-post-loading flex justify-center items-center min-h-96", children: jsxRuntime.jsx(LoadingSpinner, {}) }));
    }
    if (error || !post) {
        return (jsxRuntime.jsx(ErrorMessage, { message: error || 'Blog post not found', onRetry: refetch, className: className, style: style }));
    }
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SEOHead, { post: post, config: config, metaTags: metaTags, structuredData: structuredData, enableAdvancedSEO: true }), jsxRuntime.jsxs("div", { className: containerClasses, style: containerStyles, children: [(((_b = config.theme) === null || _b === void 0 ? void 0 : _b.customCSS) || (design === null || design === void 0 ? void 0 : design.customCSS)) && (jsxRuntime.jsx("style", { dangerouslySetInnerHTML: { __html: ((_c = config.theme) === null || _c === void 0 ? void 0 : _c.customCSS) || (design === null || design === void 0 ? void 0 : design.customCSS) || '' } })), showSiteHeader && (jsxRuntime.jsx(BlogSiteHeader, { websiteName: websiteName, blogHomeUrl: blogHomeUrl, mainWebsiteUrl: mainWebsiteUrl, logoUrl: logoUrl, navigationItems: navigationItems })), showBreadcrumbs && (jsxRuntime.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: jsxRuntime.jsx(Breadcrumbs, { items: [
                                { label: 'Blog', url: blogHomeUrl, position: 2 },
                                ...(((_d = post.categories) === null || _d === void 0 ? void 0 : _d.map((category, index) => ({
                                    label: category,
                                    url: `${blogHomeUrl}?category=${encodeURIComponent(category)}`,
                                    position: 3 + index
                                }))) || []),
                                { label: post.title, url: typeof window !== 'undefined' ? window.location.href : '', position: 4 }
                            ], showHome: true, homeLabel: websiteName, homeUrl: mainWebsiteUrl, enableStructuredData: true }) })), jsxRuntime.jsx(BlogPostMetadata, { title: post.title, coverImage: post.featuredImage, publishDate: post.publishedAt, updatedDate: post.updatedAt, author: post.authorName, readingTime: post.readingTime, showContentFreshness: showContentFreshness }), jsxRuntime.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: jsxRuntime.jsxs("div", { className: "flex flex-col lg:flex-row gap-8 justify-center", children: [showTOC && structuredContent.toc.length > 0 && (jsxRuntime.jsx("aside", { className: "hidden lg:block lg:w-80 lg:flex-shrink-0", children: jsxRuntime.jsx("div", { className: "sticky top-24", children: jsxRuntime.jsx(BlogTableOfContents, { items: structuredContent.toc, isSticky: true, position: "sidebar" }) }) })), jsxRuntime.jsxs("main", { className: "flex-1 max-w-4xl mx-auto lg:mx-0", children: [onBack && (jsxRuntime.jsxs("button", { onClick: onBack, className: "flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors", children: [jsxRuntime.jsx("svg", { className: "w-5 h-5 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z", clipRule: "evenodd" }) }), "Back to Blog"] })), post.categories && post.categories.length > 0 && (jsxRuntime.jsx("div", { className: "mb-6", children: post.categories.map((category) => {
                                                var _a, _b, _c, _d, _e;
                                                return (jsxRuntime.jsx("span", { className: "inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full mr-2 mb-2", style: {
                                                        backgroundColor: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) ? `${design.theme.customColors.primary}20` : '#f3f4f6',
                                                        color: ((_d = (_c = design === null || design === void 0 ? void 0 : design.theme) === null || _c === void 0 ? void 0 : _c.customColors) === null || _d === void 0 ? void 0 : _d.primary) || ((_e = config.theme) === null || _e === void 0 ? void 0 : _e.primaryColor) || '#6b7280'
                                                    }, children: category }, category));
                                            }) })), post.excerpt && (jsxRuntime.jsx("div", { className: "text-xl text-gray-600 mb-8 leading-relaxed italic border-l-4 border-gray-200 pl-6", children: post.excerpt })), jsxRuntime.jsx(AudioReader, { post: post, config: config, className: "mb-6" }), jsxRuntime.jsx("div", { className: "prose prose-lg max-w-none mb-8", dangerouslySetInnerHTML: { __html: structuredContent.content }, style: {
                                                ...applyBodyFontStyles(design),
                                                '--tw-prose-body': ((_f = (_e = design === null || design === void 0 ? void 0 : design.theme) === null || _e === void 0 ? void 0 : _e.customColors) === null || _f === void 0 ? void 0 : _f.primary) || ((_g = config.theme) === null || _g === void 0 ? void 0 : _g.primaryColor) || '#374151',
                                                '--tw-prose-headings': ((_j = (_h = design === null || design === void 0 ? void 0 : design.theme) === null || _h === void 0 ? void 0 : _h.customColors) === null || _j === void 0 ? void 0 : _j.primary) || ((_k = config.theme) === null || _k === void 0 ? void 0 : _k.primaryColor) || '#111827',
                                                '--tw-prose-links': ((_m = (_l = design === null || design === void 0 ? void 0 : design.theme) === null || _l === void 0 ? void 0 : _l.customColors) === null || _m === void 0 ? void 0 : _m.primary) || ((_o = config.theme) === null || _o === void 0 ? void 0 : _o.primaryColor) || '#3B82F6',
                                                '--tw-prose-headings-font-family': getHeadingFontFamilyCSS(design),
                                                '--tw-prose-body-font-family': getBodyFontFamilyCSS(design)
                                            } }), componentSettings.showTags && post.tags && post.tags.length > 0 && (jsxRuntime.jsxs("div", { className: "border-t border-gray-200 pt-6 mb-8", children: [jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-3", children: "Tags" }), jsxRuntime.jsx("div", { className: "flex flex-wrap gap-2", children: post.tags.map((tag) => (jsxRuntime.jsxs("span", { className: "inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer", children: ["#", tag] }, tag))) })] })), showSocialShare && enableSharing && (jsxRuntime.jsx(BlogSocialShare, { url: typeof window !== 'undefined' ? window.location.href : '', title: post.title, description: post.excerpt, position: "bottom", className: "mb-8" })), post.authorName && (jsxRuntime.jsx("div", { className: "bg-gray-50 rounded-lg p-6 mb-8", children: jsxRuntime.jsxs("div", { className: "flex items-center", children: [jsxRuntime.jsx("div", { className: "w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4", children: jsxRuntime.jsx("span", { className: "text-gray-600 text-xl font-semibold", children: post.authorName.charAt(0).toUpperCase() }) }), jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("h3", { className: "text-lg font-semibold text-gray-800", children: post.authorName }), jsxRuntime.jsx("p", { className: "text-gray-600", children: "Author" })] })] }) })), showConclusionFAQ && (conclusion || faqItems.length > 0) && (jsxRuntime.jsx(BlogConclusionFAQ, { conclusion: conclusion, faqItems: faqItems })), showRelatedPosts && componentSettings.showRelatedPosts && (jsxRuntime.jsx("div", { className: "border-t border-gray-200 pt-8 mb-8", children: jsxRuntime.jsx(BlogRelatedPosts, { postId: post.id, config: config, limit: 3 }) })), enableComments && (jsxRuntime.jsxs("div", { className: "border-t border-gray-200 pt-8 mb-8", children: [jsxRuntime.jsx("h3", { className: "text-2xl font-semibold mb-4", children: "Comments" }), jsxRuntime.jsxs("div", { className: "bg-gray-50 rounded-lg p-6 text-center text-gray-600", children: [jsxRuntime.jsx("p", { children: "Comments feature would be integrated here with your preferred commenting system." }), jsxRuntime.jsx("p", { className: "text-sm mt-2", children: "Supports Disqus, Utterances, or custom implementations." })] })] })), showCTAFooter && (jsxRuntime.jsx(BlogCTAFooter, { ctaButtons: finalCTAButtons, footerText: footerText }))] })] }) })] }), ((_p = config.seo) === null || _p === void 0 ? void 0 : _p.enableStructuredData) && (jsxRuntime.jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": post.seoDescription || post.excerpt,
                        "image": post.featuredImage,
                        "author": {
                            "@type": "Person",
                            "name": post.authorName
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": websiteName
                        },
                        "datePublished": post.publishedAt,
                        "dateModified": post.publishedAt,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": typeof window !== 'undefined' ? window.location.href : ''
                        },
                        "keywords": (_q = post.seoKeywords) === null || _q === void 0 ? void 0 : _q.join(', '),
                        "articleSection": (_r = post.categories) === null || _r === void 0 ? void 0 : _r.join(', '),
                        "wordCount": post.wordCount,
                        "timeRequired": post.readingTime ? `PT${post.readingTime}M` : undefined
                    })
                } }))] }));
}

const BlogHeader = React.memo(function BlogHeader({ config, design, metadata }) {
    var _a, _b, _c;
    // Try to get project name from multiple sources
    const projectName = (metadata === null || metadata === void 0 ? void 0 : metadata.projectName) || (config === null || config === void 0 ? void 0 : config.projectName) || (config === null || config === void 0 ? void 0 : config.title) || 'Blog';
    return (jsxRuntime.jsx("header", { className: "bg-white shadow-sm border-b", children: jsxRuntime.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: jsxRuntime.jsxs("div", { className: "text-center", children: [jsxRuntime.jsx("h1", { className: "text-3xl md:text-4xl font-bold mb-2", style: {
                            ...applyHeadingFontStyles(design),
                            color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) ||
                                ((_c = config.theme) === null || _c === void 0 ? void 0 : _c.primaryColor) ||
                                '#333'
                        }, children: projectName }), (metadata === null || metadata === void 0 ? void 0 : metadata.description) && (jsxRuntime.jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", style: applyBodyFontStyles(design), children: metadata.description }))] }) }) }));
});

function BlogSearch({ config, onSearch, placeholder = 'Search blog posts...', showAdvancedFilters = false, className = '' }) {
    const [query, setQuery] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query.trim());
        }
    };
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };
    return (jsxRuntime.jsxs("div", { className: `auto-blogify-blog-search ${className}`, children: [jsxRuntime.jsxs("form", { onSubmit: handleSubmit, className: "relative", children: [jsxRuntime.jsxs("div", { className: "relative", children: [jsxRuntime.jsx("input", { type: "text", value: query, onChange: handleInputChange, placeholder: placeholder, className: "w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), jsxRuntime.jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: jsxRuntime.jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z", clipRule: "evenodd" }) }) }), query && (jsxRuntime.jsx("button", { type: "button", onClick: () => setQuery(''), className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: jsxRuntime.jsx("svg", { className: "h-5 w-5 text-gray-400 hover:text-gray-600", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) }) }))] }), showAdvancedFilters && (jsxRuntime.jsxs("button", { type: "button", onClick: () => setShowFilters(!showFilters), className: "mt-2 text-sm text-gray-600 hover:text-gray-800", children: ["Advanced Filters ", showFilters ? '▲' : '▼'] }))] }), showAdvancedFilters && showFilters && (jsxRuntime.jsx("div", { className: "mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50", children: jsxRuntime.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Category" }), jsxRuntime.jsx("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: jsxRuntime.jsx("option", { value: "", children: "All Categories" }) })] }), jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Date Range" }), jsxRuntime.jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [jsxRuntime.jsx("option", { value: "", children: "All Time" }), jsxRuntime.jsx("option", { value: "last-week", children: "Last Week" }), jsxRuntime.jsx("option", { value: "last-month", children: "Last Month" }), jsxRuntime.jsx("option", { value: "last-year", children: "Last Year" })] })] }), jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Sort By" }), jsxRuntime.jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [jsxRuntime.jsx("option", { value: "publishedAt", children: "Date Published" }), jsxRuntime.jsx("option", { value: "title", children: "Title" }), jsxRuntime.jsx("option", { value: "readingTime", children: "Reading Time" })] })] })] }) }))] }));
}

const BlogSearchSection = React.memo(function BlogSearchSection({ config, blogState, showSearch, showFilters }) {
    if (!showSearch) {
        return null;
    }
    return (jsxRuntime.jsx("div", { className: "mb-8", children: showSearch && (jsxRuntime.jsx(BlogSearch, { config: config, onSearch: blogState.handleSearch, placeholder: "Search blog posts...", showAdvancedFilters: false })) }));
});

function BlogCard({ post, config, onClick, showAuthor = true, showDate = true, showReadingTime = true, showCategories = true, showTags = false, showExcerpt = true, showFeaturedImage = true, showContentFreshness = false, className = '', style }) {
    var _a, _b, _c, _d, _e, _f;
    const { design } = useGEOPilot();
    // Get component settings from design configuration
    const componentSettings = getComponentSettings(design, 'blogCard');
    const cardClasses = React.useMemo(() => {
        return `
      auto-blogify-blog-card
      bg-white
      rounded-lg
      shadow-md
      overflow-hidden
      transition-all
      duration-300
      hover:shadow-lg
      hover:transform
      hover:-translate-y-1
      cursor-pointer
      ${className}
    `.trim().replace(/\s+/g, ' ');
    }, [className]);
    const cardStyles = React.useMemo(() => {
        return applyDesignStyles(design, style);
    }, [design, style]);
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };
    const excerpt = React.useMemo(() => {
        if (!showExcerpt)
            return '';
        if (post.excerpt) {
            return post.excerpt;
        }
        // Generate excerpt from content
        const strippedContent = post.content.replace(/<[^>]*>/g, '');
        return strippedContent.length > 150
            ? strippedContent.substring(0, 150) + '...'
            : strippedContent;
    }, [post.excerpt, post.content, showExcerpt]);
    return (jsxRuntime.jsxs("article", { className: cardClasses, onClick: handleClick, style: cardStyles, children: [showFeaturedImage && componentSettings.showFeaturedImage && post.featuredImage && (jsxRuntime.jsx("div", { className: "auto-blogify-featured-image-container", children: jsxRuntime.jsx(OptimizedImage, { src: post.featuredImage, alt: post.title, width: 400, height: 300, aspectRatio: 4 / 3, loading: "lazy", className: "w-full h-48 object-cover", enableResponsive: true, sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" }) })), jsxRuntime.jsxs("div", { className: "p-6", children: [showCategories && componentSettings.showCategories && post.categories && post.categories.length > 0 && (jsxRuntime.jsx("div", { className: "auto-blogify-categories mb-3", children: post.categories.slice(0, 2).map((category) => {
                            var _a, _b, _c, _d;
                            return (jsxRuntime.jsx("span", { className: "inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mr-2 mb-1", style: {
                                    backgroundColor: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) ? `${design.theme.customColors.primary}20` : '#f3f4f6',
                                    color: ((_d = (_c = design === null || design === void 0 ? void 0 : design.theme) === null || _c === void 0 ? void 0 : _c.customColors) === null || _d === void 0 ? void 0 : _d.primary) || '#6b7280'
                                }, children: category }, category));
                        }) })), jsxRuntime.jsx("h2", { className: "auto-blogify-title text-xl font-bold mb-3 line-clamp-2", style: { color: ((_b = (_a = design === null || design === void 0 ? void 0 : design.theme) === null || _a === void 0 ? void 0 : _a.customColors) === null || _b === void 0 ? void 0 : _b.primary) || ((_c = config.theme) === null || _c === void 0 ? void 0 : _c.primaryColor) || '#333' }, children: post.title }), excerpt && showExcerpt && componentSettings.showExcerpt && (jsxRuntime.jsx("p", { className: "auto-blogify-excerpt text-gray-600 mb-4 line-clamp-3", children: excerpt })), jsxRuntime.jsxs("div", { className: "auto-blogify-meta flex flex-wrap items-center text-sm text-gray-500 gap-4", children: [showAuthor && componentSettings.showAuthor && post.authorName && (jsxRuntime.jsxs("div", { className: "auto-blogify-author flex items-center", children: [jsxRuntime.jsx("svg", { className: "w-4 h-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z", clipRule: "evenodd" }) }), jsxRuntime.jsx("span", { children: post.authorName })] })), showDate && componentSettings.showDate && post.publishedAt && (jsxRuntime.jsxs("div", { className: "auto-blogify-date flex items-center", children: [jsxRuntime.jsx("svg", { className: "w-4 h-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z", clipRule: "evenodd" }) }), jsxRuntime.jsx("span", { children: formatDate(post.publishedAt, config.language) })] })), showReadingTime && componentSettings.showReadingTime && post.readingTime && (jsxRuntime.jsxs("div", { className: "auto-blogify-reading-time flex items-center", children: [jsxRuntime.jsx("svg", { className: "w-4 h-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) }), jsxRuntime.jsx("span", { children: formatReadingTime(post.readingTime, config.language) })] }))] }), showContentFreshness && post.publishedAt && (jsxRuntime.jsx("div", { className: "mt-3", children: jsxRuntime.jsx(ContentFreshness, { publishedAt: post.publishedAt, updatedAt: post.updatedAt, showIndicator: true, showLastUpdated: true, freshnessThreshold: 30 }) })), showTags && componentSettings.showTags && post.tags && post.tags.length > 0 && (jsxRuntime.jsx("div", { className: "auto-blogify-tags mt-4 pt-4 border-t border-gray-100", children: post.tags.slice(0, 3).map((tag) => (jsxRuntime.jsxs("span", { className: "inline-block text-xs text-gray-500 mr-2 mb-1", children: ["#", tag] }, tag))) }))] }), ((_d = config.seo) === null || _d === void 0 ? void 0 : _d.enableStructuredData) && (jsxRuntime.jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": post.seoDescription || excerpt,
                        "image": post.featuredImage,
                        "author": {
                            "@type": "Person",
                            "name": post.authorName
                        },
                        "datePublished": post.publishedAt,
                        "dateModified": post.publishedAt,
                        "keywords": (_e = post.seoKeywords) === null || _e === void 0 ? void 0 : _e.join(', '),
                        "articleSection": (_f = post.categories) === null || _f === void 0 ? void 0 : _f.join(', '),
                        "wordCount": post.wordCount,
                        "timeRequired": post.readingTime ? `PT${post.readingTime}M` : undefined
                    })
                } }))] }));
}

const getLayoutClasses = (layout) => {
    const { type, columns } = layout;
    const baseClasses = 'grid gap-6';
    switch (type) {
        case 'grid':
            return `${baseClasses} grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;
        case 'list':
            return `${baseClasses} grid-cols-1`;
        case 'masonry':
            return `${baseClasses} grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;
        default:
            return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
    }
};
const createDefaultLayout = (type = 'grid') => ({
    type,
    columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3
    }
});
const getEmptyStateMessage = (hasSearch, hasCategory, hasTag) => {
    if (hasSearch || hasCategory || hasTag) {
        return 'Try adjusting your search or filters';
    }
    return 'No blog posts have been published yet';
};

const BlogPostsGrid = React.memo(function BlogPostsGrid({ posts, loading, layout, config, componentSettings, blogState, onPostClick }) {
    if (loading) {
        return (jsxRuntime.jsx("div", { className: "flex justify-center items-center py-12", children: jsxRuntime.jsx(LoadingSpinner, {}) }));
    }
    if (posts.length === 0) {
        const message = getEmptyStateMessage(!!blogState.currentSearch, !!blogState.currentCategory, !!blogState.currentTag);
        return (jsxRuntime.jsxs("div", { className: "text-center py-12", children: [jsxRuntime.jsx("div", { className: "text-gray-500 text-lg mb-4", children: "No posts found" }), jsxRuntime.jsx("p", { className: "text-gray-400", children: message })] }));
    }
    const gridClasses = getLayoutClasses(layout);
    return (jsxRuntime.jsx("div", { className: gridClasses, children: posts.map((post) => (jsxRuntime.jsx(BlogCard, { post: post, config: config, onClick: () => onPostClick(post), showAuthor: componentSettings.showAuthor, showDate: componentSettings.showDate, showReadingTime: componentSettings.showReadingTime, showCategories: componentSettings.showCategories, showTags: componentSettings.showTags, showExcerpt: componentSettings.showExcerpt, showFeaturedImage: componentSettings.showFeaturedImage }, post.id))) }));
});

function BlogPagination({ pagination, config, onPageChange, showFirstLast = true, showPrevNext = true, maxPages = 7, className = '' }) {
    const { page: currentPage, pages: totalPages } = pagination;
    if (totalPages <= 1) {
        return null;
    }
    const getPageNumbers = () => {
        const pageNumbers = [];
        const halfMaxPages = Math.floor(maxPages / 2);
        let startPage = Math.max(1, currentPage - halfMaxPages);
        let endPage = Math.min(totalPages, currentPage + halfMaxPages);
        // Adjust if we're near the beginning or end
        if (endPage - startPage + 1 < maxPages) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPages - 1);
            }
            else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxPages + 1);
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };
    const pageNumbers = getPageNumbers();
    const theme = config.theme || {};
    const buttonBaseClasses = "px-3 py-2 text-sm font-medium border transition-colors";
    const activeClasses = "bg-blue-500 text-white border-blue-500";
    const inactiveClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
    const disabledClasses = "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed";
    return (jsxRuntime.jsxs("nav", { className: `auto-blogify-blog-pagination flex justify-center ${className}`, "aria-label": "Blog pagination", children: [jsxRuntime.jsxs("div", { className: "flex items-center space-x-1", children: [showFirstLast && currentPage > 1 && pageNumbers[0] > 1 && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("button", { onClick: () => onPageChange(1), className: `${buttonBaseClasses} ${inactiveClasses} rounded-l-md`, "aria-label": "Go to first page", children: "1" }), pageNumbers[0] > 2 && (jsxRuntime.jsx("span", { className: "px-2 py-2 text-gray-500", children: "..." }))] })), showPrevNext && (jsxRuntime.jsx("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: `${buttonBaseClasses} ${currentPage === 1 ? disabledClasses : inactiveClasses} ${!showFirstLast || pageNumbers[0] === 1 ? 'rounded-l-md' : ''}`, "aria-label": "Go to previous page", children: jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) }) })), pageNumbers.map((pageNum) => (jsxRuntime.jsx("button", { onClick: () => onPageChange(pageNum), className: `${buttonBaseClasses} ${pageNum === currentPage ? activeClasses : inactiveClasses}`, style: pageNum === currentPage ? {
                            backgroundColor: theme.primaryColor || '#3B82F6',
                            borderColor: theme.primaryColor || '#3B82F6'
                        } : undefined, "aria-label": `Go to page ${pageNum}`, "aria-current": pageNum === currentPage ? 'page' : undefined, children: pageNum }, pageNum))), showPrevNext && (jsxRuntime.jsx("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: `${buttonBaseClasses} ${currentPage === totalPages ? disabledClasses : inactiveClasses} ${!showFirstLast || pageNumbers[pageNumbers.length - 1] === totalPages ? 'rounded-r-md' : ''}`, "aria-label": "Go to next page", children: jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }) })), showFirstLast && currentPage < totalPages && pageNumbers[pageNumbers.length - 1] < totalPages && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (jsxRuntime.jsx("span", { className: "px-2 py-2 text-gray-500", children: "..." })), jsxRuntime.jsx("button", { onClick: () => onPageChange(totalPages), className: `${buttonBaseClasses} ${inactiveClasses} rounded-r-md`, "aria-label": "Go to last page", children: totalPages })] }))] }), jsxRuntime.jsx("div", { className: "ml-4 flex items-center text-sm text-gray-700", children: jsxRuntime.jsxs("span", { children: ["Page ", currentPage, " of ", totalPages] }) })] }));
}

const BlogPaginationSection = React.memo(function BlogPaginationSection({ pagination, config, blogState, showPagination }) {
    if (!showPagination || pagination.pages <= 1) {
        return null;
    }
    return (jsxRuntime.jsx("div", { className: "mt-12", children: jsxRuntime.jsx(BlogPagination, { config: config, pagination: pagination, onPageChange: blogState.handlePageChange }) }));
});

const BlogMainContent = React.memo(function BlogMainContent({ config, design, posts, loading, pagination, layout, showSearch, showFilters, showPagination, componentSettings, blogState, onPostClick }) {
    // Convert string layout to BlogLayout object if needed
    const blogLayout = React.useMemo(() => {
        if (typeof layout === 'string') {
            return createDefaultLayout(layout);
        }
        return layout;
    }, [layout]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(BlogSearchSection, { config: config, blogState: blogState, showSearch: showSearch, showFilters: showFilters }), jsxRuntime.jsx(BlogPostsGrid, { posts: posts, loading: loading, layout: blogLayout, config: config, componentSettings: componentSettings, blogState: blogState, onPostClick: onPostClick }), jsxRuntime.jsx(BlogPaginationSection, { pagination: pagination, config: config, blogState: blogState, showPagination: showPagination })] }));
});

function BlogTags({ config, onTagClick, showPostCount = false, maxTags = 20, style = 'pills', className = '' }) {
    const { api, apiReady } = useGEOPilot();
    const [tags, setTags] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        const fetchTags = async () => {
            if (!api || !apiReady) {
                return; // Wait for API to be initialized
            }
            try {
                setLoading(true);
                setError(null);
                const response = await api.getBlogTags();
                setTags(response.tags.slice(0, maxTags));
            }
            catch (err) {
                setError('Failed to fetch tags');
                console.error('Error fetching tags:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchTags();
    }, [api, apiReady, maxTags]);
    if (loading) {
        return (jsxRuntime.jsxs("div", { className: `blog-tags loading ${className}`, children: [jsxRuntime.jsx("div", { className: "loading-spinner" }), jsxRuntime.jsx("span", { children: "Loading tags..." })] }));
    }
    if (error) {
        return (jsxRuntime.jsx("div", { className: `blog-tags error ${className}`, children: jsxRuntime.jsx("p", { className: "error-message", children: error }) }));
    }
    if (tags.length === 0) {
        return (jsxRuntime.jsx("div", { className: `blog-tags empty ${className}`, children: jsxRuntime.jsx("p", { children: "No tags found." }) }));
    }
    const getTagStyle = (tag, index) => {
        if (style === 'cloud') {
            const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg'];
            return sizes[index % sizes.length];
        }
        return '';
    };
    return (jsxRuntime.jsx("div", { className: `blog-tags ${style} ${className}`, children: style === 'list' ? (jsxRuntime.jsx("ul", { className: "tags-list space-y-2", children: tags.map((tag) => (jsxRuntime.jsx("li", { className: "tag-item", children: jsxRuntime.jsxs("button", { onClick: () => onTagClick === null || onTagClick === void 0 ? void 0 : onTagClick(tag), className: "tag-link w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex justify-between items-center", children: [jsxRuntime.jsxs("span", { className: "font-medium text-gray-700", children: ["#", tag] }), showPostCount && (jsxRuntime.jsx("span", { className: "post-count text-sm text-gray-500", children: "(0)" }))] }) }, tag))) })) : (jsxRuntime.jsx("div", { className: "tags-container flex flex-wrap gap-2", children: tags.map((tag, index) => (jsxRuntime.jsxs("button", { onClick: () => onTagClick === null || onTagClick === void 0 ? void 0 : onTagClick(tag), className: `tag-pill px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full transition-colors ${getTagStyle(tag, index)}`, children: ["#", tag, showPostCount && (jsxRuntime.jsx("span", { className: "post-count ml-1 text-xs", children: "(0)" }))] }, tag))) })) }));
}

const BlogSidebar = React.memo(function BlogSidebar({ config, metadata, posts, showCategories, showTags, blogState, onPostClick }) {
    const handleTagClick = (tag) => {
        var _a;
        // Filter posts by tag when a tag is clicked
        (_a = blogState.setCurrentSearch) === null || _a === void 0 ? void 0 : _a.call(blogState, tag);
    };
    return (jsxRuntime.jsx("div", { className: "space-y-6", children: showTags && (jsxRuntime.jsxs("div", { className: "blog-sidebar-section", children: [jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", children: "Tags" }), jsxRuntime.jsx(BlogTags, { config: config, onTagClick: handleTagClick, showPostCount: true, maxTags: 15, style: "pills", className: "blog-sidebar-tags" })] })) }));
});

const BlogFooter = React.memo(function BlogFooter({ metadata, showPoweredBy = true }) {
    return (jsxRuntime.jsx("footer", { className: "bg-gray-50 border-t w-full mt-auto", children: jsxRuntime.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: jsxRuntime.jsxs("div", { className: "text-center text-gray-600", children: [showPoweredBy && jsxRuntime.jsx("p", { children: "Powered by GEO Pilot" }), metadata && (jsxRuntime.jsxs("p", { className: "text-sm mt-2", children: ["Last updated ", new Date().toLocaleDateString()] }))] }) }) }));
});

// Custom Hooks
function useBlogState(initialProps) {
    const [selectedPost, setSelectedPost] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(initialProps.page);
    const [currentSearch, setCurrentSearch] = React.useState(initialProps.searchQuery || '');
    const [currentCategory, setCurrentCategory] = React.useState(undefined);
    const [currentTag, setCurrentTag] = React.useState(undefined);
    const [currentFilters, setCurrentFilters] = React.useState({
        search: initialProps.searchQuery || ''
    });
    const handleSearch = React.useCallback((query) => {
        setCurrentSearch(query);
        setCurrentPage(1);
    }, []);
    const handlePageChange = React.useCallback((newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    const handlePostClick = React.useCallback((post) => {
        setSelectedPost(post);
    }, []);
    const handleBackToList = React.useCallback(() => {
        setSelectedPost(null);
    }, []);
    const handleFilterChange = React.useCallback((filters) => {
        setCurrentFilters(filters);
        if (filters.search !== undefined) {
            setCurrentSearch(filters.search);
        }
        if (filters.category !== undefined) {
            setCurrentCategory(filters.category);
        }
        if (filters.tag !== undefined) {
            setCurrentTag(filters.tag);
        }
        setCurrentPage(1);
    }, []);
    return {
        selectedPost,
        currentPage,
        currentSearch,
        currentCategory,
        currentTag,
        currentFilters,
        handleSearch,
        handlePageChange,
        handlePostClick,
        handleBackToList,
        setCurrentSearch,
        handleFilterChange,
        setCurrentCategory,
        setCurrentTag
    };
}
// Helper functions
function createContainerClasses(design, className) {
    // Top-level container should not use grid; it should be a centered flex column
    // to avoid unintended left shifts when layout classes are applied to inner grids.
    const baseClasses = 'auto-blogify-blog-full-screen min-h-screen flex flex-col';
    return `${baseClasses} ${className}`.trim();
}
function createContainerStyles(design, style) {
    return applyDesignStyles(design, style);
}
// Main Component
function BlogFullScreen(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const { config, page = 1, limit = 12, searchQuery = '', onPostClick, className = '', style } = props;
    const [isClient, setIsClient] = React.useState(false);
    // SSR safety check
    React.useEffect(() => {
        setIsClient(true);
    }, []);
    // Hooks
    const { design, designError, apiReady } = useGEOPilot();
    const blogState = useBlogState({ page, searchQuery });
    const finalLimit = limit;
    const { posts, pagination, loading, error, refetch } = useBlogPosts({
        page: blogState.currentPage,
        limit: finalLimit,
        search: blogState.currentSearch,
        autoFetch: true
    });
    const { metadata, loading: metadataLoading, error: metadataError } = useBlogMetadata();
    const { metaTags, structuredData } = useSEO(config, undefined, 'blog');
    // All configuration comes from backend design - with safe fallbacks
    const componentSettings = React.useMemo(() => {
        if (!design)
            return getComponentSettings(null, 'blogCard');
        return getComponentSettings(design, 'blogCard');
    }, [design]);
    const containerClasses = React.useMemo(() => {
        if (!design)
            return createContainerClasses(null, className);
        return createContainerClasses(design, className);
    }, [design, className]);
    const containerStyles = React.useMemo(() => {
        if (!design)
            return createContainerStyles(null, style);
        return createContainerStyles(design, style);
    }, [design, style]);
    // Get all settings from backend design configuration - with safe fallbacks
    const finalShowPagination = (_c = (_b = (_a = design === null || design === void 0 ? void 0 : design.blogSettings) === null || _a === void 0 ? void 0 : _a.readingExperience) === null || _b === void 0 ? void 0 : _b.showProgressBar) !== null && _c !== void 0 ? _c : true;
    const finalShowSearch = true; // Always show search by default
    const finalShowFilters = false; // Filters disabled by default
    const finalShowCategories = (_f = (_e = (_d = design === null || design === void 0 ? void 0 : design.components) === null || _d === void 0 ? void 0 : _d.blogCard) === null || _e === void 0 ? void 0 : _e.showCategories) !== null && _f !== void 0 ? _f : false;
    const finalShowTags = (_j = (_h = (_g = design === null || design === void 0 ? void 0 : design.components) === null || _g === void 0 ? void 0 : _g.blogCard) === null || _h === void 0 ? void 0 : _h.showTags) !== null && _j !== void 0 ? _j : true;
    const finalShowSidebar = (_l = (_k = design === null || design === void 0 ? void 0 : design.layout) === null || _k === void 0 ? void 0 : _k.showSidebar) !== null && _l !== void 0 ? _l : true;
    const finalShowHeader = true; // Always show header
    const finalShowFooter = true; // Always show footer
    const finalLayout = (_o = (_m = design === null || design === void 0 ? void 0 : design.layout) === null || _m === void 0 ? void 0 : _m.type) !== null && _o !== void 0 ? _o : 'grid';
    // Blog post configuration from backend design
    const finalWebsiteName = ((_q = (_p = design === null || design === void 0 ? void 0 : design.blogSettings) === null || _p === void 0 ? void 0 : _p.branding) === null || _q === void 0 ? void 0 : _q.showPoweredBy) ? "Website's Blog" : undefined;
    const finalBlogHomeUrl = "/";
    const finalMainWebsiteUrl = "/";
    const finalNavigationItems = [];
    const finalShowSiteHeader = true;
    const finalShowTOC = (_t = (_s = (_r = design === null || design === void 0 ? void 0 : design.blogSettings) === null || _r === void 0 ? void 0 : _r.sideSection) === null || _s === void 0 ? void 0 : _s.showTableOfContents) !== null && _t !== void 0 ? _t : true;
    const finalShowSocialShare = (_w = (_v = (_u = design === null || design === void 0 ? void 0 : design.blogSettings) === null || _u === void 0 ? void 0 : _u.sideSection) === null || _v === void 0 ? void 0 : _v.showSocialShare) !== null && _w !== void 0 ? _w : true;
    const finalShowConclusionFAQ = true;
    const finalShowCTAFooter = true;
    const finalConclusion = undefined;
    const finalFaqItems = [];
    const finalFooterText = undefined;
    // Get CTA buttons from backend design configuration only
    const finalCTAButtons = React.useMemo(() => { var _a; return ((_a = design === null || design === void 0 ? void 0 : design.ctaButtons) === null || _a === void 0 ? void 0 : _a.filter((btn) => btn.enabled)) || []; }, [design]);
    // Event handlers
    const handlePostClick = React.useCallback((post) => {
        if (onPostClick) {
            onPostClick(post);
        }
        else {
            blogState.handlePostClick(post);
        }
    }, [onPostClick, blogState]);
    // Return loading state during SSR
    if (!isClient) {
        return jsxRuntime.jsx(LoadingState, {});
    }
    // Early returns for loading and error states
    if (loading && !posts.length) {
        return jsxRuntime.jsx(LoadingState, {});
    }
    // Show error state if we have any error and no posts
    if (error && !posts.length) {
        console.log('BlogFullScreen: Showing error state for posts error:', error);
        return jsxRuntime.jsx(ErrorState, { error: error, onRetry: refetch, className: className, style: style });
    }
    // Show error state if metadata loading failed
    if (metadataError && !posts.length) {
        console.log('BlogFullScreen: Showing error state for metadata error:', metadataError);
        return jsxRuntime.jsx(ErrorState, { error: `Metadata Error: ${metadataError}`, onRetry: refetch, className: className, style: style });
    }
    // Show error state if design loading failed completely and we have no posts
    if (designError && !posts.length && !loading) {
        console.log('BlogFullScreen: Showing error state for design error:', designError);
        return jsxRuntime.jsx(ErrorState, { error: `Design Error: ${designError}`, onRetry: () => window.location.reload(), className: className, style: style });
    }
    // Show error state if API is ready but we have no posts and no errors (shouldn't happen with real API)
    if (apiReady && !posts.length && !loading && !error && !metadataError && !designError) {
        console.log('BlogFullScreen: No posts found, showing empty state');
        return jsxRuntime.jsx(ErrorState, { error: "No blog posts found. Please check your API configuration.", onRetry: refetch, className: className, style: style });
    }
    // If we have posts but no design, still try to show the blog with defaults
    if (posts.length && !design && !loading) ;
    // Single post view
    if (blogState.selectedPost) {
        return (jsxRuntime.jsx(SinglePostView, { config: config, post: blogState.selectedPost, onBack: blogState.handleBackToList, blogProps: {
                websiteName: finalWebsiteName,
                blogHomeUrl: finalBlogHomeUrl,
                mainWebsiteUrl: finalMainWebsiteUrl,
                logoUrl: undefined,
                navigationItems: finalNavigationItems,
                showSiteHeader: finalShowSiteHeader,
                showTOC: finalShowTOC,
                showSocialShare: finalShowSocialShare,
                showConclusionFAQ: finalShowConclusionFAQ,
                showCTAFooter: finalShowCTAFooter,
                conclusion: finalConclusion,
                faqItems: finalFaqItems,
                ctaButtons: finalCTAButtons,
                footerText: finalFooterText
            }, className: className, style: style }));
    }
    // Main blog list view
    return (jsxRuntime.jsx(BlogListView, { config: config, design: design, metadata: metadata, posts: posts, loading: loading, pagination: pagination, blogState: blogState, showProps: {
            showHeader: finalShowHeader,
            showFooter: finalShowFooter,
            showSidebar: finalShowSidebar,
            showSearch: finalShowSearch,
            showFilters: finalShowFilters,
            showPagination: finalShowPagination,
            showCategories: finalShowCategories,
            showTags: finalShowTags
        }, layoutProps: {
            layout: finalLayout,
            containerClasses,
            containerStyles,
            componentSettings
        }, onPostClick: handlePostClick }));
}
// Sub-components
function LoadingState() {
    return (jsxRuntime.jsx("div", { className: "auto-blogify-blog-full-screen-loading flex justify-center items-center min-h-screen", children: jsxRuntime.jsxs("div", { className: "text-center", children: [jsxRuntime.jsx(LoadingSpinner, {}), jsxRuntime.jsx("p", { className: "mt-4 text-gray-600", children: "Loading blog posts..." })] }) }));
}
function ErrorState({ error, onRetry, className, style }) {
    return (jsxRuntime.jsx("div", { className: `auto-blogify-blog-error ${className}`, style: style, children: jsxRuntime.jsx(ErrorMessage, { message: error, onRetry: onRetry }) }));
}
function SinglePostView({ config, post, onBack, blogProps, className, style }) {
    return (jsxRuntime.jsx(BlogPost, { config: config, postId: post.id, slug: post.slug, onBack: onBack, showRelatedPosts: true, enableComments: false, enableSharing: blogProps.showSocialShare, ...blogProps, className: className, style: style }));
}
function BlogListView({ config, design, metadata, posts, loading, pagination, blogState, showProps, layoutProps, onPostClick }) {
    var _a, _b, _c;
    const { showHeader, showFooter, showSidebar, showSearch, showFilters, showPagination, showCategories, showTags } = showProps;
    const { layout, containerClasses, containerStyles, componentSettings } = layoutProps;
    return (jsxRuntime.jsxs("div", { className: containerClasses, style: containerStyles, role: "main", "aria-label": "Blog content", children: [jsxRuntime.jsx(SEOHead, { config: config, title: (metadata === null || metadata === void 0 ? void 0 : metadata.seoTitle) || (metadata === null || metadata === void 0 ? void 0 : metadata.projectName) || 'Blog', description: (metadata === null || metadata === void 0 ? void 0 : metadata.seoDescription) || (metadata === null || metadata === void 0 ? void 0 : metadata.description) }), showHeader && (jsxRuntime.jsx(BlogHeader, { config: config, design: design, metadata: metadata })), jsxRuntime.jsx("main", { className: "flex-1 w-full", role: "main", "aria-label": "Blog posts", children: jsxRuntime.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full", children: jsxRuntime.jsxs("div", { className: `flex gap-8 ${showSidebar ? 'lg:flex-row flex-col' : 'flex-col justify-center'}`, children: [jsxRuntime.jsx(MainContentSection, { config: config, design: design, posts: posts, loading: loading, pagination: pagination, layout: layout, showSearch: showSearch, showFilters: showFilters, showPagination: showPagination, showSidebar: showSidebar, componentSettings: componentSettings, blogState: blogState, onPostClick: onPostClick }), showSidebar && (jsxRuntime.jsx(SidebarSection, { config: config, metadata: metadata, posts: posts, showCategories: showCategories, showTags: showTags, blogState: blogState, onPostClick: onPostClick }))] }) }) }), showFooter && jsxRuntime.jsx(BlogFooter, { metadata: metadata, showPoweredBy: (_c = (_b = (_a = design === null || design === void 0 ? void 0 : design.blogSettings) === null || _a === void 0 ? void 0 : _a.branding) === null || _b === void 0 ? void 0 : _b.showPoweredBy) !== null && _c !== void 0 ? _c : true })] }));
}
function MainContentSection({ config, design, posts, loading, pagination, layout, showSearch, showFilters, showPagination, showSidebar, componentSettings, blogState, onPostClick }) {
    return (jsxRuntime.jsx("div", { className: `${showSidebar ? 'lg:w-2/3 w-full' : 'w-full max-w-5xl mx-auto'}`, role: "region", "aria-label": "Blog posts and filters", children: jsxRuntime.jsx(BlogMainContent, { config: config, design: design, posts: posts, loading: loading, pagination: pagination, layout: layout, showSearch: showSearch, showFilters: showFilters, showPagination: showPagination, componentSettings: componentSettings, blogState: blogState, onPostClick: onPostClick }) }));
}
function SidebarSection({ config, metadata, posts, showCategories, showTags, blogState, onPostClick }) {
    return (jsxRuntime.jsx("aside", { className: "lg:w-1/3", role: "complementary", "aria-label": "Blog sidebar", children: jsxRuntime.jsx(BlogSidebar, { config: config, metadata: metadata, posts: posts, showCategories: showCategories, showTags: showTags, blogState: blogState, onPostClick: onPostClick }) }));
}

// Main SDK exports - Simplified to focus on BlogFullScreen component
// Default configuration
const defaultConfig = {
    enableSEO: true,
    enableGEO: true,
    enableAnalytics: true,
    theme: {
        layout: 'grid',
        showAuthor: true,
        showDate: true,
        showReadingTime: true,
        showCategories: true,
        showTags: false,
        showExcerpt: true,
        showFeaturedImage: true,
    },
    seo: {
        enableStructuredData: true,
        enableOpenGraph: true,
        enableTwitterCards: true,
        enableBreadcrumbs: true,
        enableContentFreshness: true,
        enablePerformanceOptimizations: true,
    },
    geo: {
        enableGeoTargeting: false,
        defaultLanguage: 'en',
        enableAutoTranslation: false,
    },
    performance: {
        enableLazyLoading: true,
        enableImageOptimization: true,
        enableContentPreloading: true,
        enableCoreWebVitals: true,
        cache: {
            enabled: true,
            ttl: 300000, // 5 minutes
            maxSize: 100
        }
    }
};
// Version
const SDK_VERSION = '2.2.4';

exports.BlogFullScreen = BlogFullScreen;
exports.BlogTags = BlogTags;
exports.GEOPilotAPI = GEOPilotAPI;
exports.GEOPilotProvider = GEOPilotProvider;
exports.SDK_VERSION = SDK_VERSION;
exports.addIdsToHeadings = addIdsToHeadings;
exports.applyBodyFontStyles = applyBodyFontStyles;
exports.applyDesignStyles = applyDesignStyles;
exports.applyHeadingFontStyles = applyHeadingFontStyles;
exports.calculateReadingTime = calculateReadingTime;
exports.defaultConfig = defaultConfig;
exports.extractDomain = extractDomain;
exports.extractHeadingsFromContent = extractHeadingsFromContent;
exports.formatCategories = formatCategories;
exports.formatDate = formatDate;
exports.formatFileSize = formatFileSize;
exports.formatNumber = formatNumber;
exports.formatReadingTime = formatReadingTime;
exports.formatRelativeDate = formatRelativeDate;
exports.formatTags = formatTags;
exports.formatUrl = formatUrl;
exports.formatWordCount = formatWordCount;
exports.generateExcerpt = generateExcerpt;
exports.generateStructuredContent = generateStructuredContent;
exports.getBodyFontFamilyCSS = getBodyFontFamilyCSS;
exports.getCSSVariables = getCSSVariables;
exports.getComponentSettings = getComponentSettings;
exports.getFirstParagraph = getFirstParagraph;
exports.getFontFamilyCSS = getFontFamilyCSS;
exports.getHeadingFontFamilyCSS = getHeadingFontFamilyCSS;
exports.getLayoutClasses = getLayoutClasses$1;
exports.getWordCount = getWordCount;
exports.isValidUrl = isValidUrl;
exports.mergeThemeConfig = mergeThemeConfig;
exports.parseContentIntoSections = parseContentIntoSections;
exports.slugify = slugify;
exports.stringToColor = stringToColor;
exports.stripHtml = stripHtml;
exports.titleCase = titleCase;
exports.truncateText = truncateText;
exports.useBlogMetadata = useBlogMetadata;
exports.useBlogPosts = useBlogPosts;
exports.useGEOPilot = useGEOPilot;
exports.useSEO = useSEO;
//# sourceMappingURL=index.js.map
