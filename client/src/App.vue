<template>
  <v-app>
    <v-app-bar
      app
      color="black"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

      </div>
          <h3 color="red">DJM.IO |
    <router-link to="/">Daily View</router-link> |
    <router-link to="/Summary">Summary</router-link>
    <!-- <router-link to="/Graphs">Graphs</router-link> -->
    </h3>
      <v-spacer>

      </v-spacer>

      <v-btn
        color="red"
        append="false"
        href="mailto:daniel.j.menz@gmail.com"
        text
      >
        <span class="mr-2">Contact</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
