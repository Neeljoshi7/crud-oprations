<template>
  <div>
    <SidebarForm
      :isActive="countySidebar"
      @closeSidebar="countySidebar = !countySidebar"
      :formTitle="titleForm"
    >
      <template #body>
        <b-form class="p-2">
          <b-form-group label="County Name" label-for="county-name">
            <b-form-input
              id="county-name"
              v-model="county_name"
              autofocus
              trim
              placeholder="ex. Ahmedabad"
            />
          </b-form-group>
          <label for="">Select State</label>
          <b-form-select
            v-model="stateSelected"
            :options="allStates"
            class="mb-3"
          />
          <div v-if="addCounty == true">
            <b-button
              variant="outline-primary"
              size="md"
              class="float-right"
              @click="countySidebar = !countySidebar"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              size="md"
              class="float-right mr-1"
              @click="addNewCounty"
            >
              Add County
            </b-button>
          </div>

          <div v-else>
            <b-button
              variant="outline-primary"
              size="md"
              class="float-right"
              @click="countySidebar = !countySidebar"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              size="md"
              class="float-right mr-1"
              @click="editSubmitCounty"
            >
              Edit county
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
                  ((countySidebar = !countySidebar), (addCounty = true)),
                    (titleForm = 'Add County'),
                    ((county_name = null), (stateSelected = null))
                "
              >
                <span class="text-nowrap">Add New County</span>
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
        :items="allCounties"
        :per-page="perPage"
        :current-page="currentPage"
        :fields="fields"
        hover
      >
        <template #cell(actions)="states">
          <feather-icon
            class="ml-1 cursor-pointer text-success"
            icon="Edit2Icon"
            @click="editCounties(states.item)"
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
      ref="delete-modal"
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
            @click="deleteCounty()"
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
BCardText;
import {
  BCard,
  BRow,
  BCol,
  BCardText,
  BButton,
  BTable,
  BForm,
  BFormGroup,
  BFormFile,
  BFormSelect,
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
    BCardText,
    BFormCheckbox,
    BFormFile,
    BFormInput,
    BFormSelect,
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
      stateSelected: null,
      state_id: null,
      deleteId: null,
      county_name: null,
      permanent_delete: false,
      selectOption: 3,
      options: [
        { text: "A to Z", value: 1 },
        { text: "Z to A", value: 2 },
        { text: "Most Recent", value: 3 },
      ],
      countySidebar: false,
      addCounty: false,
      allCounties: null,
      allStates: null,
      duplicateCounties: null,
      titleForm: null,
      perPage: 10,
      currentPage: 1,
      showEntries: [5, 10, 20, 30, 40],
      fields: [
        {
          key: "name",
          label: "County Name",
        },
        {
          key: "state.name",
          label: "State",
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
      this.allCounties = this.duplicateCounties.filter(function (val) {
        return val.name.toUpperCase().indexOf(nv.toUpperCase()) !== -1;
      });
    },
    selectOption(so) {
      if (so) {
        if (so == 1) {
          var abcd = this.allCounties.sort((a, b) => {
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
          this.allCounties.sort((a, b) => {
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
          this.allCounties.sort((a, b) => {
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
    this.getCounty();
    this.getState();
  },
  computed: {
    rows() {
      return this.allCounties?.length;
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
        //   console.log("state_data", state_data);
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
    async getCounty() {
      let obj = localStorage.getItem("access_token");
      this.token = obj;
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + obj;
      await this.$axios
        .post("http://api.quotebuddy.net/api/v1/admin/county/list")
        .then((response) => {
          let county_data = response.data.data.county;
          county_data.forEach((element) => {
            element.text = element.name;
            // console.log("Neel", element);
          });
          this.allCounties = county_data;
          this.duplicateCounties = county_data;
        //   console.log("all Counties", this.allCounties);
        })
        .catch((e) => {
          console.log("error", e);
        });
    },

    addNewCounty() {
      this.callCreateCountyApi();
    },
    editCounties(county) {
      this.state_id = county.id;
      this.county_name = county.name;
      this.stateSelected = county.state_id;
      this.countySidebar = !this.countySidebar;
      this.addCounty = false;
      this.titleForm = "Edit County";
    },

    async editSubmitCounty() {
      let input = {
        id: this.state_id,
        name: this.county_name,
        state_id: this.stateSelected,
      };
      await this.$axios
        .post("http://api.quotebuddy.net/api/v1/admin/county/update", input)
        .catch((e) => {
          console.log("error", e);
        });

      this.getCounty();
      this.countySidebar = !this.countySidebar;
    },
    async callCreateCountyApi() {
      this.countySidebar = !this.countySidebar;
      let obj = localStorage.getItem("access_token");
      this.token = obj;
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + obj;

      let insertNewCounty = {
        name: this.county_name,
        state_id: this.stateSelected,
      };

      await this.$axios
        .post(
          "http://api.quotebuddy.net/api/v1/admin/county/create",
          insertNewCounty
        )
        .then((response) => {
          let county_data = response.data.data.counties;
          county_data.forEach((element) => {
            element.value = element.id;
            element.text = element.name;
          });
          this.allCounties = county_data;
        //   console.log("all states", this.allCounties);
        })
        .catch((e) => {
          console.log("error", e);
        });
        this.getCounty();
    },

    async deleteCounty() {
      let input = {
        id: this.deleteId,
        permanent_delete: this.permanent_delete,
      };
      await this.$axios
        .post("http://api.quotebuddy.net/api/v1/admin/county/delete", input)
        .catch((e) => {
          console.log("error", e);
        });
      this.$refs["delete-modal"].hide();
      this.getCounty();
    },
  },
};
</script>
  
  <style>
</style>