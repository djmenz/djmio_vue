// define a mixin object

// eslint-disable-next-line no-unused-vars

// import axios from 'axios';
import moment from 'moment';
// import config from '../config';
import datajson from '../../latest_all_days.json';

export default {
  methods: {
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
    minuteDisplay(minsTotal) {
      const hours = Math.floor(minsTotal / 60);
      let minutes = minsTotal % 60;
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      return `${hours}:${minutes}`;
    },
    getDataM() {
      return new Promise((resolve) => {
        const tempccdata = this.convertDataM(datajson);
        resolve(tempccdata);
      });
    },
    convertDataM(rawData) {
      const convertedData = [];
      let tempWeek = {
        days_data: [],
        summary_data: {},
      };
      Object.entries(rawData).forEach((e) => {
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
          convertedData.push(tempWeek);
          tempWeek = {
            days_data: [],
            summary_data: {},
          };
        }
      });
      if (tempWeek.days_data.length > 0) {
        tempWeek.days_data.reverse();
        tempWeek.summary_data = this.generateAverages(tempWeek.days_data);
        convertedData.push(tempWeek);
      }
      convertedData.reverse();
      console.log(convertedData);
      return convertedData;
    },
  },
};
