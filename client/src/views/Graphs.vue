<template>
  <div id='graphs'  >
    <v-row>
      <v-col cols='2'></v-col>
      <v-col cols='8'>
        <ScatterChart v-bind='scatterChartProps' />
        <!-- <tr v-for='entry in converted_data' v-bind:key='entry'>
        <td >{{ entry.days_data[0][1].bodyweight}}</td>
      </tr> -->
      <h1 v-if="!this.loaded">Loading the Data....</h1>
      </v-col>
      <v-col cols='2'></v-col>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment';
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
      loaded: false,
    };
  },
  methods: {
    getDataNew() {
      this.getDataM().then((res) => {
        let xx = 0;
        const newData2 = [];
        this.converted_data = res.reverse();
        this.converted_data.forEach((element) => {
          xx += 1;
          console.log(xx);

          const tempDateStr = element.summary_data.startingDate[0].split(' ')[1];
          const tempDateObj = moment(tempDateStr, 'DD-MM-YY');
          // console.log(tempDateObj);
          // console.log(element.summary_data.startingDate[0]);
          newData2.push({ x: tempDateObj, y: element.summary_data.avgBW });
        });
        this.shuffleData(newData2);
        this.loaded = true;
        console.log(moment('01-01-18', 'DD-MM-YY'));
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
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (value) => `${(value.parsed.y).toFixed(2)}kg || ${moment.unix(value.parsed.x / 1000).format('DD MMM YYYY')}`,
          },
        },
      },
      showLine: true,
      tension: 1,
      aspectRatio: 1.5,
      spanGaps: true,
      responsive: true,
      cubicInterpolationMode: 'monotone',
      scales: {
        y: {
          type: 'linear',
          min: 72.5,
          max: 82.5,
          title: {
            display: true,
            text: 'Bodyweight (kg)',
            font: {
              size: 30,
              weight: 'bold',
            },
          },
          ticks: {
            stepSize: 0.5,
          },
          beginAtZero: false,
        },
        x: {
          type: 'linear',
          min: moment('01-01-18', 'DD-MM-YY').unix() * 1000,
          max: moment('31-12-21', 'DD-MM-YY').unix() * 1000,
          display: true,
          title: {
            display: true,
            text: 'Date',
            font: {
              size: 30,
              weight: 'bold',
            },
          },
          ticks: {
            count: 30,
            callback: (value) => moment.unix(value / 1000).format('MMM YY'),
          },
          scaleLabel: {
            display: true,
            labelString: 'Date',
          },
        },
      },
    }));

    function shuffleData(newData) {
      data.value = newData;
    }

    const chartData = computed(() => ({
      datasets: [
        {
          data: data.value,
          backgroundColor: ['#123E6B'],
        },
      ],
    }));

    const { scatterChartProps, scatterChartRef } = useScatterChart({
      chartData,
      options,
    });

    return {
      shuffleData,
      scatterChartProps,
      scatterChartRef,
      imgData,
    };
  },
});
</script>
