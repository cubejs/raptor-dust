exports.addHelpers = function(dust) {    
    var AsyncFragmentTag = require('raptor/templating/taglibs/async/AsyncFragmentTag');

    dust.helpers.asyncFragment = function(chunk, context, bodies, params) {
        
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