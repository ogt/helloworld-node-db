
var Fiber = require('fibers')

_u.slurp = function (f) {
    return '' + require('fs').readFileSync(f)
}

_u.save = function (f, s) {
    require('fs').writeFileSync(f, s)
}

_u.print = function (o) {
    if (typeof(o) == 'object') {
        console.log(_u.json(o, true))
    } else {
        console.log(o)
    }
}

_u.exit = function () {
    process.exit(1)
}

_u.md5 = function (s) {
    return require('crypto').createHash('md5').update(s).digest("hex")    
}

_u.run = function (f) {
    var c = Fiber.current
    if (c) c.yielding = true
    if (typeof(f) == 'function')
        var ret = Fiber(f).run()
    else
        if (f != c && f.started && !f.yielding)
            var ret = f.run()
    if (c) c.yielding = false
    return ret
}

_u.yield = function () {
    return Fiber.yield()
}

_u.promise = function () {
    var f = Fiber.current
    var done = false
    var val = null
    return {
        set : function (v) {
            done = true
            val = v
            _u.run(f)
        },
        get : function () {
            while (!done) _u.yield()
            done = false
            return val
        }
    }
}

_u.promiseErr = function () {
    var p = _u.promise()
    return {
        set : function (err, data) {
            p.set([err, data])
        },
        get : function () {
            var x = p.get()
            if (x[0]) throw x[0]
            return x[1]
        }
    }
}

_u.consume = function (input, encoding) {
    if (encoding == 'buffer') {
        var buffer = new Buffer(1 * input.headers['content-length'])
        var cursor = 0
    } else {
        var chunks = []
        input.setEncoding(encoding || 'utf8')
    }
    
    var p = _u.promise()
    input.on('data', function (chunk) {
        if (encoding == 'buffer') {
            chunk.copy(buffer, cursor)
            cursor += chunk.length
        } else {
            chunks.push(chunk)
        }
    })
    input.on('end', function () {
        if (encoding == 'buffer') {
            p.set(buffer)
        } else {
            p.set(chunks.join(''))
        }
    })
    return p.get()
}

_u.wget = function (url, params, encoding) {
    url = require('url').parse(url)
    
    var o = {
        method : params ? 'POST' : 'GET',
        hostname : url.hostname,
        path : url.path
    }
    if (url.port)
        o.port = url.port
    
    var data = ""
    var dataEnc = null
    if (params && params.length != null) {
        data = params
        o.headers = {
            "Content-Length" : data.length
        }
    } else {
        data = _u.values(_u.map(params, function (v, k) { return k + "=" + encodeURIComponent(v) })).join('&')
        
        o.headers = {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Content-Length" : Buffer.byteLength(data, 'utf8')
        }
        
        dataEnc = "utf8"
    }
    
    var p = _u.promise()
    var req = require(url.protocol.replace(/:/, '')).request(o, function (res) {
        _u.run(function () {
            p.set(_u.consume(res, encoding))
        })
    })
    req.end(data, dataEnc)
    return p.get()
}