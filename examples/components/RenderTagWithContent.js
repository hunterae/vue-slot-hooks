import { omit } from '../../src/utils/HelperUtils'

export default {
  props: {
    contentTag: {
      type: String,
      default: 'div'
    }
  },
  render(h) {
    let slots = this.$slots
    return h(this.contentTag, {}, slots.default)
  }
}
