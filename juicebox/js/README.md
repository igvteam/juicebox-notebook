To update juicebox,

(1) download juicebox.min.js

(2) 

replace (at the beginning of the file)
 
    !function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).juicebox=e()}
    
with

    (function (global, factory) {window.juicebox = factory()})    
       
    