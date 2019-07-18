<template>
  <g
    :name="node.name"
    :title="node.metadata.label"
    :transform="nodeTransform"
    class="node drag"
    @panstart="onPanStart"
    @panmove="onPanMove"
    @panend="onPanEnd"
    @pancancel="onPanCancel"
    @contextmenu="requestShowContextMenu"
    @press="requestShowContextMenu"
  >
    <rect
      width="72"
      height="97"
      class="node-bg"/>
    <rect
      width="72"
      height="72"
      class="node-border drag"
      rx="8"
      ry="8"/>
    <rect
      width="66"
      height="66"
      class="node-rect drag"
      x="3"
      y="3"
      rx="6"
      ry="6"/>
    <text
      x="36"
      y="36"
      class="icon node-icon drag">{{ fontIcon }}</text>
    <g class="inports">
      <!-- v-for -->
      <vue-graph-inport
        v-for="(inport,index) of inports"
        :key="inport.name"
        :node="node"
        :highlight="highlightPort && highlightPort.isIn"
        :transform="inportPosition(inport,index)"
        @click="(e) => edgeStart(e, 'inport')"
      />
    </g>
    <g class="outports">
      <!-- v-for  -->
      <vue-graph-outport
        v-for="(outport,index) of outports"
        :title="outport.naame"
        :key="outport.name"
        :node="node"
        :highlight="highlightPort && highlightPort.isIn==false"
        :transform="outportPosition(outport,index)"
        @click="(e) => edgeStart(e, 'outport')"
      />

    </g>
    <g class="node-label-bg">
      <rect
        class="text-bg-rect"
        height="15.400000000000002"
        width="84"
        rx="7"
        ry="7"
        x="-6"
        y="80"
      />
      <text
        x="36"
        y="87"
        class="node-label">{{ node.metadata.label }}</text>
    </g>
    <g class="node-sublabel-bg">
      <rect
        class="text-bg-rect"
        height="9.9"
        width="138"
        rx="4.5"
        ry="4.5"
        x="-33"
        y="97.5"/>
      <text
        x="36"
        y="102"
        class="node-sublabel">{{ node.component.name }}</text>
    </g>
    <circle
      v-if="moving"
      :r="eventCatcherRadius"
      class="eventcatcher"/>
  </g>
</template>

<script>
import FontAwesomeSVG from './font-awesome-unicode-map';
import VueGraphInport from './inport.vue';
import VueGraphOutport from './outport.vue';

let index = 0;

