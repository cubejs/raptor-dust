exports.addHelpers = function(dust) {
    var PageTag = require('raptor/templating/taglibs/optimizer/PageTag');
    var SlotTag = require('raptor/templating/taglibs/optimizer/SlotTag');

    dust.helpers.optimizerPage = function(chunk, context, bodies, params) {
        return dust.invokeRenderer(PageTag, chunk, context, bodies, params);
    };

    dust.helpers.optimizerSlot = function(chunk, context, bodies, params) {
        return dust.invokeRenderer(SlotTag, chunk, context, bodies, params);
    };
};