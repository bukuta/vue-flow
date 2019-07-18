<template>
  <div
    ref="flowGraph"
    :class="scaleClass"
    class="flow-graph"
  >
    <canvas
      ref="backgroundCanvas"
      :width="state.width"
      :height="state.height"
      style="position: absolute; top:0; left:0;"
      class="app-canvas"/>

    <svg
      ref="svg"
      :width="state.width"
      :height="state.height"
      class="app-svg"
      style="position: absolute; top:0; left:0;"
      @contextmenu="requestShowContextMenu"
      @press="requestShowContextMenu"
      @click="cancelEdgeStart"
    >
      <g
        :transform="svgTransform"
        class="view"
      >
        <g class="graph">
          <g class="groups">
            <vue-graph-group
              v-for="item of groups"
              :group="item"
              :key="item.name"
            />

          </g>
          <g class="iips"/>


          <g class="edges" >
            <vue-graph-line
              v-for="(item,index) of lines"
              :line="item"
              :key="index"
              @context-menu="doShowContextMenu"/>

            <vue-graph-line
              v-if="isStartEdge"
              :line="previewLine"
            />
          </g>


          <g class="nodes">
            <vue-graph-node
              v-for="item of nodes"
              :node="item"
              :library="libraryMap"
              :scale="state.scale"
              :key="item.id"
              :highlight-port="state.highlightPort"
              @context-menu="doShowContextMenu"
              @edge-start="edgeStart"
            />
          </g>


          <g class="ex-inports"/>
          <g class="ex-outports" />
        </g>
      </g>
      <g
        class="tooltip hidden"
        transform=""/>
      <g class="context" >
        <vue-graph-menu
          v-if="canShowMenu"
          :actions="menuContext.actions"
          :nodeType="menuContext.nodeType"
          :node="menuContext.item"
          :context="menuContext"
          :component="menuContext.item.component"
          @menu-action="onMenuAction"
          @context-menu-hidden="canShowMenu=false"
        />
      </g>
    </svg>

  </div>
</template>

<script>
import Hammer from 'hammerjs';

import _ from 'lodash';
import graph from './data';

import hammerhacks from './hammer';
import VueGraphNode from './node.vue';
import VueGraphLine from './line.vue';
import VueGraphMenu from './menu.vue';

import { assambleGraph, updateNode, buildLine } from './utils';


// const graph2 = assambleGraph(graph, { nodeWidth: 72, nodeHeight: 72 });

