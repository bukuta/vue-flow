<template>
  <div class="page page-graph">
    <flow-graph
      :config="config"
      :graph = "graph"
      style="position: absolute; width: 100%; height: 100%; top:0; left:0;"
      @updateMap="updateMap"
    />
    <graph-nav
      :options="options"
      :graph ="graph"
      :viewport="viewport"
    />
  </div>
</template>

<script>
import FlowGraph from './packages/flow-graph/index.vue';
import * as Utils from './utils';
import GraphNav from './packages/flow-graph/nav.vue';

const data = require('./data.json');

console.log(data);

export default {
  name: 'GrpahEditor',
  components: {
    FlowGraph,
    GraphNav,

  },
  data() {
    return {
      config: {
        width: 800,
        height: 600,
        nodeSize: 40,
      },
      scenario: data.data,
      graph: Utils.wrapScenario(data.data.scenes[0].graph),
      viewport: {
        x: 0,
        y: 0,
        scale: 1,
        windowWidth: 100,
        windowHeight: 100,
      },
      options: {
        width: 216,
        height: 162,
        hidden: false, // FIXME: drop??
        backgroundColor: 'hsla(184, 8%, 75%, 0.9)',
        outsideFill: 'hsla(0, 0%, 0%, 0.4)',
        nodeSize: 60,
        nodeLineWidth: 1,
        viewrectangle: [0, 0, 0, 0],
        viewscale: 1.0,
        viewBoxBorder: 'hsla(190, 100%, 80%, 0.4)',
        viewBoxBorder2: 'hsla( 10,  60%, 32%, 0.3)',
        viewBoxBorderStyle: 'solid',
        // graph: Utils.wrapScenario(data.data.scenes[0].graph),
      },
    };
  },

  computed: {
    graph2() {
      // const unwraped = Utils.wrapScenario(this.scenario.graph);
      const unwraped = Utils.wrapScenario(this.scenario.scenes[0].graph);
      return unwraped;
    },
  },
  methods: {
    updateMap(data) {
      console.log('updateMap', data);
      this.viewport = { ...this.viewport, ...data };
      this.options.viewrectangle = [this.viewport.x * -1, this.viewport.y * -1, this.viewport.windowWidth, this.viewport.windowHeight];
      this.options.viewscale = this.viewport.scale;
    },
  },

};
</script>

<style lang="less">
.page-graph{
  position: absolute;
  width: 100%;
  height: 100%;
}

</style>
