<template>
  <div>
    <!-- <h1 is="render-with-slot-hooks" slot-name="navbar" inherit-parent-slots :a="1">
      <h5 slot="some_other_slot">Some other slot from SomeComponent</h5>
      <h2 slot="prepend_navbar">Prepended in component</h2>
      my header
      <div slot="efgh" slot-scope="something">
        <h1>t</h1>
      </div>
    </h1> -->

    <render-with-slot-hooks
      tag="functional-render-tag-with-content"
      content-tag="h1"
      slot-name="navbar"
      :scoped-slots="$scopedSlots"
    >
      <h5 slot="some_other_slot">Some other slot from SomeComponent</h5>
      <h2 slot="prepend_navbar">Prepended in component</h2>
      my header
      <div slot="efgh" slot-scope="{}"><h1>t</h1></div>
    </render-with-slot-hooks>
    <!-- <render-tag-with-content content-tag="h1">
      <inherit-slots />
      <h5 slot="some_other_slot">Some other slot from SomeComponent</h5>
      hi
    </render-tag-with-content>

    <functional-render-tag-with-content content-tag="h1">
      <inherit-slots />
      <h5 slot="some_other_slot">Some other slot from SomeComponent</h5>
      hi
    </functional-render-tag-with-content> -->

    <!-- <div>
      <div slot="some_other_slot">Some other slot from SomeComponent</div>
      <div slot="prepend_navbar">Prepended in component</div>
      my header
      <div slot="efgh" slot-scope="something">
        <i>t</i>
      </div>
    </div> -->
    <!-- <render-with-slot-hooks tag="div" slot-name="content" inherit-parent-slots>
      Content
    </render-with-slot-hooks> -->
  </div>
</template>

<script>
import RenderTagWithContent from './RenderTagWithContent'
import FunctionalRenderTagWithContent from './FunctionalRenderTagWithContent'

export default {
  components: {
    RenderTagWithContent,
    FunctionalRenderTagWithContent
  }
}
</script>

<style></style>
