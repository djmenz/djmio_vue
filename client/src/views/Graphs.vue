<template>
  <div id="graphs">
    <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8">
    <ScatterChart v-bind="scatterChartProps" />
     <!-- <tr v-for="entry in converted_data" v-bind:key="entry">
        <td >{{ entry.days_data[0][1].bodyweight}}</td>
      </tr> -->
     </v-col>

     <v-col cols="2"></v-col>
    </v-row>
  </div>
</template>

<script>
import { ScatterChart, useScatterChart } from 'vue-chart-3';
import { ref, computed, defineComponent } from '@vue/composition-api';
import { Chart, registerables } from 'chart.js';
import helpers from '../mixins/gendata';

Chart.register(...registerables);

export default defineComponent({
  name: 'graphsView',
  components: {
    ScatterChart,
  },
  mixins: [helpers],
  data() {
    return {
      converted_data: '',
      scatter_data: [],
    };
  },
  methods: {
    getDataNew() {
      this.getDataM()
        .then((res) => {
          let xx = 0;
          const newData2 = [];
          this.converted_data = res.reverse();
          this.converted_data.forEach((element) => {
            xx += 1;
            newData2.push({ x: xx, y: element.summary_data.avgBW });
          });
          this.shuffleData(newData2);
          console.log(newData2);
          this.loaded = true;
        });
    },
  },
  created() {
    this.getDataNew();
  },
  setup() {
    const data = ref([]);
    // const legendTop = ref(true);
    const imgData = ref(null);

    const options = computed(() => ({
      scales: {
        y: {
          min: 70,
          max: 85,
          beginAtZero: false,
        },
      },
    }));

    function shuffleData(newData) {
      data.value = newData;
    }

    const chartData = computed(() => ({
      labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre', 'test'],
      datasets: [
        {
          data: data.value,
          backgroundColor: [
            '#77CEFF',
            '#0079AF',
            '#123E6B',
            '#97B0C4',
            '#A5C8ED',
          ],
        },
      ],
    }));

    const { scatterChartProps, scatterChartRef } = useScatterChart({
      chartData,
      options,
    });

    return {
      shuffleData, scatterChartProps, scatterChartRef, imgData,
    };
  },
});
</script>
