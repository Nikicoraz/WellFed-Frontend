<script setup>
    import { ref } from "vue"
    const dialog = ref(null)

    function open() {
        dialog.value?.showModal()
    }

    function close() {
        dialog.value?.close()
    }
defineExpose({ open, close }) // permette ad altri componenti di richiamare open()
</script>

<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box">
        <button class="btn" @click="close()">Chiudi</button>
    </div>
  </dialog>
</template>
