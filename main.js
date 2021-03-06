const _ = {};

// Helpers
const { shuffler, returnObjectValues } = require('./helpers');

// Functions
_.identity = args => args;

_.first = (collection, n = null) =>
  n === null ? collection[0] : collection.slice(0, n);

_.last = (collection, n = null) => {
  if (collection instanceof Object && !Array.isArray(collection))
    return undefined;
  return n === null ? collection[collection.length - 1] : collection.slice(-n);
};
_.each = (list, iteratee, context = this) => {
  if (Array.isArray(list) || typeof list === 'string') {
    for (let i = 0; i < list.length; i++) {
      iteratee.call(context, list[i], i, list);
    }
  } else if (typeof list === 'object') {
    for (let key in list) {
      iteratee.call(context, list[key], key, list);
    }
  }
  return list;
};

_.indexOf = (collection, target, isSorted = null) => {
  if (isSorted === null) {
    let result = -1;
    let found = false;
    _.each(collection, (item, index) => {
      if (found === false) {
        item === target ? ((result = index), (found = true)) : result;
      }
    });
    return result;
  } else {
    return binaryIndexOf(collection, target);
  }

  function binaryIndexOf(array, searchElement) {
    let start = 0;
    let stop = array.length - 1;
    let guess;

    while (start <= stop) {
      guess = Math.floor((start + stop) / 2, 10);
      if (array[guess] === searchElement) {
        return guess;
      } else {
        if (array[guess] < searchElement) {
          start = guess + 1;
        } else {
          stop = guess - 1;
        }
      }
    }
    return -1;
  }
};

_.filter = (list, predicate, context = this) => {
  let result = [];
  const iteratee = function(elem, i, list) {
    if (predicate.call(context, elem, i, list)) {
      result.push(elem);
    }
  };
  _.each(list, iteratee);
  return result;
};

_.reject = (list, predicate, context = this) =>
  _.filter(list, item => {
    return !predicate.call(context, item);
  });

_.uniq = (array, isSorted, iteratee = null) => {
  const result = [];
  if (iteratee === null) {
    _.each(array, item => {
      if (result.indexOf(item) === -1) {
        result.push(item);
      }
    });
  } else {
    _.each(array, (item, i, list) => {
      if (iteratee(item)) {
        if (result.indexOf(iteratee(item, i, list)) === -1) {
          result.push(iteratee(item, i, list));
        }
      }
    });
  }

  return result;
};

_.map = (list, iteratee, context = this) => {
  const result = [];
  _.each(list, (value, index) =>
    result.push(iteratee.call(context, value, index, list))
  );
  return result;
};

_.contains = (list, value, fromIndex = null) =>
  _.reduce(
    list,
    (acc, element, index) => {
      if (fromIndex === null) {
        if (element === value) acc = true;
      }
      if (index >= fromIndex) {
        if (element === value) acc = true;
      }
      return acc;
    },
    false
  );

_.pluck = (collection, key) =>
  _.map(collection, element => {
    if (element.hasOwnProperty(key) === true) return element[key];
  });

_.every = (
  collection,
  predicate = elem => {
    if (elem) return true;
    else return false;
  },
  context = this
) =>
  _.reduce(
    collection,
    (acc, elem, i, list) =>
      predicate.call(context, elem, i, list) === false ? false : acc,
    true
  );

_.some = (
  collection,
  predicate = elem => {
    if (elem) return true;
    else return false;
  },
  context = this
) =>
  _.reduce(
    collection,
    (acc, elem) => {
      if (predicate.call(context, elem) === true) acc = true;
      return acc;
    },
    false
  );

_.extend = (destination, ...sources) => {
  _.each(sources, function(source) {
    _.each(source, function(value, key) {
      destination[key] = value;
    });
  });
  return destination;
};

_.defaults = (object, ...defaults) => {
  _.each(defaults, function(defaultObj) {
    _.each(defaultObj, function(value, key) {
      if (object[key] === undefined) {
        object[key] = value;
      }
    });
  });
  return object;
};

_.reduce = (list, iteratee, memo) => {
  let noMemo = memo === undefined;
  _.each(
    list,
    (item, i, list) =>
      noMemo === true
        ? ((memo = item), (noMemo = false))
        : (memo = iteratee(memo, item, i, list))
  );
  return memo;
};

_.once = func => {
  let invoked = false;
  let result;

  const innerFunc = () => {
    if (invoked === false) {
      result = func();
      invoked = true;
    }
    return result;
  };

  return innerFunc;
};

_.shuffle = list => {
  if (list instanceof Array) {
    return shuffler(list);
  } else if (list instanceof Object) {
    return shuffler(returnObjectValues(list));
  }
};

_.invoke = (list, method, ...args) => {
  return _.map(list, function(elem) {
    if (elem[method]) {
      elem[method].apply(elem, args);
      return elem;
    } else {
      return elem[method];
    }
  });
};

_.delay = (func, wait, ...args) => {
  setTimeout(function() {
    func.apply(this, args);
  }, wait);
};

_.intersection = (...args) =>
  _.reduce(args, (acc, array) => _.filter(acc, elem => array.includes(elem)));

_.difference = (...args) =>
  _.reduce(args, (acc, array) =>
    _.filter(acc, elem => {
      if (array.includes(elem) === false) return elem;
    })
  );

_.flatten = (arr, shallow = false) => {
  return shallow === false ? deepFlatten(arr) : shallowFlatten(arr);
  function deepFlatten(array) {
    return _.reduce(
      array,
      (acc, element) =>
        acc.concat(Array.isArray(element) ? deepFlatten(element) : element),
      []
    );
  }

  function shallowFlatten(array) {
    return array.reduce(function(acc, element) {
      if (Array.isArray(element) === true) {
        return acc.concat(element);
      } else {
        acc.push(element);
      }
      return acc;
    }, []);
  }
};

_.sortedIndex = (list, value) => {
  let startIndex = 0;
  let stopIndex = list.length - 1;
  let index = startIndex + stopIndex - 1;

  while (list[index] != value && startIndex < stopIndex) {
    if (value < list[index]) {
      stopIndex = index - 1;
    } else if (value > list[index]) {
      startIndex = index + 1;
    }

    return (index = startIndex + stopIndex + 1);
  }
};

_.zip = (...args) => args[0].map((key, i) => args.map(array => array[i]));

_.sortBy = (list, iteratee) => {
  if (typeof iteratee === 'function') {
    return list.sort(function(a, b) {
      return iteratee(a) - iteratee(b);
    });
  } else {
    return list.sort(function(a, b) {
      return a[iteratee] - b[iteratee];
    });
  }
};

_.memoize = func => {
  const storage = {};
  return function() {
    const args = JSON.stringify(arguments);
    if (!storage[args]) storage[args] = func.apply(this, arguments);
    return storage[args];
  };
};

_.throttle = (func, wait) => {
  const storage = {};
  let canCall = true;
  return (...args) => {
    if (canCall === true) {
      storage.lastResult = func.apply(null, args);
      canCall = false;
      setTimeout(() => {
        canCall = true;
      }, wait);
      return storage.lastResult;
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = _;
}
