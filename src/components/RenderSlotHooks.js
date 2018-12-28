import RenderSlot from './RenderSlot'
import { omit, flatten } from '../utils/HelperUtils'
export default {
  props: {
    slotName: {
      type: String,
      default: null
    },
    innerSlotHooksOnly: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      required: true
    },
    tagData: {
      type: Object,
      default: null
    },
    passSlotsToTag: {
      type: Boolean,
      default: true
    },
    slotHookNameResolver: {
      type: Function,
      required: true
    }
  },
  components: {
    RenderSlot
  },
  functional: true,
  render(createElement, context) {
    let slots = context.slots()
    let scopedSlots = context.data.scopedSlots
    let {
      slotName,
      tag,
      innerSlotHooksOnly,
      slotHookNameResolver,
      passSlotsToTag
    } = context.props

    let slotProps = {
      ...context.props,
      slots,
      scopedSlots: scopedSlots
    }

    let slotHookNames = [
      'before_all',
      'around_all',
      'after_all',
      'before',
      'around',
      'after',
      'surround',
      'prepend',
      'default',
      'append'
    ].reduce((hash, hookName) => {
      hash[hookName] = slotHookNameResolver(slotName, hookName)
      return hash
    }, {})
    let slotNamesUsed = flatten(Object.values(slotHookNames))

    let slotChildren = passSlotsToTag
      ? flatten(Object.values(omit(slots, slotNamesUsed)))
      : []

    let slotDataFor = (hookName, additionalProps = {}) => {
      return {
        props: {
          ...slotProps,
          ...additionalProps,
          name: slotHookNames[hookName]
        }
      }
    }

    let tagData = {
      ...(context.props.tagData || omit(context.data, ['props'])),
      scopedSlots: omit(scopedSlots, slotNamesUsed)
    }

    let content = [
      createElement(
        RenderSlot,
        slotDataFor('before_all', { skip: innerSlotHooksOnly })
      ),
      createElement(
        RenderSlot,
        slotDataFor('around_all', {
          skip: innerSlotHooksOnly,
          firstSlotOnly: true
        }),
        [
          createElement(
            RenderSlot,
            slotDataFor('before', { skip: innerSlotHooksOnly })
          ),
          createElement(
            RenderSlot,
            slotDataFor('around', {
              skip: innerSlotHooksOnly,
              firstSlotOnly: true
            }),
            [
              createElement(tag, tagData, [
                ...slotChildren,
                createElement(
                  RenderSlot,
                  slotDataFor('surround', { firstSlotOnly: true }),
                  [
                    createElement(RenderSlot, slotDataFor('prepend')),
                    createElement(RenderSlot, slotDataFor('default')),
                    createElement(RenderSlot, slotDataFor('append'))
                  ]
                )
              ])
            ]
          ),
          createElement(RenderSlot, {
            props: {
              ...slotProps,
              skip: innerSlotHooksOnly,
              name: slotHookNameResolver(slotName, 'after')
            }
          })
        ]
      ),
      createElement(RenderSlot, {
        props: {
          ...slotProps,
          skip: innerSlotHooksOnly,
          name: slotHookNameResolver(slotName, 'after_all')
        }
      })
    ]

    return innerSlotHooksOnly ? flatten(content)[0] : content
  }
}
