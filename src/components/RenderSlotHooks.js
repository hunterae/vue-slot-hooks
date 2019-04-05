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
      required: true
    },
    tagData: {
      type: Object,
      default: null
    },
    slotScopeData: {
      type: Object,
      default() {
        return {}
      }
    },
    passSlotsToTag: {
      type: Boolean,
      default: true
    },
    slotHookNameResolver: {
      type: Function,
      required: true
    },
    replaceable: {
      type: Boolean,
      default: true
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
      passSlotsToTag,
      replaceable,
      slotScopeData
    } = context.props

    let slotProps = { ...context.props, slots, scopedSlots, slotScopeData }

    let slotHookNames = [
      'before_all',
      'around_all',
      'after_all',
      'before',
      'around',
      'after',
      'around_content',
      'prepend',
      'default',
      'append',
      'tag'
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

    if (replaceable) {
      tagData = slotDataFor('tag', {
        firstSlotOnly: true,
        fallbackTagData: tagData,
        fallbackTag: tag,
        slotReplacesChildren: true
      })
      tag = RenderSlot
    }

    let innerContent = createElement(tag, tagData, [
      ...slotChildren,
      createElement(
        RenderSlot,
        slotDataFor('around_content', {
          firstSlotOnly: true
        }),
        [
          createElement(RenderSlot, slotDataFor('prepend')),
          createElement(RenderSlot, slotDataFor('default')),
          createElement(RenderSlot, slotDataFor('append'))
        ]
      )
    ])

    if (innerSlotHooksOnly) {
      return innerContent
    } else {
      return [
        createElement(RenderSlot, slotDataFor('before_all')),
        createElement(
          RenderSlot,
          slotDataFor('around_all', {
            firstSlotOnly: true
          }),
          [
            createElement(RenderSlot, slotDataFor('before', {})),
            createElement(
              RenderSlot,
              slotDataFor('around', {
                firstSlotOnly: true
              }),
              [innerContent]
            ),
            createElement(RenderSlot, slotDataFor('after'))
          ]
        ),
        createElement(RenderSlot, slotDataFor('after_all'))
      ]
    }
  }
}
