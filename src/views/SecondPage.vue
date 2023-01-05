<template>
  <div>
    <div class="card-filter-section">
      <div class="d-flex align-items-center flex-wrap justify-content-between">
        <div class="d-flex align-items-center flex-wrap justify-content-start">
          <p class="filter-title mb-0">Filters:</p>
          <div class="w-lg-100">
            <div class="main-section-customdrop">
              <div class="d-flex">
                <MultiSelectDropdown
                  label="Project Type"
                  v-model="searchProject"
                  icon="edit-2"
                  :options="projectTypeList"
                  multiple
                ></MultiSelectDropdown>
                <MultiSelectDropdown
                  label="Status"
                  v-model="searchStatus"
                  multiple
                  :options="projectStatusList"
                ></MultiSelectDropdown>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <div class="position-relative mr-2 search-250">
            <b-form-input
              ref="search"
              id="input-valid"
              v-model="searchInp"
              placeholder="Search by Project Name."
            />
            <b-input-group-append is-text @click="searchActive">
              <feather-icon icon="SearchIcon" />
            </b-input-group-append>
          </div>
          <b-button variant="warning" class="mr-1" @click="applyFiltter">
            Apply Filter
          </b-button>
          <b-button variant="outline-warning" class="mr-1" @click="allClear()">
            Clear
          </b-button>
        </div>
      </div>
    </div>
    <b-row>
      <b-col
        sm="4"
        class="mb-2"
        v-for="(project, index) in projects"
        :key="index"
      >
        <PrjectCard
          :projectname="project.name"
          :projectDiscription="project.description"
          :projectType="project.type"
          :projectStatus="project.status"
          :startDate="project.estimated_start_date"
          :endDate="project.estimated_end_date"
          :actualStartDate="project.actual_start_date"
          :actualEndDate="project.actual_end_date"
          :totalTimeSpent="project.time_spent_minutes"
          :projectScope="project.project_scopes"
          :projectUsers="project.project_user"
          :maxTimePlanned="project.time_estimated"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "@/axios/axios";
import ProjectsData from "../../src/ProjectsData.json";
import MultiSelectDropdown from "../components/MultiSelectDropdown.vue";
import {
  BCard,
  BButton,
  BRow,
  BCol,
  VBTooltip,
  BBadge,
  BDropdown,
  BDropdownItem,
  BFormInput,
  BInputGroupAppend,
  BFormCheckbox,
} from "bootstrap-vue";
import PrjectCard from "../components/ProjectCard.vue";
export default {
  data() {
    return {
      token:null,
      projects: [],
      searchStatus: [],
      searchProject: [],
      searchInp: null,
      options: [
        {
          name: "",
          value: "",
        },
      ],
      searchProject: [],
      projectTypeList: [
        { label: "Dedicated", value: "dedicated", color: "#23BC74" },
        { label: "Fix cost", value: "fix_cost", color: "#F96E6F" },
        { label: "Fix timeline", value: "fix_timeline", color: "#F9A353" },
        { label: "Hourly", value: "hourly", color: "#478BFF" },
      ],
      projectStatusList: [
        { label: "In Planning", value: "in_planning" },
        { label: "In Progress", value: "in_progress" },
        { label: "On Hold", value: "on_hold" },
        { label: "In Support", value: "in_support" },
        { label: "Completed", value: "completed" },
      ],
    };
  },
  mounted() {
    var data = ProjectsData.projects;
    this.projects = data;
  },
  components: {
    PrjectCard,
    BCard,
    BButton,
    BRow,
    BCol,
    VBTooltip,
    BBadge,
    BDropdown,
    BDropdownItem,
    BFormInput,
    BInputGroupAppend,
    MultiSelectDropdown,
    BFormCheckbox,
  },
  watch: {
    searchInp(nv) {
      this.projects = ProjectsData.projects.filter(function (val) {
        return val.name.toUpperCase().indexOf(nv.toUpperCase()) !== -1;
      });
    },
  },
  methods: {
    
    allClear() {
      console.log("clear called");
      this.searchProject = [];
      this.searchStatus = [];
    },
    applyFiltter() {
      this.projects.filter(function (val) {
        console.log("val", val.type);
        // return this.search.indexOf(val.type) !== -1;
      });
    },
    searchActive() {
      this.$refs.search.focus();
    },
  },
};
</script>

<style>
.search-250 {
  width: 250px;
}
.card-filter-section {
  background-color: #fff;
  margin: 10px 0 25px 0;
  box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);
  padding: 12px 15px;
}
.filter-title {
  color: #5e5873;
  font-size: 18px;
  font-weight: 500;
}
.main-section-customdrop {
  position: relative;
}
.dropdown-custom button {
  background: transparent !important;
  border: transparent !important;
  color: #67617a !important;
}
.dropdown-custom button:active {
  background: transparent !important;
  border: transparent !important;
  color: #67617a !important;
}
.dropdown-custom button:focus {
  background: transparent !important;
  color: #67617a !important;
}
.dropdown-custom button:hover {
  background: transparent !important;
  color: #67617a !important;
  box-shadow: none !important;
}
.input-group-text {
  border: transparent;
  background: transparent;
}
.input-group-append {
  position: absolute;
  right: 0;
  top: 5px;
}
</style>
