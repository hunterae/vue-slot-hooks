export function renderableSlotScope(content, data = {}) {
  return { ...data, functional: true, render: () => content }
}

export default {}
