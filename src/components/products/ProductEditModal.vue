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
        productId: String,
        open: Boolean
    });

    const emit = defineEmits(['close', 'productSaved']);

    const product: Ref<any> = ref<any>(null);
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const cookies = (VueCookies as any);
    const {t} = useI18n();

    const alert = ref<typeof Alert | null>(null);
    const dialog = ref<HTMLDialogElement | null>(null);
    const form = ref<HTMLDivElement | null>(null);

    const name = ref("");
    const description = ref("");
    const origin = ref("");
    const points = ref(0);
    const image = ref<HTMLInputElement | null>(null);
    const assignsPoints = ref(true);

    const askModal = ref<typeof ConfirmModal | null>(null); 

    watch(() => props.open, async (open) => {
        if (!dialog.value) {
            return;
        }

        if (open && props.shopId != "" && props.productId != "") {
            product.value = await fetch(`${backendAPI}/shops/${props.shopId}/products/${props.productId}`)
                .then((res) => { return res.json(); });

            name.value = product.value.name;
            description.value = product.value.description;
            origin.value = product.value.origin;
            points.value = product.value.points;
            assignsPoints.value = true;
            if (image.value) {
                image.value.value = "";
            }
        }

        if (open && product) {
            dialog.value.show();
        } else {
            dialog.value.close();
        }
    });

    async function updateExistingProduct(data: FormData, token: string){
        await fetch(`${backendAPI}/shops/${props.shopId!}/products/${props.productId!}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        }).then(e => {
            switch (e.status) {
                case 200:
                    dialog.value!.close();
                    alert.value!.showAlert(AlertType.Success, t("shop.prodotto.aggiornato"));
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
        data.append("origin", origin.value);
        data.append("image", file!);

        if (assignsPoints.value) {
            data.append("points", `${points.value}`);
        }

        updateExistingProduct(data, token);
    }

    function deleteProductAskConfirm(){
        askModal.value!.ask(t('shop.prodotto.confermaCancellazione'));
    }

    async function deleteProduct() {
        const token = cookies.get("token");

        await fetch(`${backendAPI}/shops/${props.shopId!}/products/${props.productId!}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(e =>{
            switch (e.status) {
                case 200:
                    dialog.value!.close();
                    alert.value!.showAlert(AlertType.Success, t("shop.prodotto.cancellato"));
                    break;
                default:
                    alert.value!.showAlert(AlertType.Error, e.status + ":" + t("alerts.errore"));
                    break;
            }
        }).then(_ => { emit('productSaved') });
    }
</script>

<template>
    <dialog ref="dialog" class="modal z-0">
        <div v-if="product" class="modal-box min-w-[40dvw] z-0" ref="box">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-3xl font-bold">{{ product.name }}</h2>
                    <img
                        class="w-full h-full object-cover rounded-xl"
                        :src="`${backendUrl}${product.image}`"
                        :alt="product.name"
                    />
                    <div class="grid grid-cols-2 gap-y-4 my-4 items-center" ref="form">
                        <span class="text-xl label">{{ $t("shop.nome") }}:</span>
                        <input class="input validator" type="text" v-model="name">

                        <span class="text-xl label">{{ $t("shop.descrizione") }}:</span>
                        <textarea class="validator textarea resize-none" v-model="description"></textarea>

                        <span class="text-xl label">{{ $t("shop.origine") }}:</span>
                        <input class="input validator" v-model="origin">

                        <div class="flex flex-col">
                            <span class="text-xl label">{{ $t("shop.punti") }}:</span>
                            <label class="label">
                                    <input type="checkbox" class="checkbox" :checked="!assignsPoints" @click="assignsPoints = !assignsPoints">
                                    {{ $t("shop.nessunPunto") }}
                            </label>
                        </div>
                        <input type="number" min="0" :disabled="!assignsPoints" class="input validator" v-model="points">

                        <span class="text-xl label">{{ $t("shop.immagine") }}:</span>
                        <input type="file" class="input file-input validator" accept="image/jpeg, image/png, image/webp" ref="image">
                    </div>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button @click="deleteProductAskConfirm" class="btn mr-auto bg-red-700 text-white">{{ $t("shop.elimina") }}</button>
                <button class="btn" @click="$emit('close')">{{ $t("shop.annulla") }}</button>
                <button class="btn bg-lime-700 text-white" @click="() => { save(); $emit('close') }" >{{ $t("shop.salva") }}</button>
            </div>
        </div>
    </dialog>
    <Alert ref="alert" />
    <ConfirmModal @on-yes='deleteProduct' ref="askModal" />
</template>

<style>
    @reference "tailwindcss";

    .yes-btn {
        @apply bg-red-700 text-white;
    }
</style>