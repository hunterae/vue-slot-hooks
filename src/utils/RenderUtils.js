export function renderableSlotScope(content, data = {}) {
  return { ...data, functional: true, render: () => content }
}

export function mergeSlots(childScopedSlots, parentScopedSlots) {
  if (typeof parentScopedSlots === 'undefined') parentScopedSlots = {}
  if (typeof childScopedSlots === 'undefined') childScopedSlots = {}
  let mergedSlots = { ...childScopedSlots }

  Object.entries(parentScopedSlots).forEach(([key, value]) => {
    let currentSlot = mergedSlots[key]
    if (key !== 'default' && typeof currentSlot !== 'undefined') {
      mergedSlots[key] = (...args) => [
        ...value(...args),
        ...currentSlot(...args)
      ]
    } else {
      mergedSlots[key] = value
    }
  })

  return mergedSlots
}

export default {}
