<script setup lang="ts">
    import NotificationListModal from './NotificationListModal.vue';
    import { ref } from "vue";
    const showNotificationListModal = ref(false);
</script>

<template>
    <div>
        <button class="btn btn-circle" @click="showNotificationListModal = true">
            <img class="scale-50" src="../../assets/bell.svg" alt=""> 
        </button>
        <NotificationListModal 
            :open="showNotificationListModal" 
            @close="showNotificationListModal = false"
        />
    </div>
</template>