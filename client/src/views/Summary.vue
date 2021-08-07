<template>
  <div class="summary">
    <div class="container">
    <table class="table table-hover">
      <thead><th scope="col">Summary view of data</th>
      </thead>
      <tbody>

 <v-simple-table>
              <thead>
            <tr>
              <th scope="col" width='120'>Week ending</th>
              <th scope="col">BW (kg)</th>
              <th scope="col">Cals</th>
              <th scope="col">Steps</th>
              <th scope="col">Lifting</th>
              <th scope="col">Running</th>
              <th scope="col">Riding</th>
            </tr>
          </thead>
          <tbody>
    <h1 v-if="!this.loaded">Loading Summary Data....</h1>
    <tr v-for="entry in converted_data" v-bind:key="entry">
      <td>{{ entry.summary_data.startingDate[0] }}</td>
      <td>{{ entry.summary_data.avgBW.toFixed(2) }} - ({{ entry.summary_data.avgBWCount }}/7)</td>
      <td>{{ entry.summary_data.avgCals.toFixed(0) }} - ({{ entry.summary_data.avgCalsCount }}/7)</td>
      <td>{{ entry.summary_data.avgSteps.toFixed(0) }}</td>
      <td>{{ entry.summary_data.liftingCount }} Sessions | Total Time: {{ entry.summary_data.liftingTime }}</td>
      <td><p v-if="entry.summary_data.stravaRun > 0">Run: {{ (entry.summary_data.stravaRun/1000).toFixed(2) }}km</p></td>
      <td><p  v-if="entry.summary_data.stravaRide">Ride:{{ (entry.summary_data.stravaRide/1000).toFixed(2) }}km</p></td>
      </tr>
    </tbody>
     </v-simple-table>


     <!-- <tr v-for="message in converted_data" v-bind:key="message" align=left>
         <td> {{ message.summary_data }} </td>
     </tr> -->
  </tbody>
 </table>
</div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import helpers from '../mixins/gendata';
import config from '../config';

export default {
  name: 'summaryView',
  data() {
    return {
      raw_data: [],
      converted_data: [],
      loaded: false,
    };
  },
  mixins: [helpers],
  methods: {
    getDataNew() {
      this.getDataM()
        .then((res) => {
          this.converted_data = res;
          this.loaded = true;
        });
    },
    getData() {
      const path = config.apiUrl;
      axios.get(path)
        .then((res) => {
          // console.log(res);
          this.raw_data = res.data;
          this.converted_data = this.convertDataM(this.raw_data);
          this.loaded = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    ordToDate(ordinalDate) {
      return ordinalDate;
    },
  },
  created() {
    this.todays_date = moment().format('DD-MM-YYYY');
    this.date = this.todays_date;
    this.getDataNew();
  },
};
</script>
