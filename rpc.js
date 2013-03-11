// example request: [{func : "add", arg : [1, 2]}, {func : "sub", arg : [2, 1]}]

module.exports = function (funcs) {
    return function (req, res) {
        _u.run(function () {
            console.log(req.body)
            var input = _u.unJson(req.method.match(/post/i) ? req.body 
                : _u.unescapeUrl(req.url.match(/\?(.*)/)[1]))
            if (input instanceof Array) {
                var output = _u.map(input, function (input) {
                    return funcs[input.func](input.arg, req, res)
                })
            } else {
                var output = funcs[input.func](input.arg, req, res)
            }
            var body = _u.json(output) || "null"
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            })
            res.end(body)
        })
    }
}