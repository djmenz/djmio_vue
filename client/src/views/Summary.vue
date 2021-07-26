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

export default {
  name: 'summaryView',
  data() {
    return {
      raw_data: [],
      converted_data: [],
    };
  },
  methods: {
    getMessage() {
      const path = 'http://djm.io/api';
      // const path = ('http://localhost:5000/daily_mem/' + this.date);
      axios.get(path)
        .then((res) => {
          // console.log(res);
          this.raw_data = res.data;
          this.convert_data();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    convert_data() {
      this.converted_data = [];
      let tempWeek = {
        days_data: [],
        summary_data: {},
      };
      Object.entries(this.raw_data).forEach((e) => {
        const date = e[0];
        // const data = e[1];
        const dateob = moment(date, 'YYYYMMDD');
        e[0] = moment(date).format('ddd DD-MM-YY');
        tempWeek.days_data.push(e);
        // console.log(dateob.weekday());
        if (dateob.weekday() === 0) {
          // console.log('NEW WEEK');
          tempWeek.days_data.reverse();
          tempWeek.summary_data = this.generateAverages(tempWeek.days_data);
          this.converted_data.push(tempWeek);
          tempWeek = {
            days_data: [],
            summary_data: {},
          };
        }
      });
      if (tempWeek.days_data.length > 0) {
        tempWeek.days_data.reverse();
        tempWeek.summary_data = this.generateAverages(tempWeek.days_data);
        this.converted_data.push(tempWeek);
      }
      this.converted_data.reverse();
    },
    ordToDate(ordinalDate) {
      return ordinalDate;
    },
    minuteDisplay(minsTotal) {
      const hours = Math.floor(minsTotal / 60);
      let minutes = minsTotal % 60;
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      return `${hours}:${minutes}`;
    },
    generateAverages(weeksData) {
      // console.log(weeksData);
      const returnData = {
        startingDate: '',
        avgBW: 0,
        avgBWCount: 0,
        avgCals: 0,
        avgCalsCount: 0,
        avgSteps: 0,
        liftingTime: '',
        liftingCount: 0,
        stravaRun: 0,
        stravaRide: 0,
      };
      const dataCounts = {
        bw: 0,
        bwTotal: 0,
        cals: 0,
        calsTotal: 0,
        steps: 0,
        stepTotal: 0,
        lifts: 0,
        liftTotal: 0,
      };
      weeksData.forEach((element) => {
        if (element[1].steps > 200) {
          dataCounts.stepTotal += parseInt(element[1].steps, 10);
          dataCounts.steps += 1;
        }
        if (element[1].bodyweight > 0) {
          dataCounts.bwTotal += parseFloat(element[1].bodyweight, 10);
          dataCounts.bw += 1;
        }
        if (element[1].calories > 0) {
          dataCounts.calsTotal += parseFloat(element[1].calories, 10);
          dataCounts.cals += 1;
        }
        if (element[1].lifting_sessions.length > 0) {
          const sessions = element[1].lifting_sessions;
          sessions.forEach((sess) => {
            dataCounts.liftTotal += sess.lifting_duration;
          });
          dataCounts.lifts += element[1].lifting_sessions.length;
        }
        if (element[1].strava_activities.length > 0) {
          const sessions = element[1].strava_activities;
          sessions.forEach((sess) => {
            if (sess.strava_type === 'Run') {
              returnData.stravaRun += sess.strava_distance;
            } else {
              returnData.stravaRide += sess.strava_distance;
            }
          });
        }
      });
      returnData.startingDate = weeksData[0];
      returnData.avgSteps = dataCounts.stepTotal / dataCounts.steps;
      returnData.avgBW = dataCounts.bwTotal / dataCounts.bw;
      returnData.avgBWCount = dataCounts.bw;
      returnData.avgCals = (dataCounts.cals !== 0) ? dataCounts.calsTotal / dataCounts.cals : 0;
      returnData.avgCalsCount = dataCounts.cals;
      returnData.liftingCount = dataCounts.lifts;
      returnData.liftingTime = this.minuteDisplay(dataCounts.liftTotal);
      return returnData;
    },
  },
  created() {
    this.todays_date = moment().format('DD-MM-YYYY');
    this.date = this.todays_date;
    this.getMessage();
  },
};
</script>
