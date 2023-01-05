<template>
  <div v-click-outside="closeDropdown" class="main-section-customdrop">
    <button class="selectmember" type="button" @click="isVisible = !isVisible">
      <b-badge
        href="#"
        pill
        class="badge-pill-filter"
        v-if="localValue && localValue.length"
        >{{ multiple ? localValue.length : 1 }}</b-badge
      >
      <feather-icon v-if="icon" :icon="icon" size="16"></feather-icon>
      <span v-if="label">{{ label }}</span>
      <feather-icon
        icon="XIcon"
        size="14"
        @click="clearValues()"
        v-if="label && localValue && localValue.length"
      ></feather-icon>
      <feather-icon icon="ChevronDownIcon" v-if="label"></feather-icon>
      <b-input-group class="input-group-merge input-merge" v-if="inputselect">
        <b-form-input
          class="inputselect"
          placeholder="Select member"
          :inputselect="inputselect"
        />
        <b-input-group-append is-text>
          <feather-icon class="cursor-pointer" icon="ChevronDownIcon" />
        </b-input-group-append>
      </b-input-group>
    </button>
    <div class="radio-dropdown" v-show="isVisible">
      <div class="main-div">
        <div class="main-sectiondropdown">
          <input
            type="text"
            name="search"
            v-model="search"
            placeholder="Search"
            autocomplete="off"
          />
        </div>
        <hr class="horizontal-line" />
        <div>
          <div class="main-userlist-dropdown">
            <div>
              <ul class="user-dropdown" v-if="optionData.length">
                <li v-for="(option, oindex) in optionData" :key="oindex">
                  <b-form-checkbox
                    v-model="localValue"
                    :value="option.value"
                    v-if="multiple"
                  >
                    <span class="cursor-pointer">{{ option.label }}</span>
                  </b-form-checkbox>
                  <b-form-radio
                    v-model="localValue"
                    :value="option.value"
                    class="custom-control-secondary"
                    v-else
                  >
                    <span class="cursor-pointer">{{ option.label }}</span>
                  </b-form-radio>
                </li>
              </ul>
              <ul class="user-dropdown" v-else>
                <li class="text-center nodata-found">No matching options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { BFormCheckbox, BInputGroup, BBadge } from "bootstrap-vue";
export default {
  name: "customDropdown",
  components: {
    BFormCheckbox,
    BInputGroup,
    BBadge,
  },
  model: {
    event: "change",
  },
  props: {
    icon: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    inputselect: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [Array, String, Number],
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isVisible: false,
      search: null,
    };
  },
  watch: {
    isVisible(nv) {
      if (!nv) {
        this.search = null;
      }
    },
  },
  computed: {
    optionData() {
      if (this.search) {
        let that = this;
        return this.options.filter(function (element, index) {
          return element.label.toLowerCase().match(that.search.toLowerCase());
        });
      }
      return this.options;
    },
    valueString() {
      return this.multiSelect ? this.value.join(", ") : this.value;
    },
    localValue: {
      get() {
        return this.value;
      },
      set(data) {
        this.$emit("change", data);
      },
    },
    multiSelect() {
      return Array.isArray(this.value);
    },
  },
  methods: {
    clearValue() {
      this.localValue = null;
    },
    closeDropdown() {
      this.isVisible = false;
    },
    clearValues() {
      this.isVisible = false;
      this.localValue = this.multiSelect ? [] : null;
    },
  },
  directives: {
    "click-outside": {
      bind: function (el, binding) {
        const bubble = binding.modifiers.bubble;
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };
        el.__vueClickOutside__ = handler;
        document.addEventListener("click", handler);
      },
    },
  },
};
</script>

<style lang="scss">
.selectmember {
  cursor: pointer;
  margin-left: 15px;
  background-color: transparent;
  border-color: transparent;
  color: gray;
  display: flex;
  align-items: center;
  position: relative;
  span {
    font-weight: 500;
    text-transform: capitalize;
    line-height: 23px;
  }
  .feather-edit {
    margin-right: 8px;
  }
  .feather-chevron-down {
    margin-left: 8px;
  }
  .feather-x {
    margin-left: 8px;
  }
  .badge-pill-filter {
    position: absolute;
    top: -12px;
    right: 13px;
    display: flex;
    height: 20px;
    width: 20px;
    align-items: center;
    justify-content: center;
    padding: 0;
    background-color: rgba(255, 159, 67, 0.7);
    &:hover {
      background-color: rgba(255, 159, 67, 0.7);
    }
  }
}
.radio-dropdown {
  position: absolute;
  z-index: 111;
  left: 20px;
  width: 230px;
}

.main-div {
  max-width: 230px;
  background-color: #ffff;
  border-radius: 6px;
  box-shadow: none;
  -webkit-animation-name: slideIn;
  animation-name: slideIn;
  animation-duration: 0.3s;
  -webkit-animation-duration: 0.3s;
  animation-fill-mode: both;
  -webkit-animation-fill-mode: both;
  .main-userlist-dropdown {
    ul {
      padding-left: 0;
      li {
        padding: 12px;
      }
      label {
        color: #6e6b7b !important;
        width: 100%;
        span {
          &::before {
            opacity: 0.36;
          }
        }
      }
    }
    .user-dropdown {
      max-height: 150px;
      overflow-y: auto;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background-color: transparent;

        &::-webkit-scrollbar-track {
          background-color: transparent;
          border-radius: 20px;
        }
      }
      &::-webkit-scrollbar-thumb {
        width: 6px;
        border-radius: 20px;
        background-color: gray;
      }
    }
  }
  input {
    border: 1px solid #d8d6de;
    padding: 8px 15px 8px 15px;
    border-radius: 5px;
    width: 100%;
    z-index: 1;
    color: gray;
    cursor: pointer;
    &::placeholder {
      color: #99989d;
      font-weight: 600;
      line-height: 23px;
      opacity: 1;
    }
    &:focus-visible {
      outline: none;
    }
  }
  .horizontal-line {
    margin: 9px 0px;
  }
  .custom-control-secondary
    .custom-control-input:checked
    ~ .custom-control-label::before {
    opacity: 1;
    cursor: pointer;
    background-color: darkgray !important;
  }
  .main-sectiondropdown {
    padding: 12px 9px 0px 13px;
    ul {
      padding-left: 0;
      li {
        margin-top: 16px;
        label {
          color: gray !important;
          cursor: pointer;
        }
      }
    }
  }
}
.custom-control-secondary
  .custom-control-input:active
  ~ .custom-control-label::before {
  opacity: 0.36;
}
.custom-control-label::before {
  background-color: #efefef;
  border: transparent;
  box-shadow: none !important;
}
.custom-control-input:checked ~ .custom-control-label::before {
  border-color: darkgray;
  background-color: darkgray;
  box-shadow: none !important;
}
.custom-control-input:checked {
  &:focus-visible {
    color: #e0e0e0;
  }
}
.custom-control-input:not(:disabled):active ~ .custom-control-label::before {
  border-color: darkgray;
  background-color: darkgray;
  box-shadow: none !important;
}
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
  border-radius: 3px;
}
.input-group:not(.bootstrap-touchspin):focus-within .input-group-text {
  border-color: blue;
}
.inputselect {
  border: 1px solid transparent;
  display: none;
  padding: 8px 15px 8px 15px;
  border-radius: 5px;
  color: black;

  &:focus {
    outline-color: black;
  }
}
.input-merge {
  max-width: 230px;
}
.main-section-customdrop {
  position: relative;
}
</style>