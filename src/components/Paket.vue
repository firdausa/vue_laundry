<template>
  <div>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Paket</b></p>
              <p class="card-description float-right">
                <b-button size="sm" variant="success" v-b-modal.modal-paket v-on:click="Add()"><i class="mdi mdi-plus btn-icon-prepend"></i>
                  Tambah</b-button>
              </p>
              <div class="table-responsive">

                <b-table striped hover :items="paket" :fields="fields">
                  <template v-slot:cell(jenis)="data">
                    <b-badge variant="warning">{{ data.item.jenis }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" class="btn btn-sm btn-info btn-icon-text" v-on:click="Edit(data.item)" v-b-modal.modal-paket>
                          <i class="mdi mdi-pencil btn-icon-prepend"></i>
                          Ubah
                    </b-button>
                    <b-button size="sm" class="btn btn-sm btn-danger btn-icon-text" v-on:click="Drop(data.item.id_paket)">
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
      id="modal-paket"
      ref="modal"
      title="Form Paket"
      size="sm"
      @ok="Save"
    >
      <form>
        <div class="form-group">
          <label for="jenis" class="col-form-label">Jenis</label>
          <select class="form-control" v-model="jenis">
            <option value="kiloan">Kiloan</option>
            <option value="selimut">Selimut</option>
            <option value="kaos">Kaos</option>
            <option value="bed_cover">Bed Cover</option>
          </select>
        </div>
        <div class="form-group">
          <label for="nama" class="col-form-label">Harga</label>
          <input type="number" name="harga" class="form-control" id="harga" placeholder="Harga (RP)" v-model="harga">
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      search: "",
      id_paket: "",
      jenis: "",
      harga: "",
      action: "",
      message: "",
      key: "",
      paket: [],
      fields: ["id_paket", "jenis", "harga", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      axios.get(base_url + "/paket", conf)
      .then(response => {
        if(response.data.success == true){
          this.paket = response.data.data.paket;
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
      this.id_paket = "";
      this.jenis = "";
      this.harga = ""; 
    },

    Edit : function(item){
      this.action = "update";
      this.id_paket = item.id_paket;
      this.jenis = item.jenis;
      this.harga = item.harga;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvModal.hide("modal-paket");
      let form = {
        "id_paket": this.id_paket,
        "jenis": this.jenis,
        "harga": this.harga
      }

      if(this.action === "insert"){
        axios.post(base_url + "/paket", form, conf)
        .then(response => {
          this.getData();
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        axios.put(base_url + "/paket/" + this.id_paket, form, conf)
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
        axios.delete(base_url + "/paket/" + id, conf)
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