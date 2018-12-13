import RenderWithSlotHooks from './RenderWithSlotHooks'

export default {
  props: {
    slotHookStructure: {
      default() {
        return [
          'before_all',
          {
            around_all: [
              'before',
              {
                around: 'CONTENT'
              },
              'after'
            ]
          },
          'after_all'
        ]
      }
    }
  },
  extends: RenderWithSlotHooks
}
