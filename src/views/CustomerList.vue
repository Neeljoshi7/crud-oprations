<template>
  <div>
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Nav Menu -->
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
            <!-- <b-form-input placeholder="perpage" type="number" v-model="perPage" class="w-25 ml-1"> </b-form-input> -->
          </b-col>

          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                class="d-inline-block mr-1"
                @input="searchCustomer"
                v-model="searchInput"
                placeholder="Search..."
              />
              <b-button variant="primary" class="mr-1">
                <span class="text-nowrap">Add New State</span>
              </b-button>
              <b-button variant="warning">
                <span class="text-nowrap">Restore</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <!-- Customer Table -->
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

      <!-- Pagination -->
      <b-pagination
        class="justify-content-end p-1"
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="totalData"
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
      totalData: null,
      selectOption: 3,
      page: null,
      currentPage: 1,
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
  watch: {
    // Get Current Page in pagination
    currentPage(pv) {
      let input = {
        // search: this.searchInput,
        // rowsPerPage: this.perPage,
        page: pv,
      };
      this.$axios.defaults.headers.common["Authorization"] =
        "Bearer " +
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMTM2YTg4ZTQyZGY2NzQxZTdkNmE4NGI5YTg5NjdmOTM3ZDY4MmM0NTA0ZWNhNGI0ZWQ2ZmNjMjkzM2Q3NTkzNjBmMjBmN2Q1ODFkZjI4NTkiLCJpYXQiOjE2NzMyNzkzMTkuNDgyNTQzLCJuYmYiOjE2NzMyNzkzMTkuNDgyNTQ4LCJleHAiOjE3MDQ4MTUzMTkuNDc5MzU2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.Aa3ZaVZkYRbh_BWUg65H2s4MSuXBFf49NDvkg6e5t3211Tb5lP1GYleap2Z9s1mfJ3Qcn95wcyt2ahU4loBUkApb2JjLM2OzD4-W2KFGY2VPmInrQWJeRPNix9qvmBvhv4fecQUwUpPCs5c2UoDY6M_tVoXKyMCwv91VZEC1rQbsXvm5luXUUYpNmJ1N_AoFUv2iIzIwrSZ_mAItVyC8dOgB-_m_XvHAizj68lm0ZhKVKzqTVmxOha8TGB3aT4CyB0bb88Kz2XRJAegOkarh_ogQ_HPB6sJ101T-YnYvN4c3T3BHNRNjzDTd0eG-YTEjnCuSQVPMWBN7KsV6Z8zW0PiS-z2WB_jPiIYRig5yRNvdYIqKgR7Mh1-M3rcRheEimrvb37IW__BqDzWrAI_tDDXPOYXpFjxSiWkUYs_Tt8QFavhjRbs1dYhRQk73BZRrQjblBoK0qRgo_HdFA387gH-D-eGBs22e0NNDKvNxUahbNVr8mVHDB6e8oyBT0vITJMOUdRwUduaaGnq-i5nfQdPDc_Kq8CznVSj3VWsd3ekMu1O-DDDzPXJLB_4GLtODJOIxnPLue_TsjeJS3KRClmMA8E2BermhBe3vCbtRYOiNVCbubYXku-lj3sTSs78yCYjauLi-uCxZb5neupgFQkNLUkEMIhFKnilsIZoz7QE";

      // customer listing API
      this.$axios
        .get("https://apidev.yakk.es/api/admin/customer", {
          params: input,
        })
        .then((response) => {
          let customer_data = response.data.data;
          customer_data.forEach((element) => {
            element.value = element.id;
            element.text = element.name;
          });
          this.allCustomers = customer_data;
          this.totalData = response.data.total;
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
  },
  methods: {
    // get all customers
    async getCustomers() {
      let input = {
        search: this.searchInput,
        rowsPerPage: this.perPage,
        page: this.currentPage,
      };
      this.$axios.defaults.headers.common["Authorization"] =
        "Bearer " +
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMTM2YTg4ZTQyZGY2NzQxZTdkNmE4NGI5YTg5NjdmOTM3ZDY4MmM0NTA0ZWNhNGI0ZWQ2ZmNjMjkzM2Q3NTkzNjBmMjBmN2Q1ODFkZjI4NTkiLCJpYXQiOjE2NzMyNzkzMTkuNDgyNTQzLCJuYmYiOjE2NzMyNzkzMTkuNDgyNTQ4LCJleHAiOjE3MDQ4MTUzMTkuNDc5MzU2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.Aa3ZaVZkYRbh_BWUg65H2s4MSuXBFf49NDvkg6e5t3211Tb5lP1GYleap2Z9s1mfJ3Qcn95wcyt2ahU4loBUkApb2JjLM2OzD4-W2KFGY2VPmInrQWJeRPNix9qvmBvhv4fecQUwUpPCs5c2UoDY6M_tVoXKyMCwv91VZEC1rQbsXvm5luXUUYpNmJ1N_AoFUv2iIzIwrSZ_mAItVyC8dOgB-_m_XvHAizj68lm0ZhKVKzqTVmxOha8TGB3aT4CyB0bb88Kz2XRJAegOkarh_ogQ_HPB6sJ101T-YnYvN4c3T3BHNRNjzDTd0eG-YTEjnCuSQVPMWBN7KsV6Z8zW0PiS-z2WB_jPiIYRig5yRNvdYIqKgR7Mh1-M3rcRheEimrvb37IW__BqDzWrAI_tDDXPOYXpFjxSiWkUYs_Tt8QFavhjRbs1dYhRQk73BZRrQjblBoK0qRgo_HdFA387gH-D-eGBs22e0NNDKvNxUahbNVr8mVHDB6e8oyBT0vITJMOUdRwUduaaGnq-i5nfQdPDc_Kq8CznVSj3VWsd3ekMu1O-DDDzPXJLB_4GLtODJOIxnPLue_TsjeJS3KRClmMA8E2BermhBe3vCbtRYOiNVCbubYXku-lj3sTSs78yCYjauLi-uCxZb5neupgFQkNLUkEMIhFKnilsIZoz7QE";

      // customer listing API
      await this.$axios
        .get("https://apidev.yakk.es/api/admin/customer", {
          params: input,
        })
        .then((response) => {
          let customer_data = response.data.data;
          customer_data.forEach((element) => {
            element.value = element.id;
            element.text = element.name;
          });
          this.allCustomers = customer_data;
          this.totalData = response.data.total;
        })
        .catch((e) => {
          console.log("error", e);
        });
    },

    // Search Customers
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