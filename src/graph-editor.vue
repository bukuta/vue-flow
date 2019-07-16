<template>
  <div class="page page-graph">
    <flow-graph
      :config="config"
      :graph = "graph"
      style="position: absolute; width: 100%; height: 100%; top:0; left:0;"
      @updateMap="updateMap"
    />
    <graph-nav
      :width="200"
      :height="120"
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
