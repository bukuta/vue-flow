<template>
  <g
    :title="inport.name"
    :transform="transform"
    class="port arrow"
    @click="(e) => $emit('click',e)"
  >
    <circle
      :r="radius"
      class="port-circle-bg" />
    <path
      :d="path"
      class="port-arc"
    />
    <circle
      :class="`route${node.metadata.route}`"
      :r="innerRadius"
      class="port-circle-small fill "/>
    <text
      y="6"
      class="port-label drag"
      style="font-size: 5.625px;">{{ inport.name }}</text>
  </g>
</template>

<script>

import ArcUtils from './arcs';

export default {
  name: 'Inport',
  props: {
    highlight: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      default() { return { metadata: {} }; },

    },
    inport: {
      type: Object,
      default() {
        return {
          metadata: {},
        };
      },
    },
    transform: {
      type: String,
      default: '',
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
        return 'M 8 0 A 8 8 0 0 0 -8 0';
      }
      return 'M 4 0 A 4 4 0 0 0 -4 0';
    },

  },


};
</script>

<style>

</style>
