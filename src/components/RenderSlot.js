import { omit, compact } from '../utils/HelperUtils'
import { renderableSlotScope } from '../utils/RenderUtils'

export default {
  props: {
    name: {
      required: true
    },
    scopedSlots: {
      type: Object,
      required: true
    },
    skip: {
      type: Boolean,
      default: false
    },
    firstSlotOnly: {
      type: Boolean,
      default: false
    },
    fallbackTag: {},
    fallbackTagData: {
      type: Object
    },
    slotReplacesChildren: {
      type: Boolean,
      default: false
    },
    slotScopeData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  functional: true,
  render(h, context) {
    let {
      name,
      scopedSlots,
      skip,
      firstSlotOnly,
      fallbackTag,
      fallbackTagData,
      slotReplacesChildren,
      slotScopeData
    } = context.props
    let slot, scopedSlot

    let slotNames = name
    if (!Array.isArray(slotNames)) {
      slotNames = [name]
    }

    slotNames.some(name => {
      scopedSlot = scopedSlots[name]

      return scopedSlot
    })

    let children = slotReplacesChildren ? [] : context.children

    if (skip || (!slot && !scopedSlot)) {
      if (fallbackTag) {
        return [h(fallbackTag, fallbackTagData, context.children)]
      } else {
        return context.children ? compact(context.children) : []
      }
    } else if (scopedSlot) {
      let content = scopedSlot(renderableSlotScope(children, slotScopeData))
      content = compact(content)
      content.forEach(node => {
        if (node.data && node.data.slot) delete node.data.slot
      })
      return content
    } else {
      let slotsToRender = firstSlotOnly ? slot.slice(0, 1) : slot
      return compact(
        slotsToRender.map(slot => {
          let data = omit(slot.data || {}, ['slot'])
          if (slot.tag && !slot.componentOptions) {
            return h(slot.tag, data, [
              ...(children || []),
              ...(slot.children || [])
            ])
          } else {
            slot.data = data

            return slot
          }
        })
      )
    }
  }
}
