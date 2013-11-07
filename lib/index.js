var path = require('path');
var fs = require('fs');

function write(str) {
    this._dustChunk.write(str);
    return this;
}

var chunkToRenderContext;

function beginAsyncFragment(callback, timeout) {
    var raptorContext = this._raptorContext;
    this._dustChunk = this._dustChunk.map(function(asyncChunk) {
        var newChunkContext = chunkToRenderContext(asyncChunk, raptorContext);

        callback(newChunkContext, {
            end: function() {
                newChunkContext._dustChunk.end();
            }
        });
    });
}

function renderDustBody(body, context) {
    var newChunk = this._dustChunk.render(body, context);
    this._dustChunk = newChunk;
}

chunkToRenderContext = function(chunk, raptorContext) {
    var newContext = Object.create(raptorContext);
    newContext._raptorContext = raptorContext;
    newContext._dustChunk = chunk;
    newContext.write = write;
    newContext.w = write;
    newContext.beginAsyncFragment = beginAsyncFragment;
    newContext.renderDustBody = renderDustBody;
    return newContext;
};

function invokeRenderer(tag, chunk, context, bodies, params) {
    var request = context.get('request');
    var raptorContext = request.raptorContext;
    var renderContext = chunkToRenderContext(chunk, raptorContext);
    var render = tag.render || tag.process;
    render.call(tag, params, renderContext);
    return renderContext._dustChunk;
}

function configureDust(dust, srcDir) {
    dust.onLoad = function(path, callback){
        if (!path.endsWith('.dust')) {
            path += '.dust';
        }
        
        if (!path.startsWith('/')) {
            path = srcDir + '/' + path;
        }
        else {
            path = srcDir + path;
        }

        fs.readFile(path, 'UTF-8', callback);
    };

    dust.invokeRenderer = invokeRenderer;

    dust.helpers.component = function(chunk, context, bodies, params) {
        var renderer = params.renderer;
        for (var k in params) {
            if (params.hasOwnProperty(k)) {
                if (k === 'true') {
                    params[k] = true;
                }
                else if (k === 'false') {
                    params[k] = false;
                }
            }
        }
        return invokeRenderer(require(renderer), chunk, context, bodies, params);
    };

    require('./optimizer-helpers').addHelpers(dust);
    require('./async-helpers').addHelpers(dust);
}

exports.configureDust = configureDust;