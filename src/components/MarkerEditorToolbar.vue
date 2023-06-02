<script setup>
const emit = defineEmits(['close', 'edit'])

defineProps({
  title: {
    type: String,
    default: '',
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section class="px-4 py-5 bg-gray-50 dark:bg-zinc-800">
    <header class="flex items-center justify-between">
      <h2 class="text-sm font-medium ">
        <template v-if="isEdit">Active point: {{ title }}</template>
        <template v-else>New point</template>
      </h2>
      <div class="flex items-center space-x-1">
        <button
          class="p-2 text-xs font-bold uppercase rounded hover:bg-slate-200 dark:hover:text-zinc-900"
          type="button"
          @click="isEdit ? emit('edit') : emit('add')">
          {{ isEdit ? 'Edit' : 'Create' }}
        </button>
        <button
          class="p-2 font-bold uppercase rounded hover:bg-slate-200 dark:hover:text-zinc-900"
          type="button"
          @click="emit('highlight')">
          <i class="scale-75 gg-assign"></i>
        </button>
        <button
          class="p-2 rounded hover:bg-slate-200 dark:hover:text-zinc-900"
          type="button"
          @click="emit('close')">
          <i class="gg-close"></i>
        </button>
      </div>
    </header>
  </section>
</template>
