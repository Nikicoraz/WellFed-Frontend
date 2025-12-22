<script setup lang="ts">
    import { watch, ref } from "vue";
    import { validateInputs } from "../../extensions/formValidation";
    import VueCookies  from 'vue-cookies'
    import { useI18n } from "vue-i18n";
    import Alert from "../util/Alert.vue";
    import AlertType from "../../types/alert";

    const props = defineProps({
        shopId: String,
        open: Boolean
    });

    const emit = defineEmits(['close', 'productSaved']);

    const cookies = (VueCookies as any);
    const {t} = useI18n();
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const alert = ref<typeof Alert | null>(null);
    const dialog = ref<HTMLDialogElement | null>(null);
    const form = ref<HTMLDivElement | null>(null);

    const name = ref("");
    const description = ref("");
    const origin = ref("");
    const points = ref(0);
    const assignsPoints = ref(true);
    const image = ref<HTMLInputElement | null>(null);

    watch(() => props.open, async (open) => {
        if (!dialog.value) {
            return
        }

        if (open) {
            dialog.value.showModal();
        } else {
            resetFields();
            dialog.value.close();
        }
    });

    function resetFields() {
        name.value = "";
        description.value = "";
        origin.value = "";
        points.value = 0;
        assignsPoints.value = true;
        if (image.value) {
            image.value.value = "";
        }
    }

    async function insertNewProduct(data: FormData, token: string){
        await fetch(`${backendAPI}/shops/${props.shopId!}/products`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        }).then(e => {
            switch (e.status) {
                case 201:
                    dialog.value!.close();
                    alert.value!.showAlert(AlertType.Success, t("shop.prodotto.creato"));
                    break;
                default:
                    alert.value!.showAlert(AlertType.Error, e.status + ": " + t("alerts.datiNonValidi"))
                    break;
            }
        }).then(_ => emit('productSaved'));
    }

    function save() {
        if (!validateInputs(form.value!)) {
            return;
        }

        if (!image.value || !image.value.files) {
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
        
        insertNewProduct(data, token);
    }
</script>

<template>
    <dialog ref="dialog" class="modal z-10" @close="$emit('close')">
        <div class="modal-box min-w-[40dvw]">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-3xl font-bold">{{ $t("shop.prodotto.nuovo") }}</h2>
                    <div ref="form" class="grid grid-cols-2 gap-y-4 my-4 items-center">
                        <span class="text-xl label">{{ $t("shop.nome") }}:</span>
                        <input required class="input validator" type="text" v-model="name">

                        <span class="text-xl label">{{ $t("shop.descrizione") }}:</span>
                        <textarea required class="validator textarea resize-none" v-model="description"></textarea>

                        <span class="text-xl label">{{ $t("shop.origine") }}:</span>
                        <input required class="input validator" v-model="origin">

                        <div class="flex flex-col">
                            <span class="text-xl label">{{ $t("shop.punti") }}:</span>
                            <label class="label">
                                    <input type="checkbox" class="checkbox" :checked="!assignsPoints" @click="assignsPoints = !assignsPoints">
                                    {{ $t("shop.nessunPunto") }}
                            </label>
                        </div>
                        <input required type="number" min="0" :disabled="!assignsPoints" class="input validator" v-model="points">

                        <span class="text-xl label">{{ $t("shop.immagine") }}:</span>
                        <input required type="file" class="input file-input validator" accept="image/jpeg, image/png, image/webp" ref="image">
                    </div>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button class="btn" @click="$emit('close')">{{ $t("shop.annulla") }}</button>
                <button class="btn bg-lime-700 text-white" @click="save()" >{{ $t("shop.salva") }}</button>
            </div>
        </div>
    </dialog>
    <Alert ref="alert" />
</template>