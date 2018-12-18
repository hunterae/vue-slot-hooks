// import omit from 'lodash/omit'
import { omit } from '../../src/utils/HelperUtils'

export default {
  functional: true,
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  render(h, context) {
    return h(
      context.props.tag,
      {
        ...omit(context.data, ['attrs']),
        attrs: omit(context.data.attrs, ['tag'])
      },
      context.children
    )
  }
}