export default {
  components: {
    VueGraphNode,
    VueGraphLine,
    VueGraphMenu,

  },
  props: {
    actions: {
      type: Object,
      default() {
        return {};
      },
    },
    graph: {
      type: Object,
      default() {
        return {};
      },
    },
    config: {
      type: Object,
      default() {
        return {
          nodeSize: 20,
          onNodeSelection: () => {},
          onPanScale: () => {},
          width: 500,
          height: 300,
        };
      },
    },

  },
  data() {
    return {
      isEdgePreview: false,
      edgePreviewType: '',
      previewLine: {},
      canShowMenu: false,
      menuContext: {
        component: null,
        actions: [],
        nodeType: 'node', // node/line
        node: null,
        x: 0,
        y: 0,
      },
      zoomFactor: 0,
      zoomX: 0,
      zoomY: 0,
      state: {
        highlightPort: {},
        currentMovingNode: '',
        minZoom: 0.15,
        maxZoom: 15.0,
        scale: 1,
        width: 500,
        height: 300,
        x: 0,
        y: 0,
      },
    };
  },
  provide() {
    return {
      rootState: this.state,
      rootUpdateNode: this.updateNode,
      library: this.graph.library,
    };
  },

  computed: {
    scaleClass() {
      if (this.state.scale > 1.2) {
        return 'big';
      }
      if (this.state.scale < 0.4) {
        return 'small';
      }
      return 'normal';
    },
    lines() {
      return this.graph.lines;
    },
    groups() {
      return this.graph.groups;
    },
    nodes() {
      return this.graph.nodes;
    },
    svgTransform() {
      const sc = this.state.scale;
      const x = this.state.x;
      const y = this.state.y;
      const transform = `matrix(${sc},0,0,${sc},${x},${y})`;
      return transform;
    },
    libraryMap() {
      const map = {};
      this.graph.library.forEach((item) => {
        map[item.name] = item;
      });
      return map;
    },
    isStartEdge() {
      return this.isEdgePreview && this.previewLine.metadata;
    },
  },
  watch: {
    state() {
      this.renderCanvas();
    },
  },


  mounted() {
    this.init();
    this.onresize = _.throttle(this.init.bind(this), 500, { trailing: true, leading: true });

    window.addEventListener('resize', this.onresize);
    // this.renderCanvas();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onresize);
  },
  methods: {
    init() {
      this.bgContext = this.$refs.backgroundCanvas.getContext('2d');

      this.didMounted();

      const el = this.$refs.flowGraph;
      this.state.width = el.clientWidth;
      this.state.height = el.clientHeight;
      this.$nextTick(() => {
        this.renderCanvas();
        this.emitUpdate();
      });
    },
    edgeStart(data = {
      x: 0, y: 0, type: 'inport', node: {},
    }) {
      console.log('edgeStart', data);
      if (!this.isEdgePreview) {
        this.edgePreviewType = data.type;
        this.isEdgePreview = true;
        this.startNode = data.node;
        this.state.highlightPort = { type: 'all', isIn: data.type === 'outport' };
        window.addEventListener('mousemove', e => this.mousemove(e, data));
      } else if (this.edgePreviewType !== data.type) {
        this.isEdgePreview = false;
        this.state.highlightPort = {};
        this.edgePreviewType = '';
        this.mousemoveover(data);
      }
    },
    mousemove(e, data) {
      let x = e.x || e.clientX || 0;
      let y = e.y || e.clientY || 0;
      if (e.touches && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }

      const startPosition = this.screenPosition2StagePosition({ x: data.x, y: data.y });
      const endPosition = this.screenPosition2StagePosition({ x, y });

      this.previewLine = buildLine(startPosition, endPosition);
    },
    mousemoveover(data) {
      console.log(this.previewLine);
      const edge = {
        description: null,
        from: {
          node: this.startNode.id,
          nodeElement: this.startNode,
          port: this.edgePreviewType === 'outport' ? 'out' : 'in',
        },
        name: null,
        metadata: {
          description: null,
          name: null,
          route: '0',
          when: null,
        },
        to: {
          node: data.node.id,
          nodeElement: data.node,
          port: data.type === 'outport' ? 'out' : 'in',
        },
      };
      this.graph.lines.push(this.previewLine);
      this.graph.edges.push(edge);
    },
    cancelEdgeStart() {
      if (this.isEdgePreview) {
        this.isEdgePreview = false;
        this.state.highlightPort = {};
        this.edgePreviewType = '';
        this.previewLine = {};
      }
    },
    screenPosition2StagePosition({ x, y }) {
      const { scale } = this.state;
      const tx = (x - this.state.x) / scale;
      const ty = (y - this.state.y) / scale;
      return { x: tx, y: ty };
    },
    requestShowContextMenu(e) {
      console.log('showContext', e);
      // Don't show native context menu
      e.preventDefault();

      // Don't tap graph on hold event
      e.stopPropagation();
      if (e.preventTap) { e.preventTap(); }
      // Get mouse position
      if (e.gesture) {
        e = e.gesture.srcEvent; // unpack hammer.js gesture event
      }

      let x = e.x || e.clientX || 0;
      let y = e.y || e.clientY || 0;
      if (e.touches && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }

      // App.showContext

      this.doShowContextMenu({
        element: this,
        type: 'stage',
        x,
        y,
        item: {
          name: '流程图',
          component: {
            inports: [],
            outports: [],
          },
        },
      });
    },
    doShowContextMenu(data) {
      console.log('doShowContextMenu', data);
      const nodeType = data.type;
      this.menuContext = {
        ...this.menuContext,
        ...data,
        actions: this.actions[nodeType],
      };
      this.canShowMenu = true;
    },
    onMenuAction(action) {
      const { x, y, type } = this.menuContext;
      const { scale } = this.state;
      const tx = (x - this.state.x) / scale;
      const ty = (y - this.state.y) / scale;

      this.$emit('action', {
        ...action,
        context: {
          type, node: this.menuContext.item, x: tx, y: ty,
        },
      });
      this.canShowMenu = false;
    },
    emitUpdate() {
      const {
        x, y, scale, width, height,
      } = this.state;
      this.$emit('updateMap', {
        x, y, scale, windowWidth: width, windowHeight: height,
      });
    },
    updateNode(id, props) {
      // console.log('updateNode', id, props);
      const targetNode = this.graph.nodes.find(node => node.id === id);
      targetNode.metadata = { ...targetNode.metadata, ...props.metadata };
      this.updateGraph();
      this.emitUpdate();
    },
    updateGraph() {
      const lines = updateNode(this.graph, { nodeWidth: 72, nodeHeight: 72 });
      this.graph.lines = lines;
    },

    didMounted() {
      const domNode = this.$refs.svg;

      // Unselect edges and nodes
      if (this.config.onNodeSelection) {
        domNode.addEventListener('tap', this.unselectAll);
      }

      // Setup Hammer.js events for this and all children
      // The events are injected into the DOM to follow regular propagation rules
      const hammertime = new Hammer.Manager(domNode, {
        domEvents: true,
        inputClass: hammerhacks.Input,
        recognizers: [
          [Hammer.Tap, { }],
          [Hammer.Press, { time: 500 }],
          [Hammer.Pan, { direction: Hammer.DIRECTION_ALL, threshold: 5 }],
          [Hammer.Pinch, { }],
        ],
      });

      // Gesture event for pan
      domNode.addEventListener('panstart', this.onTrackStart);

      const isTouchDevice = 'ontouchstart' in document.documentElement;
      if (isTouchDevice && hammertime) {
        hammertime.on('pinchstart', this.onTransformStart);
        hammertime.on('pinch', this.onTransform);
        hammertime.on('pinchend', this.onTransformEnd);
      }

      // Wheel to zoom
      if ('onwheel' in domNode) {
        // Chrome and Firefox
        domNode.addEventListener('wheel', this.onWheel);
      } else if ('onmousewheel' in domNode) {
        // Safari
        domNode.addEventListener('mousewheel', this.onWheel);
      }

      // Tooltip listener
      domNode.addEventListener('the-graph-tooltip', this.changeTooltip);
      domNode.addEventListener('the-graph-tooltip-hide', this.hideTooltip);

      // Edge preview
      domNode.addEventListener('the-graph-edge-start', this.edgeStart);

      domNode.addEventListener('contextmenu', this.onShowContext);

      // Start zoom from middle if zoom before mouse move
      this.mouseX = Math.floor(this.config.width / 2);
      this.mouseY = Math.floor(this.config.height / 2);
    },

    onTransformEnd(event) {
      // Don't drag nodes
      event.srcEvent.stopPropagation();
      event.srcEvent.stopImmediatePropagation();

      // Hammer.js
      this.pinching = false;
    },
    onTrackStart(event) {
      const domNode = this.$refs.flowGraph;
      domNode.addEventListener('panmove', this.onTrack);
      domNode.addEventListener('panend', this.onTrackEnd);

      this.state = { ...this.state, trackStartX: this.state.x, trackStartY: this.state.y };
    },
    onTrack(event) {
      if (this.pinching) { return; }
      if (this.menuShown) { return; }
      this.state = {
        ...this.state,
        x: this.state.trackStartX + event.gesture.deltaX,
        y: this.state.trackStartY + event.gesture.deltaY,
      };
      this.emitUpdate();
    },
    onTrackEnd(event) {
      // Don't click app (unselect)
      event.stopPropagation();

      const domNode = this.$refs.flowGraph;
      domNode.removeEventListener('panmove', this.onTrack);
      domNode.removeEventListener('panend', this.onTrackEnd);

      this.state = { ...this.state, trackStartX: null, trackStartY: null };
    },
    onPanScale() {
      console.log('onPanScale');
      // Pass pan/scale out to the-graph
      if (this.config.onPanScale) {
        this.config.onPanScale(this.state.x, this.state.y, this.state.scale);
      }
    },


    onWheel(event) {
      // Don't bounce
      event.preventDefault();
      console.log('onWheel', event);

      if (!this.zoomFactor) { // WAT
        this.zoomFactor = 0;
      }

      // Safari is wheelDeltaY
      this.zoomFactor += event.deltaY ? event.deltaY : 0 - event.wheelDeltaY;
      this.zoomX = event.clientX;
      this.zoomY = event.clientY;
      requestAnimationFrame(this.scheduleWheelZoom);
    },
    scheduleWheelZoom() {
      if (Number.isNaN(this.zoomFactor)) { return; }

      // Speed limit
      let zoomFactor = this.zoomFactor / -500;
      zoomFactor = Math.min(0.5, Math.max(-0.5, zoomFactor));
      const oldScale = this.state.scale;
      let scale = oldScale + (oldScale * zoomFactor);
      this.zoomFactor = 0;

      if (scale < this.state.minZoom) {
        scale = this.state.minZoom;
      } else if (scale > this.state.maxZoom) {
        scale = this.state.maxZoom;
      }
      if (scale === oldScale) { return; }

      // Zoom and pan transform-origin equivalent
      const scaleD = scale / oldScale;
      const currentX = this.state.x;
      const currentY = this.state.y;
      const oX = this.zoomX;
      const oY = this.zoomY;
      const x = scaleD * (currentX - oX) + oX;
      const y = scaleD * (currentY - oY) + oY;

      this.state = {
        ...this.state,
        scale,
        x,
        y,
        tooltipVisible: false,
      };
      this.emitUpdate();
    },

    unselectAll(event) {
      // No arguments = clear selection
      this.config.onNodeSelection();
      this.config.onEdgeSelection();
    },

    renderCanvas() {
      // console.log('renderCanvas');
      const c = this.bgContext;
      // Comment this line to go plaid
      c.clearRect(0, 0, this.state.width, this.state.height);

      // Background grid pattern
      const scale = this.state.scale;
      const g = this.config.nodeSize * scale;

      const dx = this.state.x % g;
      const dy = this.state.y % g;
      const cols = Math.floor(this.state.width / g) + 1;
      let row = Math.floor(this.state.height / g) + 1;
      // Origin row/col index
      const oc = Math.floor(this.state.x / g) + (this.state.x < 0 ? 1 : 0);
      const or = Math.floor(this.state.y / g) + (this.state.y < 0 ? 1 : 0);

      while (row--) {
        let col = cols;
        while (col--) {
          const x = Math.round(col * g + dx);
          const y = Math.round(row * g + dy);
          if ((oc - col) % 3 === 0 && (or - row) % 3 === 0) {
            // 3x grid
            c.fillStyle = 'white';
            c.fillRect(x, y, 1, 1);
          } else if (scale > 0.5) {
            // 1x grid
            c.fillStyle = 'grey';
            c.fillRect(x, y, 1, 1);
          }
        }
      }
    },
  },
};
</script>

<style lang="less">
@import url('./style.less');

.color0{
      fill: rgba(191,191,191,0.15);
    stroke: none;
}
.group{
  .eventcatcher {
      fill: #fff;
      fill-opacity: 0.1;
  }
  .group-label {
      text-anchor: start;
      fill: #fff;
      font-size: 20px;
      transition-property: font-size;
      transition-duration: 0.5s;
  }
  .group-description {
      fill: #fff;
      font-size: 12px;
      text-anchor: start;
  }
  text {
      font-family: "SourceCodePro", "Source Code Pro", Helvetica, Arial, sans-serif;
      text-rendering: geometricPrecision;
      font-size: 14px;
      fill: #fff;
      text-anchor: middle;
      dominant-baseline: central;
  }
  .drag {
      cursor: pointer;
      cursor: grab;
  }
}
</style>
