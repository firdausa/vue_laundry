<template>
  <div>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Member</b></p>
              <p class="card-description float-right">
                <b-button size="sm" variant="success" v-b-modal.modal-member v-on:click="Add()"><i class="mdi mdi-plus btn-icon-prepend"></i>
                  Tambah</b-button>
              </p>
              <div class="table-responsive">

                <b-table striped hover :items="member" :fields="fields">
                  <template v-slot:cell(jenis_kelamin)="data">
                        <span v-if="data.item.jenis_kelamin === 'l'">Laki-Laki</span>
                        <span v-if="data.item.jenis_kelamin === 'p'">Perempuan</span>
                    </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" class="btn btn-sm btn-info btn-icon-text" v-on:click="Edit(data.item)" v-b-modal.modal-member>
                          <i class="mdi mdi-pencil btn-icon-prepend"></i>
                          Ubah
                    </b-button>
                    <b-button size="sm" class="btn btn-sm btn-danger btn-icon-text" v-on:click="Drop(data.item.id_member)">
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
      id="modal-member"
      ref="modal"
      title="Form member"
      size="md"
      @ok="Save"
    >
      <form>
        <div class="form-group">
          <label for="nama" class="col-form-label">Nama</label>
          <input type="text" class="form-control" placeholder="Nama" v-model="nama">
        </div>
        <div class="form-group">
          <label for="nama" class="col-form-label">Alamat</label>
          <input type="text" class="form-control" placeholder="Alamat" v-model="alamat">
        </div>
        <div class="form-group">
          <label for="jenis_kelamin" class="col-form-label">Jenis Kelamin</label>
          <select class="form-control" v-model="jenis_kelamin">
            <option value="l">Laki-Laki</option>
            <option value="p">Perempuan</option>
          </select>
        </div>
        <div class="form-group">
          <label for="tlp" class="col-form-label">Telepon</label>
          <input type="text" class="form-control" placeholder="Telepon" v-model="tlp">
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      id_member: "",
      nama: "",
      alamat: "",
      jenis_kelamin: "",
      tlp: "",
      action: "",
      message: "",
      key: "",
      member: [],
      fields: ["id_member", "nama",  "alamat", "jenis_kelamin", "tlp", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      axios.get(base_url + "/member", conf)
      .then(response => {
        if(response.data.success == true){
          this.member = response.data.data.member;
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
      this.id_member = "";
      this.nama = "";
    },

    Edit : function(item){
      this.action = "update";
      this.id_member = item.id_member;
      this.nama = item.nama;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvModal.hide("modal-member");
      let form = {
        "id_member": this.id_member,
        "nama": this.nama,
        "alamat": this.alamat,
        "jenis_kelamin": this.jenis_kelamin,
        "tlp": this.tlp,
      }

      if(this.action === "insert"){
        axios.post(base_url + "/member", form, conf)
        .then(response => {
          this.getData();
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        axios.put(base_url + "/member/" + this.id_member, form, conf)
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
        axios.delete(base_url + "/member/" + id, conf)
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