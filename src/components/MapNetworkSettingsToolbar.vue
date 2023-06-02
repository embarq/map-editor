<script setup>
defineProps({
  showNetwork: Boolean
})
const emit = defineEmits(['update'])

const handleShowNetworkUpdate = (event) => {
  emit('update', { showNetwork: event })
}
</script>

<template>
  <footer class="flex items-center h-20 p-4 m-0 bg-gray-50 dark:bg-zinc-800" id="MapNetworkSettingsToolbar">
    <FormKit
      type="checkbox"
      label="Show network"
      name="showNetwork"
      :value="showNetwork"
      :classes="{
        outer: 'MapNetworkSettingsToolbarFormOuter'
      }"
      @input="handleShowNetworkUpdate"
    />
  </footer>
</template>

<style>
#MapNetworkSettingsToolbar .MapNetworkSettingsToolbarFormOuter {
  margin: 0;
}
</style>