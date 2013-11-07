exports.addHelpers = function(dust) {    
    var AsyncFragmentTag = require('raptor/templating/taglibs/async/AsyncFragmentTag');

    dust.helpers.asyncFragment = function(chunk, context, bodies, params) {
        var arg = params.arg = {};

        for (var k in params) {
            if (params.hasOwnProperty(k)) {
                if (k.startsWith('arg-')) {
                    arg[k.substring(4)] = params[k];
                    delete params[k];
                }
            }
        }

        params.invokeBody = function(asyncContext, data) {
            var varName = params['var'];
            var newContextObj = {};
            newContextObj[varName] = data;
            var newContext = context.push(newContextObj);
            asyncContext.renderDustBody(bodies.block, newContext);
        };

        return dust.invokeRenderer(AsyncFragmentTag, chunk, context, bodies, params);
    };
};