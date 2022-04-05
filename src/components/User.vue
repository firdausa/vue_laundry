<template>
  <div>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data User</b></p>
              <p class="card-description float-right">
                <b-button size="sm" variant="success" v-b-modal.modal-user @click="Add()"><i class="mdi mdi-plus btn-icon-prepend"></i>
                  Tambah</b-button>
              </p>
              <div class="table-responsive">

                <b-table striped hover :items="user" :fields="fields">
                  <template v-slot:cell(role)="data">
                        <b-badge variant="primary"><span v-if="data.item.role === 'admin'">Admin</span></b-badge>
                        <b-badge variant="warning"><span v-if="data.item.role === 'kasir'">Kasir</span></b-badge>
                        <b-badge variant="danger"><span v-if="data.item.role === 'owner'">Owner</span></b-badge>
                    </template>
                    <template v-slot:cell(outlet)="data">
                        {{ data.item.outlet.nama_outlet }}
                    </template>

                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" class="btn btn-sm btn-info btn-icon-text" v-on:click="Edit(data.item)" v-b-modal.modal-user>
                          <i class="mdi mdi-pencil btn-icon-prepend"></i>
                          Ubah
                    </b-button>
                    <b-button size="sm" class="btn btn-sm btn-danger btn-icon-text" v-on:click="Drop(data.item.id_user)">
                      <i class="mdi mdi-delete btn-icon-prepend"></i>
                      Hapus
                    </b-button>
                  </template>
                </b-table>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      id="modal-user"
      ref="modal"
      title="Form user"
      size="sm"
      @ok="Save"
    >
      <form>
        <div class="form-group">
          <label for="nama" class="col-form-label">Nama</label>
          <input type="text" class="form-control" placeholder="Nama" v-model="nama">
        </div>
        <div class="form-group">
          <label for="nama" class="col-form-label">Username</label>
          <input type="text" class="form-control" placeholder="Username" v-model="username">
        </div>
        <div class="form-group">
          <label for="nama" class="col-form-label">Password</label>
          <input type="text" class="form-control" placeholder="Password" v-model="password">
        </div>
        <div class="form-group">
          <label for="role" class="col-form-label">Role</label>
          <select class="form-control" v-model="role">
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div class="form-group">
            <label for="id_outlet" class="col-form-label">Outlet</label>
            <b-form-select class="form-control" v-model="id_outlet" :options="data_outlet"></b-form-select>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      id_outlet: "",
      nama: "",
      username: "",
      password: "",
      role: "",
      action: "",
      message: "",
      key: "",
      user: [],
      data_outlet: [],
      fields: ["id", "nama",  "username", "role", "outlet", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      axios.get(base_url + "/user", conf)
      .then(response => {
        if(response.data.success == true){
          this.user = response.data.data.user;
        } else {
          this.componentName = 'login';
          window.location = front_url;
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    },

    getOutletDropdown: function(){
        //ambil data outlet untuk dropdown
        let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
        axios.get(base_url + "/outlet", conf)
        .then(response => {
            let json_outlet = response.data.data.outlet;
            let list_outlet = [{value: "", text: "-- Pilih Outlet --"}]
            json_outlet.forEach(element => {
                list_outlet.push({value: element.id_outlet, text: element.nama_outlet})
            });
            this.data_outlet = list_outlet
        })
    },

    Add : function(){
      this.action = "insert";
      this.id_outlet = "";
      this.id_user = "";
      this.nama = "";
      this.username = "";
      this.password = "";
      this.role = "";

      this.getOutletDropdown();

    },

    Edit : function(item){
      this.action = "update";
      this.id_outlet = item.id_outlet;
      this.id_user = item.id;
      this.nama = item.nama;
      this.username = item.username;
      this.role = item.role;

      this.getOutletDropdown();
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvModal.hide("modal-user");
      let form = {
        "id_outlet": this.id_outlet,
        "nama": this.username,
        "username": this.username,
        "password": this.password,
        "role": this.role,
      }

      if(this.action === "insert"){
        axios.post(base_url + "/user", form, conf)
        .then(response => {
          this.getData();
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        axios.put(base_url + "/user/" + this.id_user, form, conf)
        .then(response => {
          this.getData();
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },

    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        axios.delete(base_url + "/user/" + id, conf)
        .then(response => {
          if(response.data.success == true){
            this.getData();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
  mounted(){
    this.key = this.$cookies.get("Authorization");
    this.getData();
  }
}
</script>