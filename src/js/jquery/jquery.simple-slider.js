// ****************************************************************************
// ****************************************************************************




// ****************************************************************************
// ****************************************************************************



/*global window, document, setTimeout, clearTimeout, navigator, jQuery */

;(function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "simple_slider",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function () {

            this.dragElement = $(this.element).find(".slider-button");

            this.dragArea = $(this.element).find(".drag-area");

            this.SliderBar = $(this.element).find(".slider-bar");

            this.slider = {

                w: $(this.element).width(),

                x: this.findOffsetX(this.element),

                btn: {
                    w: $(this.element).find(".slider-button").width(),

                    x: 50
                },

                clientX: 0,

                clentY: 0,

                breakpoint: {
                    start: 0,
                    end: 0
                }
            };

            this.startPoint = 0;

            this.endPoint = 0;

            this.element.style.height = this.dragElement.height() + "px";

            this.dragArea[0].style.height = this.dragElement.height() + "px";

            this.setupEvents();

            this.alignSliderBtn();
        },

        alignSliderBtn: function () {

            var width = this.dragElement.width(),
                height = this.dragElement.height();

            this.dragElement[0].style.margin = 0 + "px 0 0 " + -(width / 2) + "px";

        },

        /**
         * Event mouse down || touch start
         *
         * 
         */
        eventStart: function (e) {

            clearTimeout(this.animationTimer);

            switch (e.target.getAttribute("class")) {

            case "slider-button":
                /* MOBILE FIX
                 *
                 * prevent browser from scrolling up or down when 
                 * user is dragging left to right.
                 */
                e.preventDefault();

                this.sliderBtnSelected = true;
                break;

            case "drag-area":

                /* 
                 * DESKTOP - e.clientX
                 *
                 * MOBILE - e.originalEvent.touches[0].clientX
                 *
                 * get x or y coordinates when user interacts with interface
                 */
                this.slider.clientX = e.clientX || e.originalEvent.touches[0].clientX;
                this.slider.clientY = e.clientY || e.originalEvent.touches[0].clientY;


                /* MOBILE FIX
                 * user tap interaction 
                 */
                this.userTap = true;
                break;
            }
        },

        /**
         * Event mouse move || touch move
         *
         * 
         */
        eventMove: function (e) {

            if (this.sliderBtnSelected) {


                /* MOBILE FIX
                 *
                 * prevent browser from scrolling up or down when 
                 * user is dragging left to right.
                 */
                e.preventDefault();


                /* 
                 * DESKTOP - e.clientX
                 *
                 * MOBILE - e.originalEvent.touches[0].clientX
                 *
                 * get x or y coordinates when user interacts with interface
                 */
                var x = e.clientX || e.originalEvent.touches[0].clientX,

                    y = e.clientY || e.originalEvent.touches[0].clientY,

                    w = this.slider.w,

                    o = this.slider.x;

                    
                this.findPercentage(x, o, w, this.slider.btn.w);

                this.outputPercentage(x, o, w, this.slider.btn.w)

            }

            /* MOBILE FIX
             * user tap interaction
             * if a user drags finger then it is not a tap
             */
            if ((this.slider.clientY - 20) < y || (this.slider.clientY + 20) > y) {
                this.userTap = false;
            }

        },

        /**
         * Event mouse up || touch end
         *
         * 
         */
        eventEnd: function () {

            this.sliderBtnSelected = false;

            if (this.userTap) {

                var posX = (this.slider.clientX - this.slider.x) / this.slider.w;

                posX = posX * 100;

                this.startPoint = ((this.slider.btn.w / 2) / this.slider.w) * 100;

                this.endPoint = 100 - this.startPoint;

                this.increment = Math.abs(posX - this.slider.btn.x) / 10;

                this.direction = this.findDirection(posX)

                

                

                if (posX < this.startPoint) {

                    posX = this.startPoint;

                } else if (posX > this.endPoint) {

                    posX = this.endPoint;

                }

                this.newPosition = posX;

                this.animate();

                this.outputPercentage(this.slider.clientX, this.slider.x, this.slider.w, this.slider.btn.w)


            }
        },


        findPercentage: function (clientX, offset, sliderWidth, btnWidth) {

            var posX = (clientX - offset) / sliderWidth;

            posX = posX * 100;

            this.startPoint = ((btnWidth / 2) / sliderWidth) * 100;

            this.endPoint = 100 - this.startPoint;


            // collision detection for slider button 
            if (posX < this.startPoint) {

                posX = this.startPoint;

            } else if (posX > this.endPoint) {

                posX = this.endPoint;

            }

            this.updateElements(posX);

            // keep track of button position
            this.slider.btn.x = posX;
        },

        outputPercentage: function (clientX, offset, sliderWidth, btnWidth) {

            var positionX = clientX - offset;

            // get percentage from inner element 
            var num = ((positionX - btnWidth / 2) / sliderWidth) * (sliderWidth / (sliderWidth-btnWidth)) * 100;

            if (num < 0) {

                num = 0;

            } else if (num > 100) {

                num = 100;
            }

            this.settings.slide(num)
        },


        /*
         * Find which direction to animate slider
         */
        findDirection: function (posX) {
            var d = "";
            if (posX > this.slider.btn.x) {
                d = "right";
            } else {
                d = "left";
            }
            return d;
        },

        /*
         * animate slider
         * 
         * loop until slider reaches new percentage value
         */
        animate: function () {
            clearTimeout(this.animationTimer);
            var me = this;


            if (this.isAnimationCompleted()) {

                this.animationTimer = setTimeout(function () {
                    me.slider.btn.x = me.calPosition(me.slider.btn.x);
                    me.updateElements(me.slider.btn.x);
                    me.animate();
                }, 30);

            } else {
                this.slider.btn.x = this.newPosition;
            }
        },

        /*
         * If slider position is equal to new value then animation is 
         * completed
         *
         * return -  true or false
         */
        isAnimationCompleted: function () {

            var b = false

            if (this.direction === "right") {

                if (this.slider.btn.x <= this.newPosition) {
                    b = true;
                }

            } else { // left

                
                if (this.slider.btn.x >= this.newPosition) {
                    b = true;
                }
            }

            return b;
        },

        /*
         * Calculate slider position 
         */
        calPosition: function (x) {
            var v;
            if (this.direction === "right") {

                v = this.newPosition >= (x + this.increment) ? (x + this.increment) : this.newPosition;

            } else { // left
                
                v = this.newPosition <= (x - this.increment) ? (x - this.increment) : this.newPosition;
            }

            return v
        },

        /*
         * Update elements position 
         */
        updateElements: function (num) {
            this.dragElement[0].style.left = num + "%";
        },

        /*
         * Set-up events on first load 
         */
        setupEvents: function () {
            var me = this,
                isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
                start = isMobile ? "touchstart" : "mousedown",
                move = isMobile ? "touchmove" : "mousemove",
                end = isMobile ? "touchend" : "mouseup";

            /**
             * Event mouse down || touch start
             *
             */
            $(this.element).bind(start, function (e) {
                me.eventStart(e);
            });

            /**
             * Event mouse move || touch move
             *
             */
            $(this.element).bind(move, function (e) {
                me.eventMove(e);
            });

            /**
             * Event mouse up || touch end
             *
             */
            $(this.element).bind(end, function (e) {
                me.eventEnd(e);
            });



            /**
             * Event resize
             *
             */
            $(window).resize(function() {
                me.slider.w = $(me.element).width();
                me.slider.x = me.findOffsetX(me.element);
            });
        },

        findOffsetX: function (ele) {

            // offsetX is not available on android devices , firefox and IE

            // loop through all parent elements and find the total offset left...

            var b = true,
                width = 0;

            while (b) {

                width += ele.offsetLeft;

                if (ele.parentElement) {
                    ele = ele.parentElement;
                } else {
                    b = false;
                }
            }

            return width;
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });

        // chain jQuery functions
        return this;
    };

})(jQuery, window, document);