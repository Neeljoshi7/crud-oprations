<template>
  <div class="h-100">
    <b-card class="newproject-card mb-0 h-100">
      <div
        class="
          d-flex
          align-items-center
          newproject-timeline-section
          justify-content-between
        "
      >
        <b-badge
          pill
          class="newproject-card-timeline"
          :class="
            projectType == 'fix_cost'
              ? 'fixcost'
              : projectType == 'fix_timeline'
              ? 'fixtimeline'
              : projectType == 'hourly'
              ? 'hourly'
              : 'dedicated'
          "
        >
          {{
            projectType == "fix_cost"
              ? "Fix Cost"
              : projectType == "fix_timeline"
              ? "Fix Timeline"
              : projectType == "hourly"
              ? "Hourly"
              : "Dedicated"
          }}
        </b-badge>
        <b-badge
          class="newproject-card-status"
          :class="
            projectStatus == 'in_progress'
              ? 'p-inprogress'
              : projectStatus == 'in_planning'
              ? 'p-inplanning'
              : projectStatus == 'on_hold'
              ? 'p-onhold'
              : projectStatus == 'in_support'
              ? 'p-insupport'
              : 'p-completed'
          "
        >
          {{
            projectStatus == "in_progress"
              ? "In Progress"
              : projectStatus == "in_planning"
              ? "In Planning"
              : projectStatus == "on_hold"
              ? "On Hold"
              : projectStatus == "in_support"
              ? "In Support"
              : "Completed"
          }}
        </b-badge>
      </div>
      <div class="newproject-title-section">
        <p class="newproject-title">
          {{ projectname }} -
          <span>{{
            projectType == "fix_cost"
              ? "Fix Cost"
              : projectType == "fix_timeline"
              ? "Fix Timeline"
              : projectType == "hourly"
              ? "Hourly"
              : "Dedicated"
          }}</span>
        </p>
        <p
          class="newproject-des"
          v-b-tooltip.hover.bottom
          :title="projectDiscription"
        >
          {{ projectDiscription }}
        </p>
      </div>
      <b-row style="min-height: 100px">
        <b-col cols="6" class="pr-0">
          <p class="newproject-scop-member">Project Scope</p>
          <div>
            <b-badge
              v-for="(scope, index) in projectScope"
              :key="index"
              class="newproject-card-tag"
            >
              <span class="tag_name">{{ scope.name }}</span>
            </b-badge>
          </div>
        </b-col>
        <b-col cols="6" class="text-right">
          <p class="newproject-scop-member">Members</p>
          <div class="d-flex justify-content-end">
            <b-avatar-group size="32px">
              <b-avatar
                v-for="(users, index) in projectUsers"
                v-b-tooltip.hover
                :key="index"
                class="pull-up newproject-avatar"
                :src="users.users.picture"
                :title="users.users.full_name"
              ></b-avatar>
            </b-avatar-group>
          </div>
        </b-col>
      </b-row>
      <b-row class="newproject-date-section">
        <b-col cols="6" class="pr-0">
          <p class="newproject-scop-member">Expected Timeline</p>
          <p class="newproject-timeline-date">
            <span>{{ projectDate(startDate) }}</span>
            <span class="line"> - </span>
            <span>{{ projectDate(endDate) }}</span>
          </p>
        </b-col>
        <b-col cols="6" class="text-right">
          <p class="newproject-scop-member">Actual Timeline</p>
          <p class="newproject-timeline-date actual-time">
            <span>{{ projectDate(actualStartDate) }}</span>
            <span class="line"> - </span>
            <span>{{ projectDate(actualEndDate) }}</span>
          </p>
        </b-col>
      </b-row>
      <b-row class="newproject-date-section" style="flex: 1">
        <b-col cols="7">
          <div class="d-flex align-items-center flex-wrap">
            <div class="total-spent time-log-section">
              <p class="userhour-log card-userlog">Time Spent</p>
              <p class="user-totalhour">{{ NumToTime(totalTimeSpent) }}</p>
            </div>
            <div class="total-spent">
              <p class="userhour-log card-userlog">Time Billable</p>
              <p class="user-totalhour">00:00</p>
            </div>
          </div>
        </b-col>
        <b-col cols="5">
          <div
            class="total-spent"
            :class="
              totalTimeSpent > maxTimePlanned * 60
                ? 'maxTime-log'
                : 'minTime-log'
            "
          >
            <!-- :class="
              projectDtl.time_spent_minutes > projectDtl.time_estimated * 60
                ? 'maxTime-log'
                : 'minTime-log'
            " -->
            <p class="userhour-log card-userlog">Max Time Planned</p>
            <p class="user-totalhour">{{ NumToTime(maxTimePlanned) }}</p>
          </div>
        </b-col>
      </b-row>

      <!-- <b-row class="newproject-knowmore-button">
          <b-col cols="12"> -->
      <div class="newproject-knowmore-button">
        <button class="w-100 project-knowmore">Know More</button>
      </div>
      <!-- </b-col>
        </b-row> -->
    </b-card>
  </div>
