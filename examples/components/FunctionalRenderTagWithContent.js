import { omit } from '../../src/utils/HelperUtils'

export default {
  functional: true,
  props: {
    contentTag: {
      type: String,
      default: 'div'
    }
  },
  render(h, context) {
    let slots = context.slots()
    return h(
      context.props.contentTag,
      {
        ...omit(context.data, ['attrs']),
        attrs: omit(context.data.attrs, ['contentTag'])
      },
      slots.default
    )
  }
}
