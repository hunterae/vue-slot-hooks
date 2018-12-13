import RenderWithSlotHooks from './RenderWithSlotHooks'

export default {
  props: {
    ...RenderWithSlotHooks.props,
    slotHookStructure: {
      default() {
        return {
          CONTENT: {
            surround: ['prepend', 'default', 'append']
          }
        }
      }
    }
  },
  extends: RenderWithSlotHooks
}
