<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
  }
})
const emit = defineEmits(['submit'])

const handleSubmit = (e) => {
  const { title, lng, lat } = e
  emit('submit', {
    title,
    lng: parseFloat(lng),
    lat: parseFloat(lat),
    id: props.data?.id,
  })
}
</script>

<template>
  <FormKit type="form" @submit="handleSubmit">
    <FormKit 
      type="text"
      label="Title"
      name="title"
      :value="data?.title"
      validation="required" />
    <FormKit 
      type="number"
      label="Latitude"
      name="lat"
      :value="data?.point[0]"
      step="0.000000000000001"
      validation="required" />
    <FormKit 
      type="number"
      label="Longitude"
      name="lng"
      :value="data?.point[1]"
      step="0.000000000000001"
      validation="required" />
    <!-- <footer>
      <button type="submit"
        class="px-4 py-2 text-sm font-bold text-center uppercase bg-indigo-700 rounded-lg text-slate-50">save</button>
    </footer> -->
  </FormKit>
</template>