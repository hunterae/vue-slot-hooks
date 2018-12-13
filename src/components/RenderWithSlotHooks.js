// TODO: automatically convert named around slots with no definition to scoped slots?
// TODO: if going with above idea, this would allow multiple such slots to be defined - dsl might need to be adjusted to limit to single or multi
// TODO: build slotHookStructure with some sort of a dsl
// TODO: ability to "skip"
// TODO: ability to specify content for block ("SLOT_PREFIXcontentSLOT_SUFFIX")
// TODO: prop to inherit-parent-default-slot
// TODO: add a force-root-component option, to allow a component to be rendered "around" everything if the coresponding result would break single child rules

import {
  mapSlotsToChildren,
  mergeSlotsFromParent,
  namespacedSlotName,
  applyAroundSlots,
  slotFor
} from './SlotUtils'
import omit from 'lodash/omit'
import isPlainObject from 'lodash/isPlainObject'
import compact from 'lodash/compact'

export default {
  props: {
    tag: {
      default: null
    },
    slotPrefix: {
      default: ''
    },
    slotSuffix: {
      default: ''
    },
    inheritParentSlots: {
      type: Boolean,
      default: false
    },
    slotHookStructure: {
      default() {
        return [
          'before_all',
          {
            around_all: [
              'before',
              {
                around: {
                  CONTENT: {
                    surround: ['prepend', 'default', 'append']
                  }
                }
              },
              'after'
            ]
          },
          'after_all'
        ]
      }
    }
  },
  functional: true,
  render(createElement, context) {
    let slots = context.slots()
    let scopedSlots = context.data.scopedSlots || {}

    if (context.props.inheritParentSlots) {
      ({ slots, scopedSlots } = mergeSlotsFromParent(
        slots,
        scopedSlots,
        context.parent.$slots,
        context.parent.$scopedSlots
        // TODO: pass another option specifying whether to include the parents default slot
      ))
    }

    let tag = context.props.tag || context.data.tag || 'div'

    const detectSlotNamesUsed = slotHookStructure => {
      if (Array.isArray(slotHookStructure)) {
        let slotNamesUsed = []
        slotHookStructure.forEach(hook => {
          slotNamesUsed = slotNamesUsed.concat(detectSlotNamesUsed(hook))
        })
        return compact(slotNamesUsed)
      } else if (isPlainObject(slotHookStructure)) {
        let [hook, innerHooks] = Object.entries(slotHookStructure)[0]
        if (hook === 'CONTENT') {
          return detectSlotNamesUsed(innerHooks)
        } else {
          return [
            namespacedSlotName(hook, context.props),
            ...detectSlotNamesUsed(innerHooks)
          ]
        }
      } else if (slotHookStructure === 'CONTENT') {
        return []
      } else if (typeof slotHookStructure === 'string') {
        return [namespacedSlotName(slotHookStructure, context.props)]
      }
    }

    let slotNamesUsed = detectSlotNamesUsed(context.props.slotHookStructure)
    let unusedSlots = mapSlotsToChildren(
      createElement,
      omit(slots, slotNamesUsed)
    )
    let unusedScopedSlots = omit(scopedSlots, slotNamesUsed)

    let createContent = (contextData, unusedSlots) => {
      return createElement(tag, contextData, unusedSlots)
    }

    let applySlotHooks = hooks => {
      if (Array.isArray(hooks)) {
        return hooks.map(hook => applySlotHooks(hook))
      } else if (isPlainObject(hooks)) {
        let [hook, innerHooks] = Object.entries(hooks)[0]
        if (hook === 'CONTENT') {
          return createContent(
            { ...context.data, scopedSlots: unusedScopedSlots },
            applySlotHooks(innerHooks)
          )
        } else {
          return applyAroundSlots(
            hook,
            scopedSlots,
            applySlotHooks(innerHooks),
            context.props
          )
        }
      } else if (hooks === 'CONTENT') {
        return createContent(
          { ...context.data, scopedSlots: unusedScopedSlots },
          unusedSlots
        )
      } else if (typeof hooks === 'string') {
        return slotFor(hooks, slots, context.props)
      }
    }

    let content = applySlotHooks(context.props.slotHookStructure)
    return content
  }
}
