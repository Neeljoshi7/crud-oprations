<template>
  <div>
    <SidebarForm
      :isActive="sideForm"
      @closeSidebar="sideForm = !sideForm"
      :nameValue="editEmployeeData.name"
      :salaryValue="editEmployeeData.salary"
      :ageValue="editEmployeeData.age"
      :contactValue="editEmployeeData.phoneNo"
      :addressValue="editEmployeeData.address"
      :submitButton="submitBtn"
      :cancelButton="cancelBtn"
      :formTitle="formTitle"
    >
      <template #body>
        <!-- {{ editEmployeeData.name }} -->
        <b-form class="p-2">
          <b-form-group
            label="Employee Full Name"
            label-for="employee-full-name"
          >
            <b-form-input
              id="employee-full-name"
              autofocus
              trim
              placeholder="Neel Joshi"
              :value="editEmployeeData.name"
            />
          </b-form-group>
          <b-form-group label="Salary" label-for="salary">
            <b-form-input
              type="number"
              id="salary"
              autofocus
              trim
              placeholder="0"
              :value="editEmployeeData.salary"
            />
          </b-form-group>
          <b-form-group label="Age" label-for="age">
            <b-form-input
              type="number"
              id="age"
              autofocus
              :value="editEmployeeData.age"
              trim
              placeholder="0"
            />
          </b-form-group>
          <b-form-group label="Phone No." label-for="phoneNo">
            <b-form-input
              type="number"
              id="phoneNo"
              autofocus
              :value="editEmployeeData.phoneNo"
              trim
              placeholder="0"
              readonly
            />
          </b-form-group>
          <b-form-group label="Address" label-for="address">
            <b-form-input
              type="text"
              id="address"
              autofocus
              :value="editEmployeeData.address"
              trim
              placeholder="0"
            />
          </b-form-group>
          <b-form-group label="Upload Image" label-for="image">
            <b-form-file
              accept="image"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
            >
            </b-form-file>
          </b-form-group>
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
              <b-button variant="primary" @click="addNewEmployee">
                <span class="text-nowrap">Add Employee</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="employees"
        :per-page="perPage"
        :current-page="currentPage"
        :fields="fields"
        hover
      >
        <template #cell(name)="employees">
          <div class="d-flex">
            <b-avatar size="md" :src="employees.item.imageUrl" />
            <h5 class="mb-0 d-flex align-items-center mx-1">
              {{ employees.item.firstName + " " + employees.item.lastName }}
            </h5>
          </div>
        </template>
        <template #cell(actions)="employee">
          <feather-icon
            class="ml-1 cursor-pointer text-success"
            icon="Edit2Icon"
            @click="editEmployee(employee.item)"
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
      <b-card-text> Do you really want to delete ? </b-card-text>
      <template #modal-footer>
        <div class="w-100">
          <b-button variant="danger" size="md" class="float-right">
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
  BModal,
  BPagination,
} from "bootstrap-vue";
import SidebarForm from "@/components/SidebarForm.vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BForm,
    BTable,
    BMedia,
    BModal,
    BFormGroup,
    BFormFile,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,

    SidebarForm,
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      editEmployeeData: {
        name: "",
        salary: null,
        age: null,
        phoneNo: null,
        address: null,
      },
      perPage: 5,
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
          key: "salary",
          label: "Salary",
        },
        {
          key: "age",
          label: "Age",
        },
        {
          key: "contactNumber",
          label: "Phone No.",
        },
        {
          key: "address",
          label: "Address",
        },
        {
          key: "actions",
          label: "Actions",
          tdClass: "text-right",
          thClass: "text-right",
        },
      ],
      formTitle: "Add new employee",
      submitBtn: null,
      cancelBtn: null,
      currentPage: 1,
      employees: [],
      sideForm: false,
    };
  },
  mounted() {
    this.hello();
    this.callApi();
  },
  computed: {
    rows() {
      return this.employees.length;
    },
  },
  methods: {
    editEmployee(employee) {
      console.log("employee", employee);
      this.formTitle = "Edit employee details";
      this.editEmployeeData = {
        name: employee.firstName + " " + employee.lastName,
        salary: employee.salary,
        age: employee.age,
        phoneNo: employee.contactNumber,
        address: employee.address,
      };
      this.sideForm = !this.sideForm;
      this.submitBtn = "Save Changes";
      this.cancelBtn = "Discard Changes";
    },
    addNewEmployee() {
      this.sideForm = !this.sideForm;
      this.formTitle = "Add new employee";
      this.submitBtn = "Add Employee";
      this.cancelBtn = "Cancel";
      this.editEmployeeData = {
        name: "",
        salary: null,
        age: null,
      };
    },
    async callApi() {
      this.$axios
        .get("https://hub.dummyapis.com/employee?noofRecords=10&idStarts=1001")
        .then((response) => {
          console.log("response", response.data);
          this.employees = response.data;
        })
        .catch((e) => {
          console.log("HERR");
        });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>