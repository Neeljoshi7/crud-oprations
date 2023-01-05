<template>
  <div>
    <b-sidebar
      id="add-new-user-sidebar"
      :visible="isActive"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      no-header
      backdrop
      right
    >
      <template #default>
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 class="mb-0">{{ formTitle }}</h5>

          <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="$emit('closeSidebar')"
          />
        </div>

        <slot name="body"> </slot>
        <!-- <b-form class="p-2">
          <b-form-group
            label="Employee Full Name"
            label-for="employee-full-name"
          >
            <b-form-input
              id="employee-full-name"
              autofocus
              trim
              placeholder="Neel Joshi"
              :value="nameValue"
            />
          </b-form-group>
          <b-form-group label="Salary" label-for="salary">
            <b-form-input
              type="number"
              id="salary"
              autofocus
              trim
              placeholder="0"
              :value="salaryValue"
            />
          </b-form-group>
          <b-form-group label="Age" label-for="age">
            <b-form-input
              type="number"
              id="age"
              autofocus
              :value="ageValue"
              trim
              placeholder="0"
            />
          </b-form-group>
          <b-form-group label="Phone No." label-for="phoneNo">
            <b-form-input
              type="number"
              id="phoneNo"
              autofocus
              :value="contactValue"
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
              :value="addressValue"
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
        </b-form> -->

        <!-- Form Actions -->
        <!-- <div class="d-flex m-2">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-2 w-50"
            type="submit"
          >
            {{ submitButton }}
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="button"
            variant="outline-secondary"
            @click="$emit('closeSidebar')"
            class="w-50"
          >
            {{ cancelButton }}
          </b-button>
        </div> -->
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormFile,
  BFormInvalidFeedback,
  BButton,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormFile,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    contactValue: String,
    addressValue: String,
    submitButton: String,
    cancelButton: String,
    formTitle: String,
    nameValue: String,
    salaryValue: Number,
    ageValue: Number,
  },
  mounted() {},
  methods: {
    submit() {
      this.$emit("closeSidebar");
    },
  },
};
</script>

<style>
</style>