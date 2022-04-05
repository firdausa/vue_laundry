var base_url = "http://localhost:8001/api";
var router = [
  { path: "/", name: "Beranda", component: httpVueLoader("./src/components/Beranda.vue")},
  { path: "/home", name: "Home", component: httpVueLoader("./src/components/Beranda.vue")},
  { path: "/user", name: "User", component: httpVueLoader("./src/components/User.vue")},
  { path: "/outlet", name: "Outlet", component: httpVueLoader("./src/components/Outlet.vue")},
  { path: "/paket", name: "Paket", component: httpVueLoader("./src/components/Paket.vue")},
  { path: "/member", name: "Member", component: httpVueLoader("./src/components/Member.vue")},
  { path: "/input-transaksi", name: "Input Transaksi", component: httpVueLoader("./src/components/Input_transaksi.vue")},
  { path: "/transaksi", name: "Transaksi", component: httpVueLoader("./src/components/Transaksi.vue")},
];
var routers = new VueRouter({ routes : router, base: "/"});

var app = new Vue({
  el: "#app",
  components: {
    'login': httpVueLoader("./src/components/Login.vue"),
    'apps' : httpVueLoader("./src/components/Apps.vue"),
  },
  data: {
    user : {
      id_user: "",
      id_outlet: "",
      role: "",
      name: "",
      username: "",
    },
    componentName: ""
  },
  router: routers,
  methods: {
    authenticate : function(){
      if(this.$cookies.isKey("Authorization")){
        let conf = { headers : {"Authorization" : "Bearer " + this.$cookies.get("Authorization")} };
        axios.get(base_url + "/login/check", conf)
        .then(response => {
          if(response.data.success == true){
            this.user.name = response.data.data.nama;
            this.user.username = response.data.data.username;
            this.user.role = response.data.data.role;
            this.user.id_outlet = response.data.data.id_outlet;
            this.user.id_user = response.data.data.id;
            this.componentName = 'apps';
          } else {
            this.componentName = 'login';
          }
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        this.componentName = 'login';
      }
    },
  },
  mounted(){
    this.authenticate();
  }
});

Vue.config.devtools = true;