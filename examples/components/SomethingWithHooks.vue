<template>
  <div>
    <RenderTagWithContent
      is="render-with-slot-hooks"
      tag="h1"
      style="color:red"
      slot-suffix="_example_1"
      inherit-parent-slots
    >Test</RenderTagWithContent>
  </div>
</template>

<script>
import RenderTagWithContent from './RenderTagWithContent'

export default {
  components: {
    RenderTagWithContent
  }
}
</script>

<style>
</style>
