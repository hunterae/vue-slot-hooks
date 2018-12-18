import { omit, flatten } from './HelperUtils'
// import omit from 'lodash/omit'
// import flatten from 'lodash/flatten'

export function mapSlotsToChildren(createElement, slots) {
  return flatten(Object.values(slots)).map(slot => {
    return createElement(slot.tag, slot.data, slot.children)
  })
}

export function mergeSlotsFromParent(
  slots,
  scopedSlots,
  parentSlots,
  parentScopedSlots
) {
  let allSlots = {}
  parentSlots = omit(parentSlots, ['default'])
  let slotNames = Object.keys(slots).concat(Object.keys(parentSlots))
  slotNames.forEach(slotName => {
    allSlots[slotName] = []
    if (slots[slotName]) {
      allSlots[slotName] = allSlots[slotName].concat(slots[slotName])
    }
    if (parentSlots[slotName]) {
      allSlots[slotName] = allSlots[slotName].concat(parentSlots[slotName])
    }
  })
  slots = allSlots
  scopedSlots = { ...scopedSlots, ...parentScopedSlots }

  return { slots, scopedSlots }
}

export function namespacedSlotName(
  slotName,
  { slotPrefix, slotSuffix } = { slotPrefix: '', slotSuffix: '' }
) {
  if (slotName === 'default') return slotName
  else return `${slotPrefix}${slotName}${slotSuffix}`
}

export function slotFor(slotName, slots, namespace) {
  let namedSlot = slots[namespacedSlotName(slotName, namespace)] || []
  namedSlot.forEach(slot => {
    if (slot.data) delete slot.data.slot
  })
  return namedSlot
}

export function scopedSlotFor(slotName, scopedSlots, namespace) {
  return scopedSlots[namespacedSlotName(slotName, namespace)]
}

export function applyAroundSlots(
  slotName,
  slots,
  scopedSlots,
  content,
  namespace,
  createElement
) {
  let scopedHook = scopedSlotFor(slotName, scopedSlots, namespace)
  let slotHook = slotFor(slotName, slots, namespace)[0]
  if (scopedHook) {
    return [scopedHook({ functional: true, render: () => content })]
  } else if (slotHook) {
    return [createElement(slotHook.tag, slotHook.data, [content])]
  } else {
    return content
  }
}
