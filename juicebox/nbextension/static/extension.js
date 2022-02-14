define(function () {
    "use strict";

    const base_path = document.querySelector('body').getAttribute('data-base-url') +
        'nbextensions/juicebox/';

    function load_css(url) {
        const link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    // load_css(base_path + 'notebook.css');

    window['requirejs'].config({
        map: {
            '*': {
                '@igvteam/juicebox-jupyter': 'nbextensions/juicebox/index',
            },
        }
    });

    // Export the required load_ipython_extension function
    return {
        load_ipython_extension: function () {
            // Load igv-jupyter comm
            require(['@igvteam/juicebox-jupyter'], function(jb) {
                console.log('juicebox-jupyter nbextension loaded');
                jb.init_comm_nb();
            });
        }
    };
});
