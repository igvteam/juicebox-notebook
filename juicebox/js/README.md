To update juicebox,

(1) download juicebox.js

(2) 

replace (at the beginning of the file)
 ```javascript

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.juicebox = factory());
})    
```

with

```javascript

(function (global, factory) {window.juicebox = factory()})  
```  
       
    