</template>

<script>
import ProjectsData from "../../src/ProjectsData.json";
import {
  BCard,
  BButton,
  BRow,
  BCol,
  VBTooltip,
  BBadge,
  BAvatarGroup,
  BAvatar,
  BTooltip,
} from "bootstrap-vue";
import axios from "../axios/axios.js";
export default {
  components: {
    BCard,
    BButton,
    BRow,
    BCol,
    VBTooltip,
    BTooltip,
    BBadge,
    BAvatarGroup,
    BAvatar,
  },
  data() {
    return {
      projects: [],
    };
  },
  directives: {
    "b-tooltip": VBTooltip,
  },
  props: {
    projectname: String,
    projectDiscription: String,
    projectType: String,
    projectStatus: String,
    startDate: String,
    endDate: String,
    actualStartDate: String,
    actualEndDate: String,
    totalTimeSpent: Number,
    projectScope: Array,
    projectUsers: Array,
    maxTimePlanned: Number,
  },
  mounted() {
    // var data = ProjectsData.projects;
    // this.projects = data;
    this.projectDate();
  },
  methods: {
    projectDate(value) {
      if (value) {
        let val = this.$moment(value).format("MMM DD, YYYY");
        return val;
      }
    },
    NumToTime(num) {
      var hours = Math.floor(num / 60);
      var minutes = num % 60;
      if (minutes + "".length < 10 && hours + "".length < 10) {
        minutes = "0" + minutes;
        hours = "0" + hours;
      }
      if (minutes == "0") {
        minutes == "00";
      }
      return hours + ":" + minutes;
    },
  },
};
</script>

