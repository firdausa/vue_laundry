<template>
  <div id="poin">
    <div class="content-wrapper">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Transaksi</b></p>
              <p class="card-description float-right">
                <router-link to="/input-transaksi" class="nav-link btn btn-sm btn-success btn-icon-text">
                  <i class="mdi mdi-plus btn-icon-prepend"></i>
                  <span class="menu-title">Tambah Transaksi</span>
                </router-link>
              </p>
              <br>
              <form>
                <div class="row">
                  <div class="col-lg-6 col-md-6">
                      <div class="form-group">
                        <label for="tahun" class="col-form-label">Tahun</label>
                        <b-form-select class="form-control" @change="getData($event)" v-model="tahun" :options="list_years"></b-form-select>
                      </div>
                  </div>
                   <div class="col-lg-6 col-md-6">
                      <div class="form-group">
                        <label for="tahun" class="col-form-label">Bulan</label>
                        <b-form-select class="form-control" @change="getData($event)" v-model="bulan" :options="list_months"></b-form-select>
                      </div>
                  </div>
                </div>

              </form>
              <div class="table-responsive">

                <b-table striped hover :items="transaksi" :fields="fields_transaksi">

                  <template v-slot:cell(status)="data">
                    <select class="form-control" @change="changeStatus(data.item.id_transaksi, $event)">
                      <option value="baru" :selected="data.item.status === 'baru'">Baru</option>
                      <option value="proses" :selected="data.item.status === 'proses'">Proses</option>
                      <option value="selesai" :selected="data.item.status === 'selesai'">Selesai</option>
                      <option value="diambil" :selected="data.item.status === 'diambil'">Diambil</option>
                    </select>
                  </template>

                  <template v-slot:cell(dibayar)="data">
                    <select class="form-control" @change="changeBayar(data.item.id_transaksi, $event)">
                      <option value="dibayar" :selected="data.item.dibayar === 'dibayar'">Dibayar</option>
                      <option value="belum_dibayar" :selected="data.item.dibayar === 'belum_dibayar'">Belum Dibayar</option>
                    </select>
                  </template>

                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" class="btn btn-sm btn-warning btn-icon-text" v-on:click="Detail(data.item.detail_transaksi, data.item.total)" v-b-modal.modal-detail>
                          <i class="mdi mdi-file-document-box-outline btn-icon-prepend"></i>
                          Detail
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
      id="modal-detail"
      ref="modal"
      title="Detail Transaksi"
      size="md"
      hide-footer="true"
    >
      <a href="#" @click="Prints()">print</a>
      <div class="table-responsive table table-stripped" id="print">
        <b-table striped hover :items="detail_transaksi" :fields="fields_detail_transaksi">
        </b-table>
        <div class="text-right"><h4>Total: Rp{{ total }}</h4></div>
      </div>
    </b-modal>

    <b-modal
      id="modal-recipe"
      ref="modal"
      title="Nota Pemesanan"
      size="md"
      hide-footer="true"
    >
      <div class="table-responsive">
        <b-table striped hover :items="detail_transaksi" :fields="fields_detail_transaksi">
        </b-table>
        <div class="text-right"><h4>Total: Rp{{ total }}</h4></div>
      </div>
    </b-modal>
  </div>
</template>

<script>



module.exports = {
  data : function(){
    return {
      tahun: "",
      bulan: "",
      tgl: "",
      action: "",
      message: "",
      key: "",
      total: "",
      transaksi: [],
      detail_transaksi: [],
      fields_transaksi: ["id_transaksi", "nama_member", "tgl", "status", "dibayar", "tgl_bayar", "kasir", "total", "Aksi"],
      fields_detail_transaksi: ["jenis", "berat", "sub_total"],
      list_years: [2020, 2021, 2022, 2023],
      list_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let form = {
        "tahun": this.tahun,
        "bulan": this.bulan,
        "tgl": this.tgl
      }
      axios.post(base_url + "/transaksi/report", form, conf)
      .then(response => {
          this.transaksi = response.data.data;
      })
      .catch(error => {
        console.log(error);
      });
    },
    changeStatus: function(id_transaksi, event){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let form = {
        "id_transaksi": id_transaksi,
        "status": event.target.value
      }
      axios.put(base_url + "/transaksi/status", form, conf)
      .then(response => {
        this.getData();
        this.message = response.data.message;
        this.$bvToast.show("message");
      })
      .catch(error => {
        console.log(error);
      });
    },
    changeBayar: function(id_transaksi, event){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let form = {
        "id_transaksi": id_transaksi,
        "status": event.target.value
      }
      axios.put(base_url + "/transaksi/bayar", form, conf)
      .then(response => {
        this.getData();
        this.message = response.data.message;
        this.$bvToast.show("message");
      })
      .catch(error => {
        console.log(error);
      });
    },
    Detail: function(detail_transaksi, total){
      this.total = total;
      this.detail_transaksi = detail_transaksi;
      
    },

    Prints: function(){
      const prtHtml = document.getElementById('print').innerHTML;
      //console.log(prtHtml);
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }

      const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
        <link rel="stylesheet" href="src/assets/css/bootstrap.min.css">
          
        </head>
        <body>
          ${prtHtml}
        </body>
      </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }

  },
  mounted(){
    this.key = this.$cookies.get("Authorization");
    this.getData();
  }
}

</script>