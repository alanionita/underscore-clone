const _ = {};
// Tasks
// 11. indexOf (again, this time with a binary search)
// 1. once
// 3. shuffle
// 4. invoke
// 13. delay
// 9. intersection
// 10. difference
// 8. flatten
// 7. sortedIndex
// 6. zip
// 5. sortBy (NB the Underscore library uses the native JavaScript sort but feel free to use your sort algorithm!)
// 2. memoize
// 12. throttle

_.identity = function (args) {
    return args;
};

_.first = function (array, n) {
    if (n) {
        if (Array.isArray(array)) {
            return array.slice(0, n);
        }
    } else {
        if (Array.isArray(array)) {
            return array[0];
        }
    }
};

_.last = function (array, n) {
    if (n) {
        if (Array.isArray(array)) {
            return array.slice(-n);
        }
    } else {
        if (Array.isArray(array)) {
            return array.pop();
        }
    }
};

_.each = function (list, iteratee, context) {
    let thisParam = list;
    if (context) { thisParam = context; }
    if (Array.isArray(list)) {
        for (let i = 0; i < list.length; i++) {
            iteratee.call(thisParam, list[i], i, list);
        }
    } else if (typeof list === 'object') {
        for (let key in list) {
            iteratee.call(thisParam, list[key], key, list);
        }
    }
    return list;
};

_.indexOf = function (array, target, isSorted) {
    if (!isSorted) {
        if (Array.isArray(array) && (target)) {
            let index;
            for (let i = 0; i < array.length; i++) {
                if (array[i] === target) {
                    index = i;
                } else {
                    index = -1;
                }
            }
            return index;
        }
    } else {
        return binaryIndexOf(array, target);
    }

    function binaryIndexOf(array, searchElement) {
        let start = 0;
        let stop = array.length - 1;
        let mid;
        let element;

        while (start <= stop) {
            mid = Math.floor((start + stop) / 2, 10);
            element = array[mid];
            if (element < searchElement) {
                start = mid + 1;
            } else if (element > searchElement) {
                stop = mid - 1;
            } else {
                return mid;
            }
        }
        return -1;
    }
};


_.filter = function (list, predicate, context = null) {
    if (Array.isArray(list) || typeof list === 'object') {
        let result = [];
        const iteratee = function (elem) {
            if (predicate.call(context, elem)) {
                result.push(elem);
            }
        };
        _.each(list, iteratee);
        return result;
    }
};

_.reject = function (list, predicate, context = null) {
    if (Array.isArray(list)) {
        _.each(list, (elem, i) => {
            if (predicate.call(context, elem)) {
                list.splice(i, 1); // dont' mutate
            }
        });
        return list;
    } else if (typeof list === 'object') {
        _.each(list, (elem) => {
            if (predicate.call(context, elem)) {
                delete list[elem];
            }
        });
        return list;
    }
};

_.uniq = function (array, isSorted, iteratee) {
    if (isSorted) {
        if (Array.isArray(array)) {
            let result = [];
            for (let i = 0; i < array.length; i++) {
                if (array[i] !== result[result.length - 1]) {
                    result.push(array[i]);
                }
            }
            return result;
        }
    } else if (iteratee) {
        if (Array.isArray(array)) {
            let iterateeRes = _.filter(array, iteratee);
            let result = [];
            for (let i = 0; i < iterateeRes.length; i++) {
                if (iterateeRes[i] !== result[result.length - 1]) {
                    result.push(iterateeRes[i]);
                }
            }
            return result;
        }
    } else {
        if (Array.isArray(array)) {
            let result = [];
            for (let i = 0; i < array.length; i++) {
                if (result.indexOf(array[i]) === -1) {
                    result.push(array[i]);
                }
            }
            return result;
        }
    }
};

_.map = function (list, iteratee, context) {
    let thisParam = list;
    if (context) { thisParam = context; }
    const result = [];
    for (let i = 0; i < list.length; i++) { // each
        result.push(iteratee.call(thisParam, list[i], list.indexOf(list[i]), list));
    }
    return result;
};

_.contains = function (list, value, fromIndex) {
    if (list instanceof Array) {
        if (fromIndex) {
            for (let i = fromIndex; i < list.length; i++) {
                if (list[i] === value) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            if (list.indexOf(value) > 0) {
                return true;
            } else {
                return false;
            }
        }
    } else if (list instanceof Object) {
        if (list[value] === undefined) {
            return false;
        } else {
            return true;
        }
    }
};

_.once = function (func) {
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

if (typeof module !== 'undefined') {
    module.exports = _;
}