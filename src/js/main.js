
/*global window, require */

require.config({

    enforceDefine : false,

    baseUrl: 'js/',

    paths: {

        jquery: 'vendor/jquery-1.11.0.min',
        ui: '//code.jquery.com/ui/1.11.2/jquery-ui.min',

        slick: 'jquery/slick.min',
        simple_slider: 'jquery/jquery.simple-slider',
        placeholder: 'jquery/jquery.placeholder',
    },
    
    
    //Remember: only use shim config for non-AMD scripts,
    //scripts that do not already call define(). The shim
    //config will not work correctly if used on AMD scripts,
    //in particular, the exports and init config will not
    //be triggered, and the deps config will be confusing
    //for those cases.
    shim: {

        slick: {
            deps: ['jquery'],
            exports: 'slick' 
        }
    }
});


// // Start the main app logic.
require([], function () {
        'use strict';

});
