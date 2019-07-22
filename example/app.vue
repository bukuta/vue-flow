<template>
  <div
    style="position: absolute; width: 100%; height: 100%; background: black;">
    <!-- <flow-graph
      :config="config"
      style="position: absolute; width: 100%; height: 100%; top:0; left:0;"/> -->

    <editor />

  </div>
</template>

<script>
import FlowGraph from '$src/index.vue';
import Editor from './graph-editor.vue';

export default {
  components: {
    FlowGraph,
    Editor,
  },
  data() {
    return {
      config: {
        width: 800,
        height: 600,
        nodeSize: 40,
      },
    };
  },

};
</script>

<style lang="less">
// @import url('../node_modules/font-awesome/css/font-awesome.min.css');
@font-face {
  /* we want the svg version */
  font-family: 'FontAwesomeSVG';
  src: url('../node_modules/font-awesome/fonts/fontawesome-webfont.svg?v=4.0.3#fontawesomeregular') format('svg'),
    url('../node_modules/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.0.3') format('embedded-opentype'),
    url('../node_modules/font-awesome/fonts/fontawesome-webfont.woff?v=4.0.3') format('woff'),
    url('../node_modules/font-awesome/fonts/fontawesome-webfont.ttf?v=4.0.3') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
