import RenderWithSlotHooks from './components/RenderWithSlotHooks'
import HelperUtils from './utils/HelperUtils'
import RenderUtils from './utils/RenderUtils'

const VueSlotHooksPlugin = {
  install(Vue, options = {}) {
    Vue.component(options.alias || 'RenderWithSlotHooks', RenderWithSlotHooks)
  }
}

export default VueSlotHooksPlugin

export { RenderWithSlotHooks, HelperUtils, RenderUtils }

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueSlotHooksPlugin)
}
