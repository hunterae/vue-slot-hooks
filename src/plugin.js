import RenderWithSlotHooks from './components/RenderWithSlotHooks'
import RenderWithOuterSlotHooks from './components/RenderWithOuterSlotHooks'
import RenderWithInnerSlotHooks from './components/RenderWithInnerSlotHooks'

export default {
  install(Vue, options = {}) {
    let alias = options.alias
    let mainRenderer, outerHooksRenderer, innerHooksRenderer
    if (typeof alias === 'string') {
      mainRenderer = Vue.component(alias, RenderWithSlotHooks)
    } else if (alias) {
      if (alias.main)
        mainRenderer = Vue.component(alias.main, RenderWithSlotHooks)
      if (alias.outer)
        outerHooksRenderer = Vue.component(
          alias.outer,
          RenderWithOuterSlotHooks
        )
      if (alias.inner)
        innerHooksRenderer = Vue.component(
          alias.inner,
          RenderWithInnerSlotHooks
        )
    }

    if (!mainRenderer) Vue.component('RenderWithSlotHooks', RenderWithSlotHooks)
    if (!outerHooksRenderer)
      Vue.component('RenderWithOuterSlotHooks', RenderWithOuterSlotHooks)
    if (!innerHooksRenderer)
      Vue.component('RenderWithInnerSlotHooks', RenderWithInnerSlotHooks)
  }
}
