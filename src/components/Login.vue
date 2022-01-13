<template>
    <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="main-panel">
            <div class="content-wrapper d-flex align-items-center auth">
            <div class="row w-100">
                <div class="col-lg-4 mx-auto">
                <div class="auth-form-light text-left p-5">
                    <div class="navbar-brand brand-logo">
                        <h2>LAUNDRY</h2>
                    </div>
                    <h6 class="font-weight-light">Login untuk mengelola laundry anda.</h6>
                    <form v-on:submit.prevent="Login" class="pt-3" method="post">
                    
                        <b-alert :variant="type" :show="show">
                            <b-spinner v-if="spin" label="Spinning" variant="success" small></b-spinner>
                            {{ message }}
                        </b-alert>

                        <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                            <span class="input-group-text bg-transparent border-right-0">
                                <i class="mdi mdi-account-outline text-primary"></i>
                            </span>
                            </div>
                            <input v-model="username" type="text" class="form-control form-control-lg border-left-0" id="username" name="username" placeholder="Username" required>
                        </div>
                        </div>
                        <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                            <span class="input-group-text bg-transparent border-right-0">
                                <i class="mdi mdi-lock-outline text-primary"></i>
                            </span>
                            </div>
                            <input v-model="password" type="password" class="form-control form-control-lg border-left-0" name="password" id="password" placeholder="Kata Sandi" required>                        
                        </div>
                        </div>
                        <div class="my-3">
                            <input type="submit" name="submit" class="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" value="MASUK">
                        </div>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        <!-- content-wrapper ends -->
        </div>
</template>
<script>
module.exports = {
  data : function(){
      return {
          username : "",
          password : "",
          message: "Loading...",
          type : 'secondary',
          show : false,
          spin: false
      }
  },
  methods: {
    Login: function(){
      this.show = true;
      this.spin = true;
      this.message = "Mohon tunggu...";
      let form = {
          "username": this.username,
          "password": this.password
      }
      axios.post(base_url + "/login", form)
      .then(response => {
        this.spin = false;
        let logged = response.data.success;
        
        if(logged){
            if(this.$cookies.isKey("Authorization")){
                this.$cookies.remove("Authorization");
            }
            this.$cookies.set("Authorization", response.data.data.token);
            this.type = "success";
            this.message = response.data.message;
            this.componentName = "apps";
            location.reload();
        } else {
            this.type = "danger";
            this.message = response.data.message;
        }
      })
      .catch(error => {
          console.log(error);
      });
    }
  }
}
</script>