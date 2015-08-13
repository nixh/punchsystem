function DynaList(el, opts) {

    var self = this;

    self.el = el;
    el.data('dynalist', self);

    var dataAttr = ['width', 'height'];
    var dataOpts = {};
    $.each(dataAttr, function(i, att){
        var opt = el.data(att);
        if(opt !== undefined) dataOpts[att] = opt;
    });

    opts = self.opts = $.extend({}, opts || {}, dataOpts);

    self.constructDynalist();
    self.bindEvents();
}

DynaList.prototype.constructDynalist = function() {
    var self = this;
    var height = self.el.height();
    var width = self.el.width();
    if(!height) self.el.height(height = self.opts['height']);
    if(!width) self.el.width(width = self.opts['width']);

    var div = function(name) {
        return $('<div class="dynalist-'+name+'">');
    }


}

(function($){
    $.fn.dynalist = function(opts) {
        this.each(function(){
            new DynaList($(this), opts);
        });
    };
})(jQuery);
