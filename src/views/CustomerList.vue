<template>
  <div>
    
    <!-- <b-form-input placeholder="page" v-model="currentPage"> </b-form-input> -->
    <b-card no-body class="mb-0">
      <div class="m-2">
        <b-row>
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <h5 class="mb-0">Short By :</h5>
            <b-form-select
              :options="options"
              v-model="selectOption"
              class="w-50 ml-1"
            />
            <b-form-input placeholder="perpage" type="number" v-model="perPage" class="w-25 ml-1"> </b-form-input>
          </b-col>

          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                class="d-inline-block mr-1"
                @input="searchCustomer"
                v-model="searchInput"
                placeholder="Search..."
              />
              <!-- v-model="searchData" -->
              <b-button variant="primary" class="mr-1">
                <!-- @click="
                  ((stateSidebar = !stateSidebar), (addState = true)),
                    (titleForm = 'Add State'),
                    ((state_code = null), (state_name = null))
                " -->
                <span class="text-nowrap">Add New State</span>
              </b-button>
              <b-button variant="warning">
                <span class="text-nowrap">Restore</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="allCustomers"
        :fields="fields"
        hover
        :per-page="perPage"
        striped
        :current-page="currentPage"
      >
        <template #cell(actions)="states">
          <feather-icon
            class="ml-1 cursor-pointer text-success"
            icon="Edit2Icon"
            @click="editState(states.item)"
            size="16"
          />
          <feather-icon
            class="ml-1 cursor-pointer text-danger"
            icon="Trash2Icon"
            @click="deleteId = states.item.id"
            v-b-modal.modal-danger
            size="16"
          />
        </template>
      </b-table>
      <b-pagination
        class="justify-content-end p-1"
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="rows"
        aria-controls="my-table"
      ></b-pagination>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BButton,
  BTable,
  BForm,
  BFormSelect,
  BFormGroup,
  BFormFile,
  BFormInput,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BFormCheckbox,
  BModal,
  BPagination,
} from "bootstrap-vue";
export default {
  components: {
    BCard,
    BRow,
    BCol,
    BButton,
    BTable,
    BForm,
    BFormGroup,
    BFormSelect,
    BFormCheckbox,
    BFormFile,
    BFormInput,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BModal,
    BPagination,
  },
  data() {
    return {
      selectOption: 3,
      page: null,
      currentPage: null,
      allCustomers: null,
      perPage: null,
      searchInput: null,
      options: [
        { text: "A to Z", value: 1 },
        { text: "Z to A", value: 2 },
        { text: "Most Recent", value: 3 },
      ],
      fields: [
        {
          key: "name",
          label: "Customer Name",
        },
        {
          key: "email",
          label: "Customer Email",
        },
        {
          key: "actions",
          label: "Actions",
          tdClass: "text-right",
          thClass: "text-right",
        },
      ],
    };
  },
  mounted() {
    this.getCustomers();
  },
  computed: {
    rows() {
      return this.allCustomers?.length;
    },
  },
  methods: {
    async getCustomers() {
      //   let token = localStorage.getItem("access_token");
      //   this.token = token;
    //   this.currentPage = 1
    //   this.perPage = 9
      let input = {
        search: this.searchInput,
        rowsPerPage: this.perPage,
        page: this.currentPage,
      };
      //   console.log(input)
      this.$axios.defaults.headers.common["Authorization"] =
        "Bearer " +
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjg0ZDkyMGI2YTJiODQyM2M2NDA4YWYzMDQ0ZmI0MjY0ZDNkNjQxYWE2ZTFhY2U1YjZlOGVkM2NmYjE5Y2M5MmNiOTk2YWExNmQ4NTcwODciLCJpYXQiOjE2NzI5ODU4NjUuNzE5NDQ0LCJuYmYiOjE2NzI5ODU4NjUuNzE5NDQ3LCJleHAiOjE3MDQ1MjE4NjUuNzEyMTExLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.mPuUPzwtZoMNHtKgjA_hEbdElEm_fsOo9XKEQ1hTsWpa2121taCyFYnnDx2Xa2DbzQK5diLQfVPoi9yNKkwm_KLFMSnZHamN3XEMRDb8qmqVc2UmAPOwYjzBEYI0NIjdhnPVp71mgLEv7T7EsIB9akg8ISvbGD5qwZyNGjhaQHjiRUayi8s2lcpQ25srgwkK4l6Ev2QutrFXi5HMHuT1oi3DxDo8DBX-70-tuyXVkwmjNBteDm1I-VnytlEx02XotnguhJPQ-Dm4Mv189Wmj6eeaYKSFVj4aRG8grXL9jx3-SkR7i0cXc3hLnyACoVe9IbvMjygEccdzuQWP__V2BpKXokZHHVJl51EKprne_582wOR-8GY-TV7wfJ3TD1RQbfuFOtOvqe_8clmt-tZNzwBlH7A_NxzjqOGvvcnJ3e6Iq8vOflUblSv3p1YbxNlk-uUIFNlS8yyeqBjDBIQJumUe95SY4mIrfqsxT142K4FGsEqLSGGF8-9a_u99sITg4_UHoONbgKfkaTi3CbLN9V0FWaIRknDRhUIU9D2YcLM-pMnPrv8eeNOtZWItRkYFTloNb4msGlpkZPLcYr9gYWd72AZ6Gn-EPo1UoTgdap1ofZZX2fIrG6POeqe9yk3YOS6SfAeZDBEa9yyQFlB4loYn42azf7BDx_D7VHQFHMQ";
      await this.$axios

        .get("https://5522-115-246-26-84.in.ngrok.io/api/admin/customer", {
          params: input,
        })
        .then((response) => {
          let customer_data = response.data.data;
          customer_data.forEach((element) => {
            element.value = element.id;
            element.text = element.name;
          });
          this.allCustomers = customer_data;
          //   this.duplicateStates = customer_data;
          console.log("this.allCustomers", this.allCustomers);
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
    searchCustomer() {
        this.currentPage = 1;
      setTimeout(() => {
        this.getCustomers();
      }, 10);
    },
  },
};
</script>

<style>
</style>