exports.addHelpers = function(dust) {
    var InitWidgetsTag = require('raptor/templating/taglibs/widgets/InitWidgetsTag');

    dust.helpers.initWidgets = function(chunk, context, bodies, params) {
        return dust.invokeRenderer(InitWidgetsTag, chunk, context, bodies, params);
    };
};