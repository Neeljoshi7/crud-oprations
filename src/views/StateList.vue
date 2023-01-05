<template>
  <div>
    <SidebarForm
      :isActive="stateSidebar"
      @closeSidebar="stateSidebar = !stateSidebar"
      :formTitle="titleForm"
    >
      <!-- 
      :nameValue="editEmployeeData.name"
      :salaryValue="editEmployeeData.salary"
      :ageValue="editEmployeeData.age"
      :contactValue="editEmployeeData.phoneNo"
      :addressValue="editEmployeeData.address"
      :submitButton="submitBtn"
      :cancelButton="cancelBtn"
     -->
      <template #body>
        <b-form class="p-2">
          <b-form-group label="State Name" label-for="state-name">
            <b-form-input
              id="state-name"
              v-model="state_name"
              autofocus
              trim
              placeholder="ex. Gujarat"
            />
            <!-- :value="editEmployeeData.name" -->
          </b-form-group>
          <b-form-group label="State Code" label-for="code">
            <b-form-input
              id="code"
              autofocus
              trim
              placeholder="GJ"
              v-model="state_code"
            />
            <!-- :value="editEmployeeData.salary" -->
          </b-form-group>

          <div v-if="addState == true">
            <b-button
              variant="outline-primary"
              size="md"
              class="float-right"
              @click="stateSidebar = !stateSidebar"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              size="md"
              class="float-right mr-1"
              @click="addNewState"
            >
              Add State
            </b-button>
          </div>

          <div v-else>
            <b-button
              variant="outline-primary"
              size="md"
              class="float-right"
              @click="stateSidebar = !stateSidebar"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              size="md"
              class="float-right mr-1"
              @click="editSubmitState"
            >
              Edit State
            </b-button>
          </div>
        </b-form>
      </template>
    </SidebarForm>

    <b-card no-body class="mb-0">
      <div class="m-2">
        <b-row>
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
          </b-col>
          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
              <b-button
                variant="primary"
                class="mr-1"
                @click="
                  ((stateSidebar = !stateSidebar), (addState = !addState)),
                    (titleForm = 'Add State')
                "
              >
                <span class="text-nowrap">Add New State</span>
              </b-button>
              <b-button
                variant="warning"
              >
                <span class="text-nowrap">Restore</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="allStates"
        :per-page="perPage"
        :current-page="currentPage"
        :fields="fields"
        hover
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
          <!-- <feather-icon
            class="ml-1 cursor-pointer text-primary"
            icon="EyeIcon"
            size="16"
          /> -->
        </template>
      </b-table>
      <b-pagination
        class="justify-content-end p-1"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </b-card>

    <b-modal
      id="modal-danger"
      ok-only
      ok-variant="danger"
      ok-title="Accept"
      modal-class="modal-danger"
      centered
      title="Delete"
    >
      <b-card-text>
        Do you really want to delete ?

        <div>
          <b-form-checkbox v-model="permanent_delete" value="A">
            Delete permanent
          </b-form-checkbox>
        </div>
      </b-card-text>
      <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="danger"
            size="md"
            class="float-right"
            @click="deleteState()"
          >
            Delete
          </b-button>
          <b-button variant="outline-danger" size="md" class="float-right mr-1">
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import SidebarForm from "@/components/SidebarForm.vue";
import {
  BCard,
  BRow,
  BCol,
  BButton,
  BTable,
  BForm,
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

    SidebarForm,
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      state_id: null,
      deleteId: null,
      state_name: null,
      state_code: null,
      permanent_delete: false,
      newState: {
        name: null,
        code: null,
      },
      stateSidebar: false,
      addState: false,
      allStates: null,
      titleForm: null,
      perPage: 10,
      currentPage: 1,
      showEntries: [5, 10, 20, 30, 40],
      fields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "name",
          label: "Name",
        },
        {
          key: "code",
          label: "State Code",
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
    this.getState();
  },
  computed: {
    rows() {
      return this.allStates.length;
    },
  },
  methods: {
    async getState() {
      let obj = localStorage.getItem("access_token");
      this.token = obj;
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + obj;
      await this.$axios
        .post("http://api.quotebuddy.net/api/v1/admin/state/list")
        .then((response) => {
          let state_data = response.data.data.states;
          state_data.forEach((element) => {
            element.value = element.id;
            element.text = element.name;
          });
          this.allStates = state_data;
          console.log("all states", this.allStates);
        })
        .catch((e) => {
          console.log("error", e);
        });
    },

    addNewState() {
      // this.titleForm = "Add New State";
      this.callCreateStateApi();
      this.getState();
    },
    editState(state) {
      console.log("state", state);
      this.state_id = state.id;
      this.state_name = state.name;
      this.state_code = state.code;
      this.stateSidebar = !this.stateSidebar;
      this.addState = false;
      this.titleForm = "Edit State";
    },

    async editSubmitState() {
      let input = {
        id: this.state_id,
        name: this.state_name,
        code: this.state_code,
      };
      await this.$axios
        .post("http://api.quotebuddy.net/api/v1/admin/state/update", input)
        // .then((response) => {
        // let state_data = response.data.data.states;
        // state_data.forEach((element) => {
        //   element.value = element.id;
        //   element.text = element.name;
        // });
        // this.allStates = state_data;
        // console.log("all states", this.allStates);
        // })
        .catch((e) => {
          console.log("error", e);
        });

      this.getState();
      this.stateSidebar = !this.stateSidebar;
    },
    async callCreateStateApi() {
      this.stateSidebar = !this.stateSidebar;
      let obj = localStorage.getItem("access_token");
      this.token = obj;
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + obj;

      let insertNewState = this.newState;

      await this.$axios
        .post(
          "http://api.quotebuddy.net/api/v1/admin/state/create",
          insertNewState
        )
        .then((response) => {
          let state_data = response.data.data.states;
          state_data.forEach((element) => {
            element.value = element.id;
            element.text = element.name;
          });
          this.allStates = state_data;
          console.log("all states", this.allStates);
        })
        .catch((e) => {
          console.log("error", e);
        });
    },

   async deleteState() {
      console.log("this.delte :", this.deleteId);

      let input = {
        id: this.deleteId,
        permanent_delete: this.permanent_delete,
      };

      await this.$axios
        .post("http://api.quotebuddy.net/api/v1/admin/state/delete", input)
        // .then((response) => {
        // let state_data = response.data.data.states;
        // state_data.forEach((element) => {
        //   element.value = element.id;
        //   element.text = element.name;
        // });
        // this.allStates = state_data;
        // console.log("all states", this.allStates);
        // })
        .catch((e) => {
          console.log("error", e);
        });
        this.getState();
    },
  },
};
</script>

<style>
</style>