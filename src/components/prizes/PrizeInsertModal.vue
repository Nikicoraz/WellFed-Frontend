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

    const emit = defineEmits(['close', 'prizeSaved']);

    const cookies = (VueCookies as any);
    const {t} = useI18n();
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const alert = ref<typeof Alert | null>(null);
    const dialog = ref<HTMLDialogElement | null>(null);
    const form = ref<HTMLDivElement | null>(null);

    const name = ref("");
    const description = ref("");
    const points = ref(0);
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
        points.value = 0;
        if (image.value) {
            image.value.value = "";
        }
    }

    async function insertNewPrize(data: FormData, token: string){
        await fetch(`${backendAPI}/shops/${props.shopId!}/prizes`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        }).then(e => {
            switch (e.status) {
                case 201:
                    dialog.value!.close();
                    alert.value!.showAlert(AlertType.Success, t("shop.premio.creato"));
                    break;
                default:
                    alert.value!.showAlert(AlertType.Error, e.status + ": " + t("alerts.datiNonValidi"))
                    break;
            }
        }).then(_ => emit('prizeSaved'));
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
        data.append("image", file!);
        data.append("points", `${points.value}`);
        
        insertNewPrize(data, token);
    }
</script>

<template>
    <dialog ref="dialog" class="modal" @close="$emit('close')">
        <div class="modal-box min-w-[40dvw]">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-3xl font-bold">{{ $t("shop.premio.nuovo") }}</h2>
                    <div ref="form" class="grid grid-cols-2 gap-y-4 my-4 items-center">
                        <span class="text-xl label">{{ $t("shop.nome") }}:</span>
                        <input required class="input validator" type="text" v-model="name">

                        <span class="text-xl label">{{ $t("shop.descrizione") }}:</span>
                        <textarea required class="validator textarea resize-none" v-model="description"></textarea>

                        <span class="text-xl label">{{ $t("shop.punti") }}:</span>
                        <input required type="number" min="1" class="input validator" v-model="points">

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