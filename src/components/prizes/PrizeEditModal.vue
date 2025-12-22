<script setup lang="ts">
    import { watch, ref } from "vue";
    import type { Ref } from "vue";
    import { validateInputs } from "../../extensions/formValidation";
    import VueCookies  from 'vue-cookies'
    import { useI18n } from "vue-i18n";
    import Alert from "../util/Alert.vue";
    import AlertType from "../../types/alert";
    import ConfirmModal from "../util/ConfirmModal.vue";

    const props = defineProps({
        shopId: String,
        prizeID: String,
        open: Boolean
    });

    const emit = defineEmits(['close', 'productSaved']);

    const prize: Ref<any> = ref<any>(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const cookies = (VueCookies as any);
    const {t} = useI18n();

    const alert = ref<typeof Alert | null>(null);
    const dialog = ref<HTMLDialogElement | null>(null);
    const form = ref<HTMLDivElement | null>(null);

    const name = ref("");
    const description = ref("");
    const points = ref(0);
    const image = ref<HTMLInputElement | null>(null);

    const askModal = ref<typeof ConfirmModal | null>(null); 

    watch(() => props.open, async (open) => {
        if (!dialog.value) {
            return;
        }

        if (open && props.shopId != "" && props.prizeID != "") {
            prize.value = await fetch(`${backendAPI}/shops/${props.shopId}/prizes/${props.prizeID}`)
                .then((res) => { return res.json(); });

            name.value = prize.value.name;
            description.value = prize.value.description;
            points.value = prize.value.points;
            if (image.value) {
                image.value.value = "";
            }
        }

        if (open && prize) {
            dialog.value.show();
        } else {
            dialog.value.close();
        }
    });

    async function updateExistingPrize(data: FormData, token: string){
        await fetch(`${backendAPI}/shops/${props.shopId!}/prizes/${props.prizeID!}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        }).then(e => {
            switch (e.status) {
                case 200:
                    dialog.value!.close();
                    alert.value!.showAlert(AlertType.Success, t("shop.premio.aggiornato"));
                    break;
                default:
                    alert.value!.showAlert(AlertType.Error, e.status + ": " + t("alerts.datiNonValidi"))
                    break;
            }
        }).then(_ => emit('productSaved'));
    }

    function save() {
        if(!validateInputs(form.value!)){
            return
        }

        if(!image.value || !image.value.files) {
            alert.value!.showAlert(AlertType.Error, t("alerts.noimage"));
            return;
        }

        const token = cookies.get("token");
        const file = image.value.files[0];

        const data = new FormData();
        data.append("name", name.value);
        data.append("description", description.value);
        if(file != undefined) {
            data.append("image", file!);
        }

        data.append("points", `${points.value}`);

        updateExistingPrize(data, token);
    }

    function deletePrizeAskConfirm() {
        askModal.value!.ask(t('shop.premio.confermaCancellazione'));
    }

    async function deletePrize() {
        const token = cookies.get("token");

        await fetch(`${backendAPI}/shops/${props.shopId!}/prizes/${props.prizeID!}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(e =>{
            switch (e.status) {
                case 200:
                    dialog.value!.close();
                    alert.value!.showAlert(AlertType.Success, t("shop.premio.cancellato"));
                    break;
                default:
                    alert.value!.showAlert(AlertType.Error, e.status + ":" + t("alerts.errore"));
                    break;
            }
        }).then(_ => { emit('productSaved') });
    }
</script>

<template>
    <dialog ref="dialog" class="modal z-0" @close="$emit('close')" @keyup.esc="dialog?.close()">
        <div v-if="prize" class="modal-box min-w-[40dvw] z-0" ref="box">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-3xl font-bold">{{ prize.name }}</h2>
                    <img
                        class="w-full h-full object-cover rounded-xl"
                        :src="`${backendUrl}${prize.image}`"
                        :alt="prize.name"
                    />
                    <div class="grid grid-cols-2 gap-y-4 my-4 items-center" ref="form">
                        <span class="text-xl label">{{ $t("shop.nome") }}:</span>
                        <input class="input validator" type="text" v-model="name">

                        <span class="text-xl label">{{ $t("shop.descrizione") }}:</span>
                        <textarea class="validator textarea resize-none" v-model="description"></textarea>

                        <span class="text-xl label">{{ $t("shop.punti") }}:</span>
                        <input type="number" min="0" class="input validator" v-model="points">

                        <span class="text-xl label">{{ $t("shop.immagine") }}:</span>
                        <input type="file" class="input file-input validator" accept="image/jpeg, image/png, image/webp" ref="image">
                    </div>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button @click="deletePrizeAskConfirm" class="btn mr-auto bg-red-700 text-white">{{ $t("shop.elimina") }}</button>
                <button class="btn" @click="dialog?.close()">{{ $t("shop.annulla") }}</button>
                <button class="btn bg-lime-700 text-white" @click="save()">{{ $t("shop.salva") }}</button>
            </div>
        </div>
    </dialog>
    <Alert ref="alert" />
    <ConfirmModal @on-yes='deletePrize' ref="askModal" yes-styling="bg-red-700 text-white" />
</template>