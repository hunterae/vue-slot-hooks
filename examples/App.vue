<template>
  <div id="app">
    <some-component>
      <i slot="prepend_navbar">Prepended</i>
      <i slot="append_navbar">Appended</i>
      <div slot="surround_navbar" style="color: orange"></div>
      <h2 slot="before_navbar">Before component</h2>
      <h2 slot="after_navbar">After component</h2>
      <div slot="around_navbar" style="background-color: green"></div>
      <!-- <div slot="around_navbar" slot-scope="scope">
        around
        <component :is="scope"></component>
        around
      </div> -->
      <div slot="navbar">NAVBAR</div>
      <h3 slot="before_all_navbar">Before all component</h3>
      <h3 slot="after_all_navbar">After all component</h3>
      <div slot="around_all_navbar" style="background-color: yellow"></div>
      <div slot="around_all_navbar" style="color: purple"></div>
      <h4 slot="prepend_content">Prepended to content</h4>
      <h4 slot="append_content">Appended to content</h4>
      <h5 slot="some_other_slot">Some other slot from app</h5>
      <div slot="abcd" slot-scope="something">
        <h1>t</h1>
      </div>
    </some-component>
  </div>
</template>

<script>
import RenderTagWithContent from './components/RenderTagWithContent'
import SomeComponent from './components/SomeComponent'

export default {
  name: 'app',
  components: {
    RenderTagWithContent,
    SomeComponent
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
