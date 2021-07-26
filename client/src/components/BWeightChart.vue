<template>
  <div>
    <canvas id="planet-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import planetChartData1 from '../planet-data';

export default {
  name: 'PlanetChart',
  data() {
    return {
      planetChartData1,
    };
  },
  mounted() {
    const ctx = document.getElementById('planet-chart');
    const chart = new Chart(ctx, this.planetChartData);
    console.log(chart);
  },
};
</script>
