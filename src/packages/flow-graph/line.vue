<template>
  <g
    :title="title"
    class="edge"
    @contextmenu="requestShowContextMenu"
    @press="requestShowContextMenu"
  >
    <path
      :d="path"
      class="edge-bg"/>
    <polygon
      :points="points"
      class="arrow-bg"
    />
    <path
      :d="path"
      :class="`route${line.metadata.route}`"
      class="edge-fg stroke"/>
    <path
      d="M 72 180 C 450 180 450 662.4 828 662.4"
      class="edge-touch"/>
    <polygon
      :points="points"
      :class="`route${line.metadata.route}`"
      class="arrow fill route2"
    />
  </g>
</template>

<script>
export default {
  name: 'VueGraphLine',
  props: {
    line: {
      type: Object,
      default() {
        return {
          src: {},
          tgt: {},
          metadata: {},
          data: {},
          path: '',
          points: '',
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    points() {
      return this.line.points;
      // return '450.5487755999688,413.1465010497996 442.04860179758754,419.8088613919989 453.7013113012219,425.92231877910075';
    },
    path() {
      return this.line.path;
      // return 'M 72 180 C 450 180 450 662.4 828 662.4';
    },
    title() {
      return 'title';
    },
  },
  mounted() {},
  methods: {
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
        type: 'line',
        x,
        y,
        item: {
          ...this.line,
          component: {
            inports: [], outports: [],
          },
        },
      });
    },
  },
};
</script>

<style lang="less">
.edge {
  path {
    fill: none;
  }
  .arrow-bg {
    stroke: #000;
    stroke-width: 2px;
  }
  .edge-touch {
    stroke-width: 7px;
    opacity: 0;
  }
  .fill.route0 {
    fill: #fff;
  }
  .edge-bg {
    stroke: #000;
    stroke-width: 5px;
  }
  &:hover{
    .edge-front, .stroke{
      stroke: #00ff00;
    }
    .edge-bg,.arrow-bg{
        stroke: #808080;
        stroke: #ff0000;
    }
  }
}
</style>
