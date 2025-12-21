<script setup lang="ts">
    import { ref, watch } from 'vue';

    const props = defineProps<{
        qrcode: string
    }>()

    const dialog = ref<HTMLDialogElement | null>(null);
    const minutes = ref(2);
    const seconds = ref(0);
    const valid = ref(true);
    let intervalCode: number | undefined = undefined;


    // Quando viene aggiornata il QR
    watch(() => props.qrcode, () => {
        dialog.value!.showModal();

        minutes.value = 2;
        seconds.value = 0;
        valid.value = true;
        intervalCode = setInterval(() => {
            if(minutes.value == 0 && seconds.value == 0){
                clearTimer();
                invalidated();
            }

            if(seconds.value == 0) {
                minutes.value--;
                seconds.value = 59;
            }else{
                seconds.value--;
            }
        }, 1000);
    });

    function clearTimer() {
        clearInterval(intervalCode);
    }

    function invalidated(){
        valid.value = false;
    }
</script>

<template>
    <dialog class="modal" ref="dialog" @close="clearTimer">
        <div class="modal-box flex justify-center flex-col">
            <div v-if="valid" class="flex flex-col">
                <span class="text-2xl">{{ $t("shop.validita") }}</span>
                <span class="countdown text-2xl font-mono!">
                    <span style="--digits:2" class="font-mono!" :style="'--value: ' + minutes"></span>
                    :
                    <span style="--digits: 2;" class="font-mono!" :style="'--value: ' + seconds"></span>
                </span>
                <img :src="qrcode" alt="">
                <p class="py-4">{{ $t("shop.qrcode.mostraACliente") }}</p>
            </div>
            <div v-else>
                <span class="text-2xl text-red-500">{{ $t("shop.scaduto") }}</span>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn">{{ $t("button.chiudi") }}</button>
                </form>
            </div>
        </div>
    </dialog>
</template>