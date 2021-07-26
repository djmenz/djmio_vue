<template>
  <div>
    <!-- <ul v-for="entry in week_data" v-bind:key="entry" align=left>
       <li> {{entry[0]}} {{entry[1]}}</li>
       <p v-if="entry.summary==='End of week'">END OF WEEK</p>
       </ul> -->

 <v-simple-table>
              <thead>
            <tr>
              <th scope="col" width='5'>Date</th>
              <th scope="col" width='8'></th>
              <th scope="col">BW</th>
              <th scope="col">Cals</th>
              <th scope="col">Protein</th>
              <th scope="col">Carbs</th>
              <th scope="col">Fats</th>
              <th scope="col">Steps</th>
              <th scope="col" width='20%'>Lifting</th>
              <th scope="col" width='20%'>Strava</th>
            </tr>
          </thead>
          <tbody>

    <tr v-for="entry in week_data.days_data" v-bind:key="entry">
      <td>{{ entry[0].split(' ')[0] }}</td>
      <td>{{ entry[0].split(' ')[1] }}</td>
      <td>{{ entry[1].bodyweight }}</td>
      <td>{{ entry[1].calories.toFixed(0) }}</td>
      <td>{{ entry[1].protein.toFixed(0) }}</td>
      <td>{{ entry[1].carbs.toFixed(0) }}</td>
      <td>{{ entry[1].fats.toFixed(0) }}</td>
      <td>{{ entry[1].steps }}</td>
      <td  v-if="entry[1].lifting_sessions && entry[1].lifting_sessions.length >0">
         <v-btn
      color="success"
      class="mr-2"
      @click="$emit('show-exercise', entry[1].lifting_sessions[0])"
        >
        +
       </v-btn>
       {{entry[1].lifting_sessions[0].lifting_description.split("Time ")[1]}}
         </td>
         <td v-else></td>
      <td  v-if="entry[1].strava_activities && entry[1].strava_activities.length >0">
      <v-btn
      color="yellow"
      class="mr-2"
       @click="$emit('show-exercise', entry[1].strava_activities[0])"
        >
        +
       </v-btn>
         {{entry[1].strava_activities[0].strava_description}}</td>
         <td v-else></td>
      <td>
      </td>
      </tr>
    </tbody>
     </v-simple-table>
      <v-col cols="3" justify="left">
     <v-simple-table>
         <tr ><td>Avg BW:</td><td>{{week_data.summary_data.avgBW.toFixed(2)}} kg</td></tr>
         <tr><td>Avg Cals:</td><td>{{week_data.summary_data.avgCals.toFixed(0)}} ({{week_data.summary_data.avgCalsCount}}/7)</td></tr>
         <tr><td>Avg Steps:</td><td>{{week_data.summary_data.avgSteps.toFixed(0)}}</td></tr>
         <tr><td>Lifting:</td><td>{{week_data.summary_data.liftingTime}} ({{week_data.summary_data.liftingCount}})</td></tr>
         <tr><td>Strava:</td><td>Run {{(week_data.summary_data.stravaRun/1000).toFixed(1)}}
           Ride {{(week_data.summary_data.stravaRide/1000).toFixed(1)}} km</td></tr>
       </v-simple-table>
      </v-col>
     <div></div>
  <v-row style="height: 80px;"></v-row>
  </div>
</template>

<script>
export default {
  name: 'Week',
  props: ['week_data'],
  data() {
    return {
      isDone: this.done,
    };
  },
};

</script>
