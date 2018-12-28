// TODO: ability to provide an alias to fields as a kind of backup for where to find definitions
// TODO: ability to specity a proxy slot - aka a different slot to render with
// TODO: See if importing Lodash methods via approach in this article https://www.blazemeter.com/blog/the-correct-way-to-import-lodash-libraries-a-benchmark is sufficient over the custom implemntations of these methods

import { pick, omit } from '../utils/HelperUtils'
import RenderSlotHooks from './RenderSlotHooks'
import { InheritSlots } from 'vue-inherit-slots'

export default {
  props: {
    ...omit(RenderSlotHooks.props, ['tag', 'slotHookNameResolver']),
    ...InheritSlots.props,
    inheritSlots: {
      type: Boolean,
      default: false
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
        if (hookName === 'default') {
          return slotName ? ['default', slotName] : 'default'
        } else {
          return slotName ? `${hookName}_${slotName}` : hookName
        }
      }
    }
    // TODO: implement this
    // replaceable: {
    //   type: Boolean,
    //   default: true
    // },
    // TODO: implement this - whether or not replacing the element definition completely replaces it or just replaces it's children
    // preserveTag: {
    //   type: Boolean,
    //   default: true
    // }
    // TODO: implement this
    // skippable: {
    //   type: Boolean,
    //   default: true
    // }
  },
  functional: true,
  render(createElement, context) {
    let { inheritSlots, slotHookRenderer, tag } = context.props
    let scopedSlots = context.data.scopedSlots || {}
    tag = tag || context.data.tag || 'div'

    let inheritedSlots = []
    if (inheritSlots) {
      inheritedSlots = [
        createElement(InheritSlots, {
          scopedSlots: omit(scopedSlots, ['default']),
          props: pick(context.props, Object.keys(InheritSlots.props))
        })
      ]
    }

    return createElement(
      slotHookRenderer,
      {
        ...context.data,
        scopedSlots,
        props: {
          ...pick(context.props, Object.keys(RenderSlotHooks.props)),
          tag
        }
      },
      [...inheritedSlots, context.children]
    )
  }
}
