<template>
  <div class="graphs">
    <h1>Bodyweight graphs</h1>
    <PlanetChart/>
    <img src="../assets/bw_years.png" height='500'>

  </div>
</template>

<script>
import PlanetChart from '@/components/BWeightChart.vue';

export default {
  name: 'dailyView',
  components: {
    PlanetChart,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
