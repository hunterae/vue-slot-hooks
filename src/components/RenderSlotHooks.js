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
    let scopedSlots = context.scopedSlots || {}
    let {
      slotName,
      tag,
      innerSlotHooksOnly,
      slotHookNameResolver,
      replaceable,
      slotScopeData
    } = context.props

    let slotProps = { ...context.props, scopedSlots, slotScopeData }

    let slotHookNames = [
      'before',
      'after',
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
        fallbackTag: tag
        // slotReplacesChildren: true
      })
      tag = RenderSlot
    }

    let innerContent = createElement(tag, tagData, [
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
