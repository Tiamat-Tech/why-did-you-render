/* eslint-disable*/
var jsxDevRuntime = require('react/jsx-dev-runtime')
var WDYR = require('@welldone-software/why-did-you-render')

var origJsxDev = jsxDevRuntime.jsxDEV
var wdyrStore = WDYR.wdyrStore

module.exports = {
  ...jsxDevRuntime,
  jsxDEV(...args) {
    if (wdyrStore.React && wdyrStore.React.__IS_WDYR__) {
      var origType = args[0]
      var rest = args.slice(1)
  
      var WDYRType = WDYR.getWDYRType(origType)
      if (WDYRType) {
        try {
          wdyrStore.ownerBeforeElementCreation = WDYR.getCurrentOwner();
          var element = origJsxDev.apply(null, [WDYRType].concat(rest))
          if (wdyrStore.options.logOwnerReasons) {
            WDYR.storeOwnerData(element)
          }
          return element
        } catch(e) {
          wdyrStore.options.consoleLog('whyDidYouRender JSX transform error. Please file a bug at https://github.com/welldone-software/why-did-you-render/issues.', {
            errorInfo: {
              error: e,
              componentNameOrComponent: origType,
              rest: rest,
              options: wdyrStore.options
            }
          })
        }
      }
    }
    
    return origJsxDev.apply(null, args)
  }
};
