<template>
  <v-container fluid>
    <v-row>
      <h1 v-if="!this.loaded">Loading the Daily Data....</h1>
      <v-col cols="1"> </v-col>
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
                <tr>
                  <td>
                    <b> {{ currentStravaDialog.strava_type }}</b> <br />
                    {{
                      (currentStravaDialog.strava_distance / 1000).toFixed(2)
                    }}
                    km
                  </td>
                </tr>
                <tr v-if="currentStravaDialog.strava_type === 'Run'">
                  <td>
                    {{
                      this.hourMinuteDisplay(currentStravaDialog.strava_time)
                    }}
                    Elapsed Time<br />
                    {{
                      this.stravaRunPaceCalc(
                        currentStravaDialog.strava_time,
                        currentStravaDialog.strava_distance
                      )
                    }}
                    mins per km pace
                  </td>
                </tr>

                <tr v-if="currentStravaDialog.strava_type === 'Ride'">
                  <td>
                    {{
                      this.hourMinuteDisplay(
                        currentStravaDialog.strava_moving_time
                      )
                    }}
                    Moving Time<br />
                    {{
                      this.stravaRidePaceCalc(
                        currentStravaDialog.strava_moving_time,
                        currentStravaDialog.strava_distance
                      )
                    }}
                    km/hr pace
                  </td>
                </tr>
                <tr v-if="currentStravaDialog.strava_raw">
                  <td>
                    <a
                      :href="strava_url_link(currentStravaDialog.strava_raw.id)"
                    >
                      {{
                        this.strava_url_link(currentStravaDialog.strava_raw.id)
                      }}
                    </a>
                  </td>
                </tr>
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
      <v-col cols="1"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Week from '@/components/Week.vue';
import axios from 'axios';
import moment from 'moment';
import helpers from '../mixins/gendata';
import config from '../config';

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
      loaded: false,
    };
  },
  mixins: [helpers],
  methods: {
    // get this working
    getDataNew() {
      this.getDataM()
        .then((res) => {
          this.converted_data = res;
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
          console.error(error);
        });
    },
    ordToDate(ordinalDate) {
      return ordinalDate;
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
      const pace = secondsTotal / 60 / (distanceM / 1000);
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
      const pace = distanceM / 1000 / (secondsTotal / 3600);
      return pace.toFixed(2);
      // return (secondsTotal / 60) / (distanceM / 1000);
    },
    strava_url_link(stravaEventId) {
      return `https://www.strava.com/activities/${stravaEventId}`;
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
    this.getData();
  },
};
</script>
