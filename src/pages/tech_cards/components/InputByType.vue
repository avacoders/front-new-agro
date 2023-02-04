<template>
  <div>
    <template v-if="type === 'textarea'">
      <v-textarea outlined dense v-model="modelValue"></v-textarea>
    </template>
    <template v-if="type === 'date'">
      <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              v-model="date"
              label="Танланг"
              outlined
              dense
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
            v-model="date"
            no-title
            @input="menu = false"
        ></v-date-picker>
      </v-menu>
    </template>
    <template v-if="type === 'number'">
      <v-text-field outlined dense v-model="modelValue" type="number"></v-text-field>
    </template>
    <template v-if="type === 'select'">
      <v-select
          v-model="modelValue"
          :items="options"
          label="Танланг"
          outlined
          dense
      ></v-select>
    </template>
  </div>
</template>

<script>
export default {
  name: "InputByType",
  data() {
    return {
      modelValue: this.value,
      date: null,
      menu: false,
    }
  },
  computed: {},
  props: {
    value: {

      default: '',
      required: true
    },
    item: {
      type: Object,
      default: () => {
      }
    },
    index: {
      type: Number,
      default: 0
    },
    phase: {
      type: Number,
      default: 0
    },
    options: {
      type: Array,
      default: () => [],
      required: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(value) {
      this.modelValue = value
      this.date = value
    },
    modelValue(value) {
      this.$emit('input', value.toString())
    },
    date(value) {
      if (value)
        this.$emit('input', value.toString())
    }
  },
}
</script>

<style scoped>

</style>