import Vue from "vue";
const myMixin = Vue.mixin({
  created: function () {
    
  },
  methods: {
    hello() {
      console.log("Mixin called");
    },
  },
});

// export default{
//   methods:{
//     // authenticationCheck(){
//     //   let token = localStorage.getItem("access_token");
//     //   if(!token){
//     //     this.$router.push('/');
//     //   }
//     // }
//   }
// }