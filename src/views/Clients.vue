<template>
  <div>
    <SidebarForm
      :isActive="sideForm"
      @closeSidebar="sideForm = !sideForm"
      :formTitle="formTitle"
      submitButton="Add Client"
      cancelButton="Cancel"
    >
      <template #body>
        <b-form class="p-2">
          <b-form-group label="First name" label-for="client-first-name">
            <b-form-input
              id="client-first-name"
              autofocus
              trim
              placeholder="Neel"
              :value="editClientData.first_name"
            />
            <!-- :value="nameValue" -->
          </b-form-group>
          <b-form-group label="Last name" label-for="client-last-name">
            <b-form-input
              id="client-last-name"
              autofocus
              trim
              placeholder="Joshi"
              :value="editClientData.last_name"
            />
          </b-form-group>
          <b-form-group label="Phone No." label-for="client-number">
            <b-form-input
              id="client-number"
              autofocus
              trim
              placeholder="9898989898"
              :value="editClientData.phone"
            />
          </b-form-group>
          <b-form-group label="Email Id" label-for="client-email">
            <b-form-input
              type="email"
              id="client-email"
              autofocus
              trim
              placeholder="demo@test.com"
              :value="editClientData.email"
            />
          </b-form-group>
        </b-form>
      </template>
      <!--
    :nameValue="editEmployeeData.name"
    :salaryValue="editEmployeeData.salary"
    :ageValue="editEmployeeData.age"
    :contactValue="editEmployeeData.phoneNo"
    :addressValue="editEmployeeData.address"
     -->
    </SidebarForm>

    <b-card no-body class="mb-0">
      <div class="m-2">
        <b-row>
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
            <v-select
              :options="showEntries"
              v-model="perPage"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>entries</label>
          </b-col>
          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
              <b-button variant="primary" @click="addNewClient">
                <span class="text-nowrap">Add Client</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        :items="clients"
        hover
      >
        <template #cell(actions)="clients">
          <feather-icon
            class="ml-1 cursor-pointer text-success"
            @click="editClient(clients.item)"
            icon="Edit2Icon"
            size="16"
          />
          <feather-icon
            class="ml-1 cursor-pointer text-danger"
            icon="Trash2Icon"
            v-b-modal.modal-danger
            size="16"
          />
          <feather-icon
            class="ml-1 cursor-pointer text-primary"
            icon="EyeIcon"
            size="16"
            />
            <!-- @click="this.$router.push('/viewclient')" -->
        </template>
      </b-table>
      <b-pagination
        class="justify-content-end p-1"
        :per-page="perPage"
        :total-rows="rows"
        v-model="currentPage"
        aria-controls="my-table"
      ></b-pagination>
      <!-- v-model="currentPage" -->
      <!-- :total-rows="rows" -->
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BModal,
  BPagination,
} from "bootstrap-vue";

import SidebarForm from "@/components/SidebarForm.vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
export default {
  name: "clients",
  data() {
    return {
      showEntries: [5, 10, 20, 30, 40],
      editClientData: {},
      perPage: 5,
      currentPage: 1,
      clients: [],
      sideForm: false,
      formTitle: null,
      fields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "first_name",
          label: "First Name",
        },
        {
          key: "last_name",
          label: "Last Name",
        },
        {
          key: "phone",
          label: "Phone No.",
        },
        {
          key: "email",
          label: "Email Id",
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
  computed: {
    rows() {
      return this.clients.length;
    },
  },
  components: {
    BCard,
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BModal,
    BPagination,

    SidebarForm,
    vSelect,
  },
  directives: {
    Ripple,
  },
  mounted() {
    this.getClientsData();
  },
  methods: {
    async getClientsData() {
      let obj = localStorage.getItem("access_token");
      this.token = obj;
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + obj;
      console.log("obj", obj);
      await this.$axios
        .post(
          "https://zignuts.dev/quotebuddy-api/api/v2/loan-officer/master/client-list"
        )
        .then((response) => {
          this.clients = response.data.data.clients;
          console.log("this.clients == ", this.clients);
        })
        .catch(() => {});
    },
    addNewClient() {
        this.sideForm = !this.sideForm;
        this.formTitle = "Add new Client";
      //   this.submitBtn = "Add Employee";
      //   this.cancelBtn = "Cancel";
    //   this.editClientData = null;
    },
    editClient(client) {
      console.log("employee", client);
      this.formTitle = "Edit Client details";
      this.editClientData = client;
      this.sideForm = !this.sideForm;
      //   this.submitBtn = "Save Changes"
      //   this.cancelBtn = "Discard Changes"
    },
  },
};
</script>

<style>
</style>