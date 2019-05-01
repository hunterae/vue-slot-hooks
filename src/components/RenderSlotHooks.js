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
      default: 'template'
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
      default: false
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
      'before',
      'around',
      'tag',
      'prepend_tag',
      'around_content',
      'prepend_content',
      'content',
      'append_content',
      'append_tag'
    ].reduce((hash, hookName) => {
      hash[hookName] = slotHookNameResolver(slotName, hookName)
      return hash
    }, {})

    let slotNamesUsed = flatten(Object.values(slotHookNames))

    let slotChildren = []
    if (passSlotsToTag) {
      slotChildren = Object.entries(omit(slots, slotNamesUsed)).map(
        ([slotName, slots]) => {
          return createElement(
            'template',
            {
              slot: slotName
            },
            slots
          )
        }
      )
    }

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
      createElement(RenderSlot, slotDataFor('prepend_tag')),
      createElement(
        RenderSlot,
        slotDataFor('around_content', {
          firstSlotOnly: true
        }),
        [
          createElement(RenderSlot, slotDataFor('prepend_content')),
          createElement(RenderSlot, slotDataFor('content')),
          createElement(RenderSlot, slotDataFor('append_content'))
        ]
      ),
      createElement(RenderSlot, slotDataFor('append_tag'))
    ])

    if (innerSlotHooksOnly) {
      return innerContent
    } else {
      return [
        createElement(RenderSlot, slotDataFor('before')),
        createElement(
          RenderSlot,
          slotDataFor('around', {
            firstSlotOnly: true
          }),
          [innerContent]
        ),
        createElement(RenderSlot, slotDataFor('after'))
      ]
    }
  }
}
