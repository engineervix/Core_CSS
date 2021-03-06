$.widget( "corecss.tabs" , {

    version: "1.0.0",

    options: {
        target: 'self',
        tabsColor: 'bg-lightBlue',
        fontColor: 'fg-white',
        markerColor: 'bg-yellow',
        deep: 'normal',
        duration: CORE_ANIMATION_DURATION,
        onTab: $.noop()
    },


    _create: function () {
        var that = this, element = this.element, o = this.options;
        var tabs = element.find('li:not(.tab-marker)');
        var tab_active = $(element.find('li.active:not(.tab-marker)')[0]);
        var tab = tab_active.length > 0 ? tab_active : $(tabs[0]);

        //console.log(tab);

        this._setOptionsFromDOM();

        this._createTabs();
        this._createEvents();
        this._openTab(tab, null);

        element.data('tabs', this);
    },

    _createTabs: function(){
        var element = this.element, o = this.options;
        //var tabs = element.find('li:not(.tab-marker)');

        if (!element.hasClass('tabs')) {
            element.addClass('tabs');
        }

        if (o.deep !== 'normal') {
            element.addClass('deep');
        }

        if (Utils.isColor(o.tabsColor)) {
            element.css('background-color', o.tabsColor);
        } else {
            element.addClass(o.tabsColor);
        }

        if (Utils.isColor(o.fontColor)) {
            element.css('color', o.fontColor);
        } else {
            element.addClass(o.fontColor);
        }

        var tab_marker = element.find('li.tab-marker');

        if (tab_marker.length == 0) {
            tab_marker = $("<li>").addClass("tab-marker");
            tab_marker.appendTo(element);
        }

        if (Utils.isColor(o.markerColor)) {
            tab_marker.css('background', o.markerColor);
        } else {
            tab_marker.addClass(o.markerColor);
        }
    },

    _openTab: function(tab, direction){
        var element = this.element, o = this.options;
        var tabs = element.find('li:not(.tab-marker)');
        var frames = o.target === 'self' ? element.siblings('.tabs-content').children('div') : $(o.target).children('div');
        var frame = '#'+tab.data('target');
        var marker = element.find('li.tab-marker');
        var tab_width = tab.outerWidth();
        var tab_left = tab.position().left;
        var shift = tab.position().left + tab.outerWidth();
        var width = element.outerWidth();
        var scroll = element.scrollLeft();
        var magic = 32;

        var current_tab = $(element.find('li.active')[0]);

        if (current_tab != tab) {
            tabs.removeClass('active');
            frames.hide();

            tab.addClass('active');
            $(frame).show();
        }

        if (shift + magic > width) {
            element.animate({
                scrollLeft: scroll + (shift - width) + (tab_width / 2)
            }, o.duration);
        }

        if (tab_left - magic < 0) {
            element.animate({
                scrollLeft: tab_left + scroll - (tab_width / 2)
            }, o.duration);
        }

        this._setMarker();
    },

    _setMarker: function(){
        var that = this, element = this.element, o = this.options;
        var tab = element.find("li.active");
        var marker = element.find("li.tab-marker");
        var tab_width = tab.outerWidth();
        var tab_left = tab.position().left;
        var scroll = element.scrollLeft();

        marker.animate({
            width: tab_width,
            top: '100%',
            left: tab_left + scroll
        }, o.duration);
    },

    _createEvents: function(){
        var that = this, element = this.element, o = this.options;
        var tabs = element.find('li');

        element.on('click', 'li', function(e){

            if ($(this).hasClass('tab-marker')) return;
            if ($(this).hasClass('scroll-control-left')) return;
            if ($(this).hasClass('scroll-control-right')) return;

            var result;
            var tab = $(this), target = tab.data('target'), frame = $(target);
            var tab_active = element.find("li.active");
            var change_direction = tabs.index(tab) > tabs.index(tab_active) ? 'right' : 'left';

            //console.log(change_direction);

            if (tab.parent().hasClass('disabled')) {return false;}

            if (target !=undefined && Utils.isUrl(target)) {
                window.location.href = target;
                return true;
            }

            element.data('activeTab', target);

            that._openTab(tab, change_direction);

            Utils.callback(o.onTab, tab);

            e.preventDefault();
            //e.stopPropagation();
        });
    },

    reset: function(tab){
        this._openTab(tab)
    },

    _setOptionsFromDOM: function(){
        var that = this, element = this.element, o = this.options;

        $.each(element.data(), function(key, value){
            if (key in o) {
                try {
                    o[key] = $.parseJSON(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super('_setOption', key, value);
    }
});

$(window).on('resize', function(){
    var tabs = $('.tabs');
    $.each(tabs, function(){
        var el = $(this), _tabs = el.data("tabs"), tab = el.find("li.active");
        _tabs.reset(tab);
    });
});