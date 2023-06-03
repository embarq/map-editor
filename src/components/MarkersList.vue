<script setup>
import { computed, toRefs } from 'vue'

/**
* @typedef {{id?: string;point: [number, number];title: string;}} MarkerPoint
*/

const emit = defineEmits(['edit', 'highlight', 'delete'])
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const rprops = toRefs(props)

const displayData = computed(() => {
  return rprops.data.value?.map((item) => {
    return {
      ...item,
      lat: item.point[0],
      lng: item.point[1]
    }
  })
})
</script>

<template>
  <ul class="flex flex-col gap-2">
    <li
      v-for="item in displayData" :key="item.id"
      @mouseover="emit('highlight', item)"
      class="flex flex-col py-2 border-t border-slate-300 first-of-type:border-0 dark:border-zinc-700">
      <h3 class="flex items-center justify-between text-sm font-bold">
        {{ item.title }}
        <span class="flex space-x-1">
          <button
            @click="emit('edit', item)"
            type="button"
            class="p-2 text-xs uppercase transition-colors rounded hover:bg-slate-200 dark:hover:text-zinc-900">
            edit
          </button>
          <button
            @click="emit('delete', item)"
            type="button"
            class="px-3 py-2 text-xs transition-colors rounded hover:bg-slate-200 dark:hover:text-zinc-900">
            <i class="scale-75 gg-trash translate-y-[-0.05rem]"></i>
          </button>
          <button
            @click="emit('zoomInToMarker', item)"
            type="button"
            class="px-3 py-2 text-xs transition-colors rounded hover:bg-slate-200 dark:hover:text-zinc-900">
            <i class="scale-75 gg-assign"></i>
          </button>
        </span>
      </h3>
      <p class="text-xs">
        Lat.
        <span class="font-mono text-gray-700 dark:text-zinc-400">{{ item.lat }}</span>
      </p>
      <p class="text-xs">
        Lng.
        <span class="font-mono text-gray-700 dark:text-zinc-400">{{ item.lng }}</span>
      </p>
    </li>
  </ul>
</template>