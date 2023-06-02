<script setup>
import { Popover, PopoverPanel } from '@headlessui/vue'
</script>

<template>
  <div>
    <Popover class="relative">
      <PopoverPanel class="absolute z-10 w-screen max-w-xs px-4 mt-3 sm:px-0 lg:max-w-sm" static>
        <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <slot></slot>
        </div>
      </PopoverPanel>
    </Popover>
  </div>
</template>
