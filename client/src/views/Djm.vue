<template>
<v-container fluid>
    <v-row>
      <v-col cols="1" >
      </v-col>
    <v-col justify="center">

    <week
      v-for="week in converted_data"
      v-bind:key="week.date"
      v-bind:week_data="week"
      v-on:show-exercise="showExerciseSession"
    ></week>

    <v-dialog v-model="liftDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ currentLiftDialog.lifting_date }}
        </v-card-title>
        <v-card-text> </v-card-text>
        <ul
          v-for="exercise in currentLiftDialog.lifting_exercises"
          v-bind:key="exercise"
        >
          <b>{{ exercise.name }}</b>
          <ul v-for="sets in exercise.sets" v-bind:key="sets">
            {{
              sets.reps
            }}
            x
            {{
              sets.weight
            }}
            kg
          </ul>
        </ul>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          {{ currentLiftDialog.lifting_description }}
          <v-spacer></v-spacer>
          <v-btn color="red" text class="mr-2" @click="liftDialog = false">
            X
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="stravaDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ currentStravaDialog.strava_description }}
        </v-card-title>
        <v-card-text> </v-card-text>

        <v-card-actions>

          <v-simple-table>
          <tr><td><b> {{ currentStravaDialog.strava_type }}</b> <br> {{ (currentStravaDialog.strava_distance /1000).toFixed(2)}} km</td></tr>
          <tr v-if="currentStravaDialog.strava_type==='Run'"><td>{{ this.hourMinuteDisplay(currentStravaDialog.strava_time)}}
             Elapsed Time<br>
            {{this.stravaRunPaceCalc(currentStravaDialog.strava_time, currentStravaDialog.strava_distance)}} mins per km pace</td></tr>

          <tr v-if="currentStravaDialog.strava_type==='Ride'"><td>{{ this.hourMinuteDisplay(currentStravaDialog.strava_moving_time)}}
             Moving Time<br>
             {{this.stravaRidePaceCalc(currentStravaDialog.strava_moving_time, currentStravaDialog.strava_distance)}} km/hr pace</td></tr>
          <tr  v-if="currentStravaDialog.strava_raw"><td><a :href=strava_url_link(currentStravaDialog.strava_raw.id)>
            {{ this.strava_url_link(currentStravaDialog.strava_raw.id) }}
            </a></td></tr>
          </v-simple-table>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <tr v-for="value in converted_data" v-bind:key="value" align=left>
       <ul v-for="entry in value" v-bind:key="entry" align=left>
       <li> {{entry}} </li>
       <p v-if="entry.summary==='End of week'">END OF WEEK</p>

       </ul>
     </tr> -->

    <div class="container"></div>
       </v-col>
        <v-col cols="1" >
      </v-col>
    </v-row>
 </v-container>

</template>

<script>
import Week from '@/components/Week.vue';
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'dailyView',
  components: {
    Week,
  },
  data() {
    return {
      todays_date: '',
      raw_data: '',
      converted_data: '',
      date: '01-06-2020',
      averages: { steps: 0, bodyweight: 0, calories: 0 },
      currentWeek: true,
      liftDialog: false,
      stravaDialog: false,
      currentLiftDialog: '',
      currentStravaDialog: '',
    };
  },
  methods: {
    getMessage() {
      const path = 'http://djm.io/api';
      // const path = ('http://localhost:5000/daily_mem/' + this.date);
      axios
        .get(path)
        .then((res) => {
          // console.log(res);
          this.raw_data = res.data;
          this.convert_data();
          // const reduceSteps = (ac, cv) => ac + parseInt(cv.steps, 10);
          // const reduceBodyweight = (ac, cv) => ac + cv.bodyweight;
          // const reduceCalories = (ac, cv) => ac + cv.calories;
          // const reduceBodyweight = (accumulator, currentValue) => accumulator + currentValue.bodyweight;
          // this.averages.steps = Math.trunc(this.msg.reduce(reduceSteps, 0) / this.dataCounts.steps);
          // this.averages.bodyweight = Math.trunc(this.msg.reduce(reduceBodyweight, 0) / this.dataCounts.bodyweight);
          //  this.averages.calories = Math.trunc(this.msg.reduce(reduceCalories, 0) / this.dataCounts.calories);
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
    hourMinuteDisplay(secondsTotal) {
      const wholeHours = Math.floor(secondsTotal / 3600);
      let minutesRem = Math.floor(Math.floor(secondsTotal % 3600) / 60);
      let secondsRem = secondsTotal % 60;
      if (minutesRem < 10) {
        minutesRem = `0${minutesRem}`;
      }
      if (secondsRem < 10) {
        secondsRem = `0${secondsRem}`;
      }
      return `${wholeHours}:${minutesRem}:${secondsRem}`;
    },
    stravaRunPaceCalc(secondsTotal, distanceM) {
      const pace = (secondsTotal / 60) / (distanceM / 1000);
      const paceMin = parseInt(pace, 0);
      let paceSec = ((pace % 1) * 60).toFixed(0);
      if (paceSec < 10) {
        paceSec = `0${paceSec}`;
      }

      return `${paceMin}:${paceSec}`;
      // return (secondsTotal / 60) / (distanceM / 1000);
    },
    stravaRidePaceCalc(secondsTotal, distanceM) {
    // pace_details = "{:.2f}".format(((strava_activity['strava_distance']/1000) / (strava_activity['strava_moving_time']/3600))) + " km/hr"
      const pace = (distanceM / 1000) / (secondsTotal / 3600);
      return pace.toFixed(2);
      // return (secondsTotal / 60) / (distanceM / 1000);
    },
    strava_url_link(stravaEventId) {
      return `https://www.strava.com/activities/${stravaEventId}`;
    },
    generateAverages(weeksData) {
      // console.log(weeksData);
      const returnData = {
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
      returnData.avgSteps = dataCounts.stepTotal / dataCounts.steps;
      returnData.avgBW = dataCounts.bwTotal / dataCounts.bw;
      returnData.avgBWCount = dataCounts.bw;
      returnData.avgCals = (dataCounts.cals !== 0) ? dataCounts.calsTotal / dataCounts.cals : 0;
      returnData.avgCalsCount = dataCounts.cals;
      returnData.liftingCount = dataCounts.lifts;
      returnData.liftingTime = this.minuteDisplay(dataCounts.liftTotal);
      return returnData;
    },
    showExerciseSession(exerciseDetails) {
      // console.log(exerciseDetails);
      if (exerciseDetails.lifting_date) {
        this.currentLiftDialog = exerciseDetails;
        this.liftDialog = true;
      } else {
        this.currentStravaDialog = exerciseDetails;
        this.stravaDialog = true;
      }
      // this.$alert(JSON.stringify(liftDetails));
    },
  },
  computed: {
    // a computed getter
    reversedMessage() {
      // `this` points to the vm instance
      return this.msg.split('').reverse().join('');
    },
    dataCounts() {
      const counts = { steps: 0, bodyweight: 0, calories: 0 };
      this.msg.forEach((element) => {
        if (element.steps > 0) {
          counts.steps += 1;
        }
        if (element.bodyweight > 0) {
          counts.bodyweight += 1;
        }
        if (element.calories > 0) {
          counts.calories += 1;
        }
      });
      console.log(counts);
      return counts;
    },
  },
  created() {
    this.todays_date = moment().format('DD-MM-YYYY');
    console.log();
    this.date = moment()
      .add(1 - moment().isoWeekday(), 'days')
      .format('DD-MM-YYYY');
    this.getMessage();
  },
};
</script>
