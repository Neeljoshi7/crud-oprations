<template>
  <div>

    <!-- Sidebar -->

    <SidebarForm
      :isActive="stateSidebar"
      @closeSidebar="stateSidebar = !stateSidebar"
      :formTitle="titleForm"
    >
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
          </b-form-group>
          <b-form-group label="State Code" label-for="code">
            <b-form-input
              id="code"
              autofocus
              trim
              placeholder="GJ"
              v-model="state_code"
            />
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
          </b-col>

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                class="d-inline-block mr-1"
                v-model="searchData"
                placeholder="Search..."
              />
              <b-button
                variant="primary"
                class="mr-1"
                @click="
                  ((stateSidebar = !stateSidebar), (addState = true)),
                    (titleForm = 'Add State'),
                    ((state_code = null), (state_name = null))
                "
              >
                <span class="text-nowrap">Add New State</span>
              </b-button>
              <b-button variant="warning">
                <span class="text-nowrap">Restore</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>


      <!-- State List Table -->
      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="allStates"
        :per-page="perPage"
        :current-page="currentPage"
        :fields="fields"
        hover
        striped
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
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </b-card>

    <!-- Delete Modal -->
    <b-modal
      id="modal-danger"
      ok-only
      ok-variant="danger"
      ok-title="Accept"
      modal-class="modal-danger"
      ref="delete-modal"
      centered
      title="Delete"
    >
      <b-card-text>
        Do you really want to delete ?

        <div>
          <b-form-checkbox v-model="permanent_delete" :value="true">
            Delete permanent
          </b-form-checkbox>
        </div>
      </b-card-text>

      <!-- Modal Footer -->
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

    SidebarForm,
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      searchData: null,
      state_id: null,
      deleteId: null,
      state_name: null,
      state_code: null,
      selectOption: 3,
      permanent_delete: false,
      newState: {
        name: null,
        code: null,
      },
      stateSidebar: false,
      addState: false,
      allStates: null,
      duplicateStates: null,
      titleForm: null,
      perPage: 10,
      currentPage: 1,
      showEntries: [5, 10, 20, 30, 40],
      options: [
        { text: "A - Z", value: 1 },
        { text: "Z - A", value: 2 },
        { text: "Most Recent", value: 3 },
      ],
      fields: [
        {
          key: "name",
          label: "State Name",
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
  watch: {
    searchData(nv) {
      this.allStates = this.duplicateStates.filter(function (val) {
        return val.name.toUpperCase().indexOf(nv.toUpperCase()) !== -1;
      });
    },
    selectOption(so) {
      if (so) {
        if (so == 1) {
          this.allStates.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
        }
        if (so == 2) {
          this.allStates.sort((a, b) => {
            if (a.name < b.name) {
              return 1;
            }
            if (a.name > b.name) {
              return -1;
            }
            return 0;
          });
        }
        if (so == 3) {
          this.allStates.sort((a, b) => {
            if (a.created_at < b.created_at) {
              return 1;
            }
            if (a.created_at > b.created_at) {
              return -1;
            }
            return 0;
          });
        }
      }
    },
  },
  mounted() {
    this.getState();
  },
  computed: {
    rows() {
      return this.allStates?.length;
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
          this.duplicateStates = state_data;
          this.allStates = state_data;
        })
        .catch((e) => {
          console.log("error", e);
        });
    },

    addNewState() {
      this.callCreateStateApi();
      this.getState();
    },
    editState(state) {
      this.state_id = state.id;
      this.state_name = state.name;
      this.state_code = state.code;
      this.stateSidebar = !this.stateSidebar;
      this.addState = false;
      this.titleForm = "Edit State";
    },

    async editSubmitState() {
      let count = 0;
      this.allStates.forEach((state) => {
        if (state.name == this.state_name && state.code == this.state_code) {
          alert("State Already exist");
          count++;
          return;
        }
      });

      if(count == 0){
        let input = {
          id: this.state_id,
          name: this.state_name,
          code: this.state_code,
        };
        await this.$axios
          .post("http://api.quotebuddy.net/api/v1/admin/state/update", input)
          .catch((e) => {
            console.log("error", e);
          });
  
        this.getState();
      }

      this.stateSidebar = !this.stateSidebar;
    },
    async callCreateStateApi() {
      let insertNewState;
      let count = 0;
      this.stateSidebar = !this.stateSidebar;
      let obj = localStorage.getItem("access_token");
      this.token = obj;
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + obj;

      this.allStates.forEach((state) => {
        if (state.name == this.state_name && state.code == this.state_code) {
          alert("State Already exist");
          count++;
          return;
        }
      });

      if (count == 0) {
        insertNewState = {
          name: this.state_name,
          code: this.state_code,
        };
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
          })
          .catch((e) => {
            console.log("error", e);
          });
      }
    },

    async deleteState() {
      let input = {
        id: this.deleteId,
        permanent_delete: this.permanent_delete,
      };

      await this.$axios
        .post("http://api.quotebuddy.net/api/v1/admin/state/delete", input)
        .catch((e) => {
          console.log("error", e);
        });
      this.$refs["delete-modal"].hide();

      this.getState();
    },
  },
};
</script>

<style>
</style>