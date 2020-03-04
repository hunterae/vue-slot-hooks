// TODO: ability to provide an alias to fields as a kind of backup for where to find definitions
// TODO: ability to specity a proxy slot - aka a different slot to render with
// TODO: See if importing Lodash methods via approach in this article https://www.blazemeter.com/blog/the-correct-way-to-import-lodash-libraries-a-benchmark is sufficient over the custom implemntations of these methods

import { pick, omit } from '../utils/HelperUtils'
import { mergeSlots } from '../utils/RenderUtils'
import RenderSlotHooks from './RenderSlotHooks'

export default {
  props: {
    ...omit(RenderSlotHooks.props, ['tag', 'slotHookNameResolver']),
    inheritDefaultSlot: {
      type: Boolean,
      default: false
    },
    inheritParentSlots: {
      type: Boolean,
      default: false
    },
    scopedSlots: {
      type: Object,
      default: null
    },
    tag: {
      default: null
    },
    slotHookRenderer: {
      type: Object,
      default() {
        return RenderSlotHooks
      }
    },
    slotHookNameResolver: {
      type: Function,
      default(slotName, hookName) {
        let splitHookName = hookName.match(/(\w+)_(\w+)/)
        if (hookName === 'tag') {
          return slotName || 'tag'
        } else if (hookName === 'content') {
          return ['default', slotName ? `${slotName}_content` : 'content']
        } else if (splitHookName) {
          return slotName
            ? `${splitHookName[1]}_${slotName}_${splitHookName[2]}`
            : hookName
        } else {
          return slotName ? `${hookName}_${slotName}` : hookName
        }
      }
    }
    // TODO: implement this
    // skippable: {
    //   type: Boolean,
    //   default: true
    // }
  },
  functional: true,
  render(createElement, context) {
    let {
      slotHookRenderer,
      tag,
      inheritDefaultSlot,
      inheritParentSlots
    } = context.props

    let parentScopedSlots = context.props.scopedSlots

    // if (context.props.slotName === 'header_row') debugger
    tag = tag || context.data.tag

    if (!parentScopedSlots) {
      if (inheritParentSlots) {
        parentScopedSlots = context.parent.$scopedSlots || {}
      } else {
        parentScopedSlots = {}
      }
    }
    if (!inheritDefaultSlot) {
      parentScopedSlots = omit(parentScopedSlots, ['default'])
    }

    let scopedSlots = mergeSlots(context.scopedSlots, parentScopedSlots)

    return createElement(slotHookRenderer, {
      ...context.data,
      scopedSlots,
      props: {
        ...pick(context.props, Object.keys(RenderSlotHooks.props)),
        tag
      }
    })
  }
}
