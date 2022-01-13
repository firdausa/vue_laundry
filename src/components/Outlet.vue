<template>
  <div>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Outlet</b></p>
              <p class="card-description float-right">
                <b-button size="sm" variant="success" v-b-modal.modal-outlet v-on:click="Add()"><i class="mdi mdi-plus btn-icon-prepend"></i>
                  Tambah</b-button>
              </p>
              <div class="table-responsive">

                <b-table striped hover :items="outlet" :fields="fields">
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" class="btn btn-sm btn-info btn-icon-text" v-on:click="Edit(data.item)" v-b-modal.modal-outlet>
                          <i class="mdi mdi-pencil btn-icon-prepend"></i>
                          Ubah
                    </b-button>
                    <b-button size="sm" class="btn btn-sm btn-danger btn-icon-text" v-on:click="Drop(data.item.id_outlet)">
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
      id="modal-outlet"
      ref="modal"
      title="Form Outlet"
      size="sm"
      @ok="Save"
    >
      <form>
        <div class="form-group">
          <label for="nama_outlet" class="col-form-label">Nama Outlet</label>
          <input type="text" name="nama_outlet" class="form-control" id="nama_outlet" placeholder="Nama Outlet" v-model="nama_outlet">
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
      nama_outlet: "",
      action: "",
      message: "",
      key: "",
      outlet: [],
      fields: ["id_outlet", "nama_outlet", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      axios.get(base_url + "/outlet", conf)
      .then(response => {
        if(response.data.success == true){
          this.outlet = response.data.data.outlet;
        } else {
          this.componentName = 'login';
          window.location = front_url;
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    },

    Add : function(){
      this.action = "insert";
      this.id_outlet = "";
      this.nama_outlet = "";
    },

    Edit : function(item){
      this.action = "update";
      this.id_outlet = item.id_outlet;
      this.nama_outlet = item.nama_outlet;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvModal.hide("modal-outlet");
      let form = {
        "id_outlet": this.id_outlet,
        "nama_outlet": this.nama_outlet,
      }

      if(this.action === "insert"){
        axios.post(base_url + "/outlet", form, conf)
        .then(response => {
          this.getData();
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        axios.put(base_url + "/outlet/" + this.id_outlet, form, conf)
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
        axios.delete(base_url + "/outlet/" + id, conf)
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