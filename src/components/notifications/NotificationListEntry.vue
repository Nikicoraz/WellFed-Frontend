<script setup lang="ts">
    const props = defineProps(['notification']);
    const emits = defineEmits(['showNotificationDetails']);
</script>

<template>
    <div v-if="props.notification" class="card card-side bg-base-100 shadow-sm m-4 cursor-pointer" @click="$emit('showNotificationDetails', notification)">
        <div class="card-body indicator rounded-md p-2">
            <span v-if="!props.notification.viewed" class="indicator-item status status-success"></span>
            <div class="card-title text-black text-md">{{ props.notification.title }}</div>
        </div>
    </div>
</template>