export default {
  name: 'VueGraphNode',
  components: {
    VueGraphInport,
    VueGraphOutport,
  },
  props: {
    highlightPort: {
      type: Object,
      default() {
        return {};
      },
    },

    library: {
      type: Object,
      default() {
        return {};
      },

    },
    scale: {
      type: Number,
      default: 1,
    },
    node: {
      type: Object,
      default() {
        return {
          name: 'dom/GetElement_123',
          compoent: 'dom/GetElement',
          metadata: {
            x: 324,
            y: 144,
            label: 'startButton',
          },
        };
      },
    },
  },

  data() {
    return {
      moving: false,
      state: {
        lastTrackX: 0,
        lastTrackY: 0,
      },
    };
  },

  computed: {
    eventCatcherRadius() {
      console.log(this.node.metadata.width, this.scale);
      return this.node.metadata.width * 12 / this.scale;
    },
    nodeTransform() {
      const { x, y } = this.node.metadata;
      return `translate(${x},${y})`;
    },

    fontIconKey() {
      let key = '';
      if (this.libraryComponent && this.libraryComponent.icon) {
        key = this.libraryComponent.icon;
      } else {
        const keys = Object.keys(FontAwesomeSVG);
        // const key = keys[Date.now() % keys.length];
        key = keys[index++ % keys.length];
      }
      return key;
    },

    fontIcon() {
      if (this.libraryComponent && this.libraryComponent.icon) {
        const key = this.libraryComponent.icon;
        return FontAwesomeSVG[key];
      }
      const keys = Object.keys(FontAwesomeSVG);
      // const key = keys[Date.now() % keys.length];
      const key = keys[index++ % keys.length];
      return FontAwesomeSVG[key];
    },
    libraryComponent() {
      const r = this.node.component;
      return r;
    },
    inports() {
      return (this.libraryComponent && this.libraryComponent.inports) || [];
    },
    outports() {
      return (this.libraryComponent && this.libraryComponent.outports) || [];
    },
  },
  watch: {
    'rootState.currentMovingNode': function watchCurrentMovingNode() {
      if (this.rootState.currentMovingNode !== this.node.id) {
        console.log('currentMovingNode', this.rootState.currentMovingNode, this.node.id);
        this.moving = false;
      }
    },
  },
  inject: {
    rootState: {
      from: 'rootState',
      default() { return {}; },
    },
    rootUpdateNode: {
      from: 'rootUpdateNode',
      default() {
        return function defaultRootUpdateNode(id, props) {
          console.log('defaultRootUpdateNode,', id, props);
        };
      },
    },

  },

  mounted() {},
  methods: {
    edgeStart(e, type) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      let x = e.x || e.clientX || 0;
      let y = e.y || e.clientY || 0;
      if (e.touches && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }

      this.$emit('edge-start', {
        x,
        y,
        type,
        node: this.node,
      });
    },
    requestShowContextMenu(e) {
      console.log('requestShowContextMenu', e);
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

      this.$emit('context-menu', {
        element: this,
        type: 'node',
        x,
        y,
        item: this.node,
      });
    },

    inportPosition(inport, index) {
      const inports = this.inports;
      const position = inport.position || 'left';
      if (position === 'left') {
        return `translate(0,${36 + (2 * index - inports.length + 1) * 5})`;
      } if (position === 'top') {
        return `translate(${36 + (2 * index - inports.length + 1) * 5},0)`;
      }
      return '';
    },

    outportPosition(outport, index) {
      const outports = this.outports;
      const position = outport.position || 'left';
      if (position === 'right') {
        return `translate(72,${36 + (2 * index - outports.length + 1) * 5})`;
      } if (position === 'bottom') {
        return `translate(${36 + (2 * index - outports.length + 1) * 5},72)`;
      }
      return '';
    },

    onPanStart(e) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      this.moving = true;
      this.rootState.currentMovingNode = this.node.id;
      console.log('onPanStart', e);
    },

    onPanMove(e) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      const x = e.gesture.deltaX;
      const y = e.gesture.deltaY;
      const { lastTrackX, lastTrackY } = this.state;
      const movementX = x - this.state.lastTrackX;
      const movementY = y - this.state.lastTrackY;
      this.state = { ...this.state, lastTrackX: x, lastTrackY: y };

      const scale = this.scale;
      const deltaX = Math.round(movementX / scale);
      const deltaY = Math.round(movementY / scale);
      console.log('onPanMove', x, y, ',lasatTrack:', lastTrackX, lastTrackY, ',movement:', movementX, movementY, ',scale:', scale, ',del:', movementX / scale, movementY / scale, ', delta:', deltaX, deltaY);
      this.rootUpdateNode(this.node.id, { metadata: { x: this.node.metadata.x + deltaX, y: this.node.metadata.y + deltaY } });
    },
    onPanEnd(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      this.moving = false;
      this.state = { ...this.state, lastTrackX: 0, lastTrackY: 0 };
      console.log('onPanEnd', e);
    },
    onPanCancel(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      console.log('onPanCancel', e);
    },

  },
};
</script>

<style lang="less">
.node {
  text {
    font-family: "SourceCodePro", "Source Code Pro", Helvetica, Arial,
      sans-serif;
    text-rendering: geometricPrecision;
    font-size: 14px;
    fill: #fff;
    text-anchor: middle;
    dominant-baseline: central;
  }
  &:hover{
    .node-border {
      stroke: #808080;
    }
    .node-rect {
      fill: rgba(230,238,240,0.97);
    }
    .port-arc {
        fill: #808080;
    }
  }
  .node-bg {
    opacity: 0;
  }
  .node-border {
    fill: rgba(0, 0, 0, 0.5);
    stroke: #666;
    stroke-width: 2px;
  }
  .node-rect {
    fill: rgba(230, 238, 240, 0.94);
    stroke: none;
  }
  .node-icon {
    font-size: 45px;
    fill: #5e6a6e;
    transition-property: font-size, fill;
    transition-duration: 0.5s, 0.3s;
  }
  .icon {
    font-family: "FontAwesomeSVG";
    text-anchor: middle;
    dominant-baseline: central;
  }
  .text-bg-rect {
    fill: rgba(0, 0, 0, 0.5);
  }
  .node-label,
  .node-sublabel {
    text-anchor: middle;
  }
  .port-circle-bg {
    fill: #666;
    opacity: 0;
  }
  .port-arc {
    fill: #666;
  }
  .fill {
    fill: #fff;
  }
  .inports {
    .port-label {
      text-anchor: start;
      text-anchor: middle;
    }
  }
  .outports .port-label {
    text-anchor: middle;
  }
  .port-label {
    fill: #0c0d0e;
    visibility: hidden;
    font-size: 6px;
    dominant-baseline: central;
  }
  .node-sublabel-bg {
    visibility: hidden;
  }
  .node-sublabel {
    font-size: 9px;
  }
  .eventcatcher {
    fill: #fff;
    fill-opacity: 0.1;
  }
}
.big {
  .node {
    .node-icon {
      fill: #c8ced0;
    }
    .port-label {
      visibility: visible;
    }
    .node-sublabel-bg {
      visibility: visible;
    }
  }
}
.small {
  .node-label-bg {
    visibility: hidden;
  }
  .node-sublabel-bg {
    visibility: hidden;
  }
  .node-icon {
    fill: #2f3537;
    font-size: 56px;
  }
}
</style>
