<template>
  <div>
    <div>
      <!-- {{ this.allStates }} -->
      <label for="">Select State</label>
      <b-form-select v-model="stateSelected" :options="allStates" @input="getCounties" class="mb-3" />
      <label for="">Select County</label>
      <b-form-select v-model="countySelected" :options="allCounties" />
      <div class="mt-1">
        Selected: <strong>{{ stateSelected }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import { BFormSelect } from "bootstrap-vue";
// import { forEach } from "postcss-rtl/lib/affected-props";
export default {
  components: {
    BFormSelect,
  },
  data() {
    return {
      allStates: null,
      allCounties: null,
      stateSelected: null,
      countySelected:null,
    };
  },
  mounted() {
    this.getState();
    // this.getCounties()
  },
  methods: {
    async getState() {
      let obj = localStorage.getItem("access_token");
      this.token = obj;
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + obj;
      await this.$axios
        .post(
          "https://zignuts.dev/quotebuddy-api/api/v2/loan-officer/master/state-list"
        )
        .then((response) => {
          let state_data = response.data.data.states;
          state_data.forEach((element) => {
            element.value = element.id;
            element.text = element.name;
          });
          this.allStates = state_data;
          console.log("state_data", state_data);
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
    async getCounties() {
        let input = {
        state_id: this.stateSelected
      };

      let obj = localStorage.getItem("access_token");
      this.token = obj;
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + obj;
      await this.$axios
        .post(
          "https://zignuts.dev/quotebuddy-api/api/v2/loan-officer/master/county-list",
          input
        )
        .then((response) => {
          let county_data = response.data.data.countis;
        //   this.allCounties = county_data
          county_data.forEach((county) => {
             county.value = county.id;
             county.text = county.name;
           });
           this.allCounties = county_data;
          console.log("county_data", county_data);
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
  },
};
</script>

<style>
</style>