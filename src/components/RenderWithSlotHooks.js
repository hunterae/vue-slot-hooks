// TODO: ability to provide an alias to fields as a kind of backup for where to find definitions
// TODO: ability to specity a proxy slot - aka a different slot to render with
// TODO: See if importing Lodash methods via approach in this article https://www.blazemeter.com/blog/the-correct-way-to-import-lodash-libraries-a-benchmark is sufficient over the custom implemntations of these methods

import { pick, omit } from '../utils/HelperUtils'
import RenderSlotHooks from './RenderSlotHooks'
import { InheritSlots } from 'vue-inherit-slots'
//  For local development:
// import InheritSlots from '../../../vue-inherit-slots/src/components/InheritSlots'

export default {
  props: {
    ...omit(RenderSlotHooks.props, ['tag', 'slotHookNameResolver']),
    ...InheritSlots.props,
    inheritSlots: {
      type: Boolean,
      default: true
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
    let { inheritSlots, slotHookRenderer, tag } = context.props
    let scopedSlots = context.data.scopedSlots || {}
    tag = tag || context.data.tag

    let inheritedSlots = []

    inheritedSlots = [
      createElement(
        InheritSlots,
        {
          scopedSlots: scopedSlots,
          props: {
            ...pick(context.props, Object.keys(InheritSlots.props)),
            inheritParentSlots: inheritSlots
          }
        },
        context.children
      )
    ]

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
      inheritedSlots
    )
  }
}
