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
  <FormKit type="form" @submit="handleSubmit" :actions="false">
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
    <footer class="flex items-center justify-between">
      <button
        type="submit"
        class="text-center uppercase rounded-lg btn text-rose-500 hover:bg-rose-600 hover:text-zinc-50">delete</button>
      <button
        type="submit"
        class="text-center uppercase transition-colors bg-indigo-700 rounded-lg btn text-slate-50 hover:bg-slate-50 hover:text-indigo-700">save</button>
    </footer>
  </FormKit>
</template>