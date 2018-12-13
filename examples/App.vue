<template>
  <div id="app">
    <SomethingWithHooks>
      <RenderTagWithContent style="color:orange" slot="around_example_1" tag="h1" />
      <!-- <i slot="prepend_example_1">Prepended DOM Node</i>
      <i slot="append_example_1">Appended DOM Node</i>
      Content -->
      <!-- <RenderTagWithContent
        tag="i"
        slot="prepend_example_1"
        style="color: orange"
      >Prepended Component</RenderTagWithContent>
      <i slot="append_example_1">Appended DOM Node</i>
      <RenderTagWithContent tag="i" slot="append_example_1" style="color: orange">Appended Content</RenderTagWithContent>

      <h3 slot="before_example_1">"Before" DOM Node</h3>
      <RenderTagWithContent tag="h3" slot="before_example_1" style="color: orange">"Before" Content</RenderTagWithContent>
      <h3 slot="after_example_1">"After" DOM Node</h3>
      <RenderTagWithContent tag="h3" slot="after_example_1" style="color: orange">"After" Content</RenderTagWithContent>

      <h2 slot="before_all_example_1">"Before All" DOM Node</h2>
      <RenderTagWithContent
        tag="h2"
        slot="before_all_example_1"
        style="color: orange"
      >"Before All" Content</RenderTagWithContent>
      <h2 slot="after_all_example_1">"After All" DOM Node</h2>
      <RenderTagWithContent
        tag="h2"
        slot="after_all_example_1"
        style="color: orange"
      >"After All" Content</RenderTagWithContent>

      <div
        style="background-color: green"
        slot-scope="{children, renderer}"
        slot="surround_example_1"
      >
        <component :is="renderer" :children="children"></component>
      </div>

      <RenderTagWithContent
        style="background-color: yellow"
        slot-scope="{children, renderer}"
        slot="around_example_1"
      >
        <component :is="renderer" :children="children"></component>
      </RenderTagWithContent>

      <div
        style="background-color: purple"
        slot-scope="{children, renderer}"
        slot="around_all_example_1"
      >
        <component :is="renderer" :children="children"></component>
      </div> -->

      <b>Content</b>
    </SomethingWithHooks>
  </div>
</template>

<script>
import RenderTagWithContent from '../examples/components/RenderTagWithContent'
import SomethingWithHooks from '../examples/components/SomethingWithHooks'

export default {
  name: 'app',
  components: {
    SomethingWithHooks,
    RenderTagWithContent
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
