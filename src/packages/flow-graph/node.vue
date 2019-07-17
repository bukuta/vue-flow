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
      <g
        v-for="(inport,index) of inports"
        :key="inport.name"
        :data-index="index"
        :title="inport.name"
        :transform="inportPosition(inport,index)"
        class="port arrow">
        <circle
          r="5"
          class="port-circle-bg" />
        <path
          d="M 4 0 A 4 4 0 0 0 -4 0"
          class="port-arc"
        />
        <circle
          :class="`route${node.metadata.route}`"
          class="port-circle-small fill "
          r="2.5"/>
        <text
          y="6"
          class="port-label drag"
          style="font-size: 5.625px;">{{ inport.name }}</text>
      </g>
    </g>
    <g class="outports">
      <!-- v-for  -->
      <g
        v-for="(outport,index) of outports"
        :title="outport.naame"
        :key="outport.name"
        :transform="outportPosition(outport,index)"
        class="port arrow"
        @click="(e) => edgeStart(e, outport)">
        <circle
          r="5"
          class="port-circle-bg"/>
        <path
          d="M -4 0 A 4 4 0 0 0 4 0"
          class="port-arc"
        />
        <circle
          :class="`route${node.metadata.route}`"
          class="port-circle-small fill route9"
          r="2.5"/>
        <text
          y="-6"
          style="font-size: 5.625px;"
          class="port-label drag">{{ outport.name }}</text>
      </g>
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

let index = 0;

export default {
  name: 'VueGraphNode',
  props: {
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
    edgeStart(e, outport) {
      const edgeStartEvent = new CustomEvent('the-graph-edge-start', {
        detail: {
          isIn: false,
          port: { port: 'element', process: this.node.id, type: 'all' },
          // process: outport.processKey,
          route: this.node.metadata.route || '10',
        },
        bubbles: true,
      });
      this.test(e.currentTarget, edgeStartEvent);
    },
    test(e, event) {
      // Forwarded from App.edgeStart()

      // Port that triggered this
      const port = event.detail.port;

      // Complete edge if this is the second tap and ports are compatible
      if (this.state.edgePreview && this.state.edgePreview.isIn !== event.detail.isIn) {
        // TODO also check compatible types
        const halfEdge = this.state.edgePreview;
        if (event.detail.isIn) {
          halfEdge.to = port;
        } else {
          halfEdge.from = port;
        }
        this.addEdge(halfEdge);
        this.cancelPreviewEdge();
        return;
      }

      let edge;
      if (event.detail.isIn) {
        edge = { to: port };
      } else {
        edge = { from: port };
      }
      edge.isIn = event.detail.isIn;
      edge.metadata = { route: event.detail.route };
      edge.type = event.detail.port.type;


      // const appDomNode = ReactDOM.findDOMNode(this.props.app);
      e.addEventListener('mousemove', this.renderPreviewEdge());
      e.addEventListener('panmove', this.renderPreviewEdge());
      // TODO tap to add new node here
      e.addEventListener('tap', this.cancelPreviewEdge(e));
    },
    cancelPreviewEdge(e) {
      e.removeEventListener('mousemove', this.renderPreviewEdge);
      e.removeEventListener('panmove', this.renderPreviewEdge);
      e.removeEventListener('tap', this.cancelPreviewEdge);
      // if (this.state.edgePreview) {
      //   this.setState({edgePreview: null});
      //   this.markDirty();
      // }
    },
    renderPreviewEdge() {
      console.log(this.node);
      if (this.node && this.node.gesture) {
        this.node = this.node.gesture.srcEvent; // unpack hammer.js gesture this.node
      }

      let x = this.node.metadata.x || this.node.metadata.clientX || 0;
      let y = this.node.metadata.y || this.node.metadata.clientY || 0;
      if (this.node.touches && this.node.touches.length) {
        x = this.node.touches[0].clientX;
        y = this.node.touches[0].clientY;
      }

      // x -= this.props.app.state.offsetX || 0;
      // y -= this.props.app.state.offsetY || 0;
      // const scale = this.props.app.state.scale;
      // this.setState({
      //   edgePreviewX: (x - this.props.app.state.x) / scale,
      //   edgePreviewY: (y - this.props.app.state.y) / scale,
      // });
      this.markDirty();
    },
    markDirty(event) {
      // if (event && event.libraryDirty) {
      //   this.libraryDirty = true;
      // }
      window.requestAnimationFrame(this.triggerRender);
    },
    triggerRender (time) {
      if (!this.mounted) {
        return;
      }
      if (this.dirty) {
        return;
      }
      this.dirty = true;
      this.forceUpdate();
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
