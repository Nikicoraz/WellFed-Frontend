<script setup lang="ts">
    import { ref, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";

    const {t} = useI18n();

    const props = defineProps(['open', 'transaction']);
    const emit = defineEmits(['close']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null);

    watch(() => props.open, async (open) => {
        if (!dialog.value) {
            return
        }

        if (open) {
            dialog.value.showModal();
        } else {
            dialog.value.close();
        }
    });
</script>

<template>
    <dialog ref="dialog" class="modal">
        <div v-if="transaction" class="modal-box">
            <div class="bg-white text-black flex flex-col">
                <div>{{ props.transaction.transactionType }}</div>
                <div>{{ props.transaction.transactionStatus }}</div>
                <div>{{ props.transaction.points}}</div>
                <div>
                    <ul>
                        <li v-for="product in props.transaction.items.products">
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li v-for="item in props.transaction.items.products"></li>
                    </ul>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button class="btn" @click="$emit('close')">{{ `${t('button.chiudi')}` }}</button>
            </div>
        </div>
    </dialog>
</template>