<style lang="scss" scoped>
$rem: 8px;
.project-card {
  border-radius: 5px;
  h3 {
    font-weight: 600;
    cursor: pointer;
    display: inline-block;
    width: 280px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    font-size: 2.2 * $rem;
    text-transform: capitalize;
    // line-height:30px;
    margin-bottom: 0;
    color: #15244c !important;
  }
}
.project-detail {
  .project-detail-value {
    line-height: 30px !important;
    font-size: 1.5 * $rem !important;
    font-weight: 600 !important;
    color: #6e6b7b !important;
  }
}
.project_summary {
  min-height: 50px;
  justify-content: center;
  border-bottom: 1px solid #d9d9d9;
  span {
    font-size: 14px;
  }
}
.tooltip-inner {
  background-color: #5e5873 !important;
  font-weight: 500;
}
.timeline-hour {
  font-size: 1.5 * $rem !important;
  font-weight: 500 !important;
  color: #888888 !important;
}
.chart-footer {
  font-weight: 600;
  font-size: 2 * $rem;
}
.project-status {
  color: #2178fb;
  text-transform: capitalize;
  margin-left: 10px;
  font-size: 12px;
  letter-spacing: 0.3px;
  font-weight: 600;
  padding: 6px 10px;
  background-color: rgba(33, 120, 251, 0.2);
}
// new card css
.newproject-card {
  // width: 600px;
  padding: 24px;
  border-radius: 6px;
  // min-height: 535px;
  .card-body {
    padding: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    .newproject-timeline-section {
      margin-bottom: 16px;
      .newproject-card-timeline {
        font-size: 1.5 * $rem;
        font-weight: 600;
        line-height: 18px;
        padding: 2px 10px;
        color: #fff;
        &.dedicated {
          background-color: green;
        }
        &.fixcost {
          background-color: #f96e6f;
        }
        &.fixtimeline {
          background-color: #f9a353;
        }
        &.hourly {
          background-color: #478bff;
        }
      }
    }
    .newproject-card-status {
      color: #888888;
      font-size: 1.5 * $rem;
      font-weight: 500;
      padding: 5px 9px;
      line-height: 18px;
      border-radius: 4px;
      &.p-inprogress {
        background-color: rgba(35, 184, 114, 0.22);
      }
      &.p-inplanning {
        background-color: rgba(255, 159, 67, 0.26);
      }
      &.p-insupport {
        background-color: rgba(251, 83, 98, 0.2);
      }
      &.p-completed {
        background-color: gray;
      }
    }
  }
  .newproject-title-section {
    margin-bottom: 24px;
    .newproject-title {
      color: #5e5873;
      font-size: 2.25 * $rem;
      font-weight: 600;
      line-height: 28px;
    }
    .newproject-des {
      color: #000;
      font-size: 1.5 * $rem;
      font-weight: 400;
      line-height: 20px;
      display: -webkit-box;
      height: 40px;

      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      &::first-letter {
        text-transform: uppercase;
      }
    }
  }

  .newproject-avatar {
    margin: 0px 9px 6px 0;
    height: 34px;
    width: 34px;
    border: 0px solid transparent;
  }
  .newproject-date-section {
    margin-top: 26px;
    .newproject-timeline-date {
      color: #5e5873;
      font-size: 1.5 * $rem;
      font-weight: 500;
    }
  }
  &.actual-time {
    color: #5e5873;
  }
}
.newproject-scop-member {
  color: #b9b9c3;
  text-transform: uppercase;
  font-size: 1.5 * $rem;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.6px;
}
.newproject-card-tag {
  font-size: 1.125 * $rem;
  font-weight: 600;
  line-height: 22px;
  padding: 1px 9px;
  color: red;
  border-radius: 4px;
  background-color: rgb(251, 83, 98);
  margin: 0 4px 9px 0;
  position: relative;

  &::before {
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 100%;
    z-index: inherit;
    display: block;
  }
  .tag_name {
    position: relative;
    z-index: initial;
  }
}
.project-knowmore {
  border: transparent;
  background-color: #7367f0;
  padding: 10px 0px;
  border-radius: 5px;
  color: #fff;
  margin: 0 auto;
  font-size: 1.75 * $rem;
  font-weight: 500;
  margin-top: 30px;
}
.total-spent {
  background-color: #f8f8f8;
  border-radius: 6px;
  padding: 10px;
  .userhour-log {
    font-weight: 400;
    font-size: 1.75 * $rem;
    line-height: 21px;
    text-align: center;
    color: #99989d;
    &.card-userlog {
      font-size: 1.5 * $rem !important;
    }
  }
  .user-totalhour {
    text-align: center;
    color: #5e5873;
    font-size: 1.75 * $rem;
    font-weight: 500;
    letter-spacing: 0.4px;
    padding: 0 0 5px 0;
  }

  &.time-log-section {
    margin-right: 20px;
    @media all and (max-width: 1440px) {
      margin-bottom: 5px;
    }
    @media all and (max-width: 1199px) {
      margin-bottom: 0px;
    }
  }
  &.minTime-log {
    background-color: rgba(35, 184, 114, 0.09);
    padding: 10px 10px;
    .userhour-log {
      font-weight: 400;
      font-size: 1.75 * $rem;
      line-height: 21px;
      text-align: center;
      color: #99989d;
    }
  }
}
.tooltip-inner {
  max-width: 400px !important;
}
.b-tooltip {
  top: -5px !important;
}
.tooltip {
  z-index: inherit !important;
}
.maxTime-log {
  background-color: rgba(234, 84, 85, 0.12) !important;
  // padding: 10px 12px !important;
}
</style>
