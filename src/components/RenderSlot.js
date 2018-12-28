import { omit, compact } from '../utils/HelperUtils'
import { renderableSlotScope } from '../utils/RenderUtils'

export default {
  props: {
    name: {
      required: true
    },
    slots: {
      type: Object,
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
    }
  },
  functional: true,
  render(h, context) {
    // TODO: implement scopedSlots handling
    // eslint-disable-next-line no-unused-vars
    let { name, slots, scopedSlots, skip, firstSlotOnly } = context.props
    let slot, scopedSlot

    if (Array.isArray(name)) {
      name = name.find(slotName => typeof slots[slotName] !== 'undefined')
      if (name) {
        slot = slots[name]
        scopedSlot = scopedSlots[name[name.length - 1]]
      }
    } else {
      slot = slots[name]
      scopedSlot = scopedSlots[name]
    }

    if (skip || (!slot && !scopedSlot)) {
      return context.children ? compact(context.children) : []
    } else if (scopedSlot) {
      return compact([
        scopedSlot(renderableSlotScope(context.children, context.data))
      ])
    } else {
      let slotsToRender = firstSlotOnly ? slot.slice(0, 1) : slot
      return compact(
        slotsToRender.map(slot => {
          let data = omit(slot.data || {}, ['slot'])
          if (slot.tag) {
            return h(slot.tag, data, [
              ...(context.children || []),
              ...(slot.children || [])
            ])
          } else {
            return slot
          }
        })
      )
    }
  }
}
