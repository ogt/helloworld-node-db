
// dependencies: jQuery
// license : public domain

// note to self: new fancy native array methods:
// forEach
// map
// filter
// reduce
// every
// some

_u = (function () {
var _u = {}

_u.has = function (o, k) {
    return o.hasOwnProperty(k)
}

_u.identity = function (e) { return e }

_u.each = function (o, func) {
    if (!func) func = _u.identity
    if (o instanceof Array) {
        for (var i = 0; i < o.length; i++)
            if (func(o[i], i) == false)
                break
    } else {
        for (var k in o)
            if (o.hasOwnProperty(k))
                if (func(o[k], k) == false)
                    break
    }
}

_u.map = function (o, func) {
    if (!func) func = _u.identity
    if (o instanceof Array)
        return o.map(func)
    var accum = {}
    for (var k in o)
        if (o.hasOwnProperty(k))
            accum[k] = func(o[k], k)
    return accum
}

_u.filter = function (o, func) {
    if (!func) func = _u.identity
    if (o instanceof Array)
        return o.filter(func)
    var accum = {}
    for (var k in o)
        if (o.hasOwnProperty(k))
            if (func(o[k], k))
                accum[k] = o[k]
    return accum
}

_u.reduce = _u.fold = function (o, func, init) {
    if (!func) func = _u.identity
    if (o instanceof Array)
        return o.reduce(func, init)
    var accum = init
    for (var k in o)
        if (o.hasOwnProperty(k))
            accum = func(accum, o[k])
    return accum
}

_u.some = _u.any = function (o, func) {
    if (!func) func = _u.identity
    if (o instanceof Array)
        return o.some(func)
    for (var k in o)
        if (o.hasOwnProperty(k))
            if (func(o[k], k)) return true
    return false
}

_u.every = _u.all = function (o, func) {
    if (!func) func = _u.identity
    if (o instanceof Array)
        return o.every(func)
    for (var k in o)
        if (o.hasOwnProperty(k))
            if (!func(o[k], k)) return false
    return true
}

_u.min = function (o, func) {
    if (!func) func = _u.identity
    var bestScore = null
    var best = null
    _u.each(o, function (v, k) {
        var score = func(v, k)
        if (bestScore === null || score < bestScore) {
            bestScore = score
            best = v
        }
    })
    return best
}

_u.max = function (o, func) {
    if (!func) func = _u.identity
    var bestScore = null
    var best = null
    _u.each(o, function (v, k) {
        var score = func(v, k)
        if (bestScore === null || score > bestScore) {
            bestScore = score
            best = v
        }
    })
    return best
}

_u.find = function (o, func) {
    if (!func) func = _u.identity
    var found = null
    _u.each(o, function (v, k) {
        if (func(v, k)) {
            found = v
            return false
        }
    })
    return found
}

_u.size = function (o) {
    if (o instanceof Array)
        return o.length
    return _u.keys(o).length
}

_u.deepEquals = function (a, b) {
    if (typeof(a) != typeof(b)) return false
    if (typeof(a) == 'object') {
        return _u.size(a) == _u.size(b) && _u.all(a, function (v, k) {
            return _u.has(b, k) && _u.deepEquals(b[k], v)
        })
    } else {
        return a == b
    }
}

_u.keys = function (o) {
    return Object.keys(o)
}

_u.values = function (o) {
    var accum = []
    _u.each(o, function (e) {
        accum.push(e)
    })
    return accum
}

_u.extend = function (o, that) {
    _u.each(that, function (v, k) {
        o[k] = v
    })
    return o
}

_u.pairs = function (o) {
    var accum = []
    _u.each(o, function (v, k) {
        accum.push([k, v])
    })
    return accum
}

_u.object = _u.unPairs = function (a, b) {
    var accum = {}
    if (b) {
        _u.each(a, function (k, i) {
            accum[k] = b[i]
        })
    } else {
        _u.each(a, function (e) {
            accum[e[0]] = e[1]
        })
    }
    return accum
}

_u.pick = function (o) {
    var accum = {}
    for (var i = 1; i < arguments.length; i++) {
        var k = arguments[i]
        if (_u.has(o, k)) accum[k] = o[k]
    }
    return accum
}

_u.omit = function (o) {
    var omits = _u.makeSet(_u.toArray(arguments).slice(1))
    var accum = {}
    _u.each(o, function (v, k) {
        if (!_u.has(omits, k))
            accum[k] = v
    })
    return accum
}

_u.setAdd = function (s, key) {
    if (!_u.has(s, key) || !s[key])
        return s[key] = true
    return false
}

_u.makeSet = function (a) {
    var s = {}
    _u.each(a, function (e) {
        s[e] = true
    })
    return s
}

_u.inSet = function (s, x) {
    return _u.has(s, x) && s[x]
}

_u.setSub = function (a, b) {
    var c = {}
    _u.each(a, function (v, k) {
        if (!_u.inSet(b, k))
            c[k] = v
    })
    return c
}

_u.bagAdd = function (bag, key, amount) {
    if (amount == null) amount = 1
    if (!_u.has(bag, key))
        bag[key] = 0
    bag[key] += amount
    return bag[key]
}

_u.lerp = function (t0, v0, t1, v1, t) {
    return (t - t0) * (v1 - v0) / (t1 - t0) + v0
}

_u.time = function () {
    return new Date().getTime()
}

_u.trim = function (s) {
    return s.replace(/^\s+|\s+$/g,"")
}

_u.lines = function (s) {
    return s.split(/\r\n|\r|\n/)
}

_u.sum = function (a) {
    return _u.fold(a, function (a, b) { return a + b }, 0)
}

_u.sample = function (o) {
    if (o instanceof Array)
        return o[Math.floor(o.length * Math.random())]
    else
        return _u.sample(_u.values(o))
}

_u.shuffle = function (a) {
    for (var i = 0; i < a.length; i++) {
        var ri = Math.floor(a.length * Math.random())
        var temp = a[i]
        a[i] = a[ri]
        a[ri] = temp
    }
    return a
}

_u.toArray = function (a) {
    var accum = []
    for (var i = 0; i < a.length; i++)
        accum[i] = a[i]
    return accum
}

_u.ensure = function () {
    if (arguments.length <= 3) {
        if (!(arguments[1] in arguments[0])) {
            arguments[0][arguments[1]] = arguments[2]
        }
        return arguments[0][arguments[1]]
    }
    var args = _u.toArray(arguments)
    var prev = _u.ensure.apply(null, args.slice(0, 2).concat([typeof(args[2]) == "string" ? {} : []]))
    return _u.ensure.apply(null, [prev].concat(args.slice(2)))
}

_u.escapeUnicodeChar = function (c) {
    var code = c.charCodeAt(0)
    var hex = code.toString(16)
    if (code < 16) return '\\u000' + hex
    if (code < 256) return '\\u00' + hex
    if (code < 4096) return '\\u0' + hex
    return '\\u' + hex
}

_u.escapeString = function (s) {
    return s.
        replace(/\\/g, '\\\\').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\\"').
        replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, _u.escapeUnicodeChar)
}

_u.escapeRegExp = function (s) {
    return _u.escapeString(s).replace(/([\{\}\(\)\|\[\]\^\$\.\*\+\?])/g, "\\$1")
}

_u.escapeUrl = function (s) {
    return encodeURIComponent(s)
}

_u.unescapeUrl = function (s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}

_u.escapeXml = function (s) {
    s = s.replace(/&/g, "&amp;")
    s = s.replace(/</g, "&lt;").
        replace(/>/g, "&gt;").
        replace(/'/g, "&apos;").
        replace(/"/g, "&quot;").
//            replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, function (c) {
        replace(/[\u0080-\uFFFF]/g, function (c) {
            var code = c.charCodeAt(0)
            return '&#' + code + ';'
            // if we want hex:
            var hex = code.toString(16)
            return '&#x' + hex + ';'
        })
    return s;
}

_u.unescapeXml = function (s) {
    return s.replace(/&[^;]+;/g, function (s) {
        switch(s.substring(1, s.length - 1)) {
            case "amp":  return "&";
            case "lt":   return "<";
            case "gt":   return ">";
            case "apos": return "'";
            case "quot": return '"';
            default:
                if (s.charAt(1) == "#") {
                    if (s.charAt(2) == "x") {
                        return String.fromCharCode(parseInt(s.substring(3, s.length - 1), 16));
                    } else {
                        return String.fromCharCode(parseInt(s.substring(2, s.length - 1)));
                    }
                } else {
                    throw "unknown XML escape sequence: " + s
                }
        }
    })
}

function splitSizeHelper(prefix, size) {
    if (size == null) return ""
    if (size <= 1) return prefix + '="' + Math.round(100 * size) + '%"'
    return prefix + '="' + size + 'px"'
}

_u.splitHorz = function (aSize, bSize, a, b, fill) {
    if (fill === undefined) fill = true
    if (arguments.length == 3) {
        // backwards compatibility
        b = a
        a = bSize
        aSize = aSize / 100
        bSize = null
    }
    aSize = splitSizeHelper('width', aSize)
    bSize = splitSizeHelper('width', bSize)
    var t = $('<table ' + (fill ? 'style="width:100%;height:100%"' : '') + '><tr valign="top"><td class="a" ' + aSize + '></td><td class="b" ' + bSize + '></td></tr></table>')
    // don't do this:
    // t.find('.a').append(a)
    // t.find('.b').append(b)
    var _a = t.find('.a')
    var _b = t.find('.b')
    _a.append(a)
    _b.append(b)
    return t
}

_u.splitVert = function (aSize, bSize, a, b, fill) {
    if (fill === undefined) fill = true
    if (arguments.length == 3) {
        // backwards compatibility
        b = a
        a = bSize
        aSize = aSize / 100
        bSize = null
    }
    aSize = splitSizeHelper('height', aSize)
    bSize = splitSizeHelper('height', bSize)
    var t = $('<table ' + (fill ? 'style="width:100%;height:100%"' : '') + '><tr valign="top"><td class="a" ' + aSize + '></td></tr><tr valign="top"><td class="b" ' + bSize + '></td></tr></table>')
    // don't do this:
    // t.find('.a').append(a)
    // t.find('.b').append(b)
    var _a = t.find('.a')
    var _b = t.find('.b')
    _a.append(a)
    _b.append(b)
    return t
}

_u.dialog = function (content) {
    var win = $(window)
    var w = win.width()
    var h = win.height()
    
    var b
    $('body').append(b = $('<div style="position:fixed;left:0px;top:0px; z-index:10000;background:black;opacity:0.5"/>').width(w).height(h))
    
    var d = $('<div style="position:fixed;z-index:20000;background:white"/>').append(content)
    $('body').append(d)
    setTimeout(function () {
        var w = window.innerWidth
        var h = window.innerHeight
        d.css({
            left : Math.round(w / 2 - d.width() / 2) + "px",
            top : Math.round(h / 2 - d.height() / 2) + "px"
        })
    }, 0)
    
    _u.closeDialog = function () {
        b.remove()
        d.remove()
    }
}

_u.decycle = function(o) {
    var rootKey = "root_" + Math.round(Math.random() * 1000)
    var uniqueObj = {}
    while (true) {
        try {
            var objs = []
            function helper(o, path) {
                if (typeof(o) == "string" && o.slice(0, rootKey.length) == rootKey)
                    throw "bad root key"
                if (typeof(o) == "object" && o) {
                    if (typeof(o[rootKey]) == "object" && o[rootKey].uniqueObj == uniqueObj) {
                        return o[rootKey].path
                    } else {
                        if (rootKey in o)
                            throw "bad root key"
                        var oo = (o instanceof Array) ? [] : {}
                        o[rootKey] = {
                            uniqueObj : uniqueObj,
                            path : path,
                            newObj : oo
                        }
                        objs.push(o)
                        return oo
                    }
                }
                return o
            }
            function helper2(o) {
                var oo = o[rootKey].newObj
                var path = o[rootKey].path
                if (o instanceof Array) {
                    for (var i = 0; i < o.length; i++) {
                        oo[i] = helper(o[i], path + '[' + i + ']')
                    }
                } else {
                    for (k in o) {
                        if (k != rootKey) {
                            oo[k] = helper(o[k], path + '[' + JSON.stringify(k) + ']')
                        }
                    }
                }
            }
            function cleanup() {
                for (var i = 0; i < objs.length; i++) {
                    delete objs[i][rootKey]
                }
            }
            
            var ret = {}
            ret.cycle_root = rootKey
            ret[rootKey] = helper(o, rootKey)
            for (var i = 0; i < objs.length; i++) {
                helper2(objs[i])
            }
            cleanup()
            return ret
        } catch (e) {
            cleanup()
            if (e == "bad root key") {
                rootKey += Math.round(Math.random() * 1000)
            } else {
                throw e
            }
        }
    }
}

_u.recycle = function (obj) {
    // regex adapted from https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
    var r = /^root(?:_\d+)?(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/
    
    if (!obj.cycle_root || !(obj.cycle_root in obj))
        throw "doesn't look recycle-able"
    
    var rootKey = obj.cycle_root
    function helper(o) {
        if (typeof(o) == "string" && o.slice(0, rootKey.length) == rootKey) {
            if (!o.match(r)) throw "I'm afraid to eval: " + o
            with (obj) {
                return eval(o)
            }
        }
        if (typeof(o) == "object" && o) {
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++) {
                    o[i] = helper(o[i])
                }
            } else {
                for (var k in o) {
                    o[k] = helper(o[k])
                }
            }
        }
        return o
    }
    return helper(obj[rootKey])
}

_u.json = function (x, pretty) {
    try {
        return JSON.stringify(x, null, pretty === true ? "    " : pretty)
    } catch (e) {
        return _u.json(_u.decycle(x), pretty)
    }
}

_u.unJson = function (s) {
    var o = JSON.parse(s)
    try {
        return _u.recycle(o)
    } catch (e) {
        return o
    }
}

return _u
})();
