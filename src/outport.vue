<template>
  <g
    :transform="transform"
    class="port arrow"
    @click="(e) => $emit('click',e)"
  >
    <circle
      :r="radius"
      class="port-circle-bg"/>
    <path
      :d="path"
      class="port-arc"
    />
    <circle
      :class="`route${node.metadata.route}`"
      :r="innerRadius"
      class="port-circle-small fill route9"/>
    <text
      y="-6"
      style="font-size: 5.625px;"
      class="port-label drag">{{ outport.name }}</text>
  </g>
</template>

<script>

import ArcUtils from './arcs';

export default {
  name: 'Outport',
  props: {
    highlight: {
      type: Boolean,
      default: false,
    },
    transform: {
      type: String,
      default: '',

    },
    node: {
      type: Object,
      default() {
        return {
          metadata: {},
        };
      },
    },
    outport: {
      type: Object,
      default() {
        return {};
      },
    },

  },
  computed: {
    radius() {
      return this.highlight ? 8 : 4;
    },
    innerRadius() {
      return this.highlight ? 6 : 2.5;
    },
    path() {
      if (this.highlight) {
        return 'M -8 0 A 8 8 0 0 0 8 0';
      }
      return 'M -4 0 A 4 4 0 0 0 4 0';
    },
  },
};
</script>

<style>

</style>
