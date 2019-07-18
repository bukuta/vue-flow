<template>
  <div class="page page-graph">
    <flow-graph
      :config="config"
      :graph = "graph"
      :actions="actions"
      style="position: absolute; width: 100%; height: 100%; top:0; left:0;"
      @updateMap="updateMap"
      @action="onAction"
    />
    <graph-nav
      :options="options"
      :graph ="graph"
      :viewport="viewport"
    />

    <el-dialog
      :visible.sync="isAddingNode"
      title="添加节点"
      append-to-body
      class="dialog-node-form"
      width="600px">
      <node-form ref="nodeForm"/>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="isAddingNode = false">取 消</el-button>
        <el-button
          type="primary"
          @click="isAddingNode = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FlowGraph from './packages/flow-graph/index.vue';
import * as Utils from './utils';

import * as FlowUtils from './packages/flow-graph/utils';
import GraphNav from './packages/flow-graph/nav.vue';
import NodeForm from './nodeForm.vue';

import configs from './configs';
import creator from './creator';

const data = require('./data.json');

console.log(data);

export default {
  name: 'GrpahEditor',
  components: {
    FlowGraph,
    GraphNav,
    NodeForm,
  },

  data() {
    return {
      isAddingNode: false,
      actions: configs.actions,
      config: {
        width: 800,
        height: 600,
        nodeSize: 40,
      },
      scenario: data.data,
      graph: Utils.wrapScenario(data.data.graph),
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
    payloads() {
      return this.scenario.scenes[0].quizList;
    },
  },
  methods: {
    onSave() {
      const r = Utils.unwrapToScenario(this.graph);
      console.log(r);
    },
    onAction(action) {
      console.log('onAction', action);
      if (action.action === 'create') {
        this.onCreateNode(action.context);
        return;
      }
      if (action.context.type === 'node') {
        if (action.action === 'info') {
          this.onInfoNode(action);
        } else if (action.action === 'delete') {
          this.onDeleteNode(action.context);
        }
      } else if (action.context.type === 'line') {
        if (action.action === 'info') {
          this.onInfoEdge(action);
        } else if (action.action === 'delete') {
          this.onDeleteEdge(action.context);
        }
      }
    },
    onDeleteEdge(context) {
      const item = context.node;
      const r = confirm('确定删除边吗');
      if (r) {
        let {
          nodes, edges, lines, nodeMap,
        } = this.graph;
        edges = edges.filter(({ from, to }) => !(from.nodeElement.id === item.from.nodeElement.id && to.nodeElement.id === item.to.nodeElement.id));
        lines = FlowUtils.buildLines({ edges, nodeMap }, { nodeWidth: 72, nodeHeight: 72 });
        this.graph = {
          ...this.graph, nodes, edges, lines,
        };
      }
    },
    onInfoEdge(action) {
      console.log('onInfoEdge');
    },
    onDeleteNode(context) {
      const item = context.node;
      const r = confirm('确定删除吗');
      if (r) {
        let {
          nodes, edges, lines, nodeMap,
        } = this.graph;
        nodes = nodes.filter(node => node.id !== item.id);
        edges = edges.filter(({ from, to }) => from.nodeElement.id !== item.id && to.nodeElement.id !== item.id);
        lines = FlowUtils.buildLines({ edges, nodeMap }, { nodeWidth: 72, nodeHeight: 72 });
        this.graph = {
          ...this.graph, nodes, edges, lines,
        };
      }
    },
    onInfoNode(action) {
      console.log('onInfoNode');
    },
    onCreateNode(context) {
      const message = <NodeForm key={Date.now()} />;
      creator({ title: '添加节点', message }).then((rs) => {
        console.log(rs);
        const node = {
          component: configs.components.find(item => item.name === rs.component),
          id: `${rs.component}_${this.graph.nodes.length}`,
          metadata: {
            label: rs.name,
            description: rs.description,
            x: context.x - 72 / 2,
            y: context.y - 72 / 2,
            width: 72,
            height: 72,
          },
        };
        this.graph.nodes.push(node);
      });
    },

    updateMap(option) {
      // console.log('updateMap', option);
      this.viewport = { ...this.viewport, ...option };
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
.dialog-node-form{
  .el-dialog{
    width: 600px;
  }
}

</style>
