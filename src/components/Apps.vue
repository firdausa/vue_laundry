<template>
    <div class="container-scroller">
          <div class="horizontal-menu">
              <nav class="navbar top-navbar col-lg-12 col-12 p-0">
                <div class="nav-top flex-grow-1">
                  <div class="container d-flex flex-row h-100 align-items-center">
                    <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                      <h2>LAUNDRY ({{nama_outlet}})</h2>
                    </div>
                    <div class="navbar-menu-wrapper d-flex align-items-center justify-content-end flex-grow-1">
                      <ul class="navbar-nav navbar-nav-right">
                        <li class="nav-item nav-profile dropdown">
                          <a class="nav-link" @click="Logout" href="#">
                            Keluar
                          </a>
                        </li>
                      </ul>
                      <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="horizontal-menu-toggle">
                        <span class="mdi mdi-menu"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </nav>
              <nav class="bottom-navbar">
                <div class="container">
                  <ul class="nav page-navigation">
                    <li class="nav-item">
                      <router-link to="/" class="nav-link">
                        <i class="mdi mdi-view-dashboard-outline menu-icon"></i>
                        <span class="menu-title">Beranda</span>
                      </router-link>
                    </li>
                    <li class="nav-item" v-if="role === 'admin'">
                      <router-link to="/user" class="nav-link">
                        <i class="mdi mdi-account-settings menu-icon"></i>
                        <span class="menu-title">User</span>
                      </router-link>
                    </li>
                    <li class="nav-item" v-if="role === 'admin'">
                      <router-link to="/outlet" class="nav-link">
                        <i class="mdi mdi-puzzle-outline menu-icon"></i>
                        <span class="menu-title">Outlet</span>
                      </router-link>
                    </li>
                    <li class="nav-item" v-if="role === 'admin'">
                      <router-link to="/paket" class="nav-link">
                        <i class="mdi mdi-file-document-box-outline menu-icon"></i>
                        <span class="menu-title">Paket</span>
                      </router-link>
                    </li>
                    <li class="nav-item" v-if="role !== 'owner'">
                      <router-link to="/member" class="nav-link">
                        <i class="mdi mdi-codepen menu-icon"></i>
                        <span class="menu-title">Member</span>
                      </router-link>
                    </li>
                    
                    <li class="nav-item" v-if="role !== 'owner'">
                      <router-link to="/transaksi" class="nav-link">
                        <i class="mdi mdi-image-filter menu-icon"></i>
                        <span class="menu-title">Transaksi</span>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </nav>
          </div>
          <div class="container-fluid page-body-wrapper">
              <div class="main-panel">
                <router-view></router-view>
              </div>

              <footer class="footer">
                <div class="w-100 clearfix">
                  <span class="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © 2019 <a href="http://www.urbanui.com/" target="_blank">Moklet</a>. All rights reserved.</span>
                  <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">UKL Moklet & Made With <i class="mdi mdi-heart-outline text-danger"></i></span>
                </div>
              </footer>
          </div>
        </div>
</template>
<script>
module.exports = {
  data : function(){
    return {
      key: "",
      role: "",
      nama_outlet: "",
    }
  },
  methods: {
    getInfo: function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      axios.get(base_url + "/login/check", conf)
      .then(response => {
        if(response.data.success == true){
          this.role = response.data.data.role;

          //get nama outlet
          axios.get(base_url + "/outlet/" + response.data.data.id_outlet, conf)
          .then(response2 => {
            if(response2.data.success == true){
              this.nama_outlet = response2.data.data.nama_outlet;
            }
          })
          .catch(error => {
            console.log(error);
          });
    
        } else {
          this.componentName = 'login';
          window.location = front_url;
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    Logout : function(){
        this.$cookies.remove("Authorization");
        this.componentName = 'login';
        //location.reload();
        window.location = front_url;
    }
  },
  mounted(){
    this.key = this.$cookies.get("Authorization");
    this.getInfo();
  }
}
</script>