<template>
  <g
    :title="title"
    class="edge">
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
  methods: {},
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
