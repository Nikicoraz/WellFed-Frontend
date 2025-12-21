<script setup lang="ts">
    import { ref, onMounted } from "vue";
    import { useI18n } from "vue-i18n";

    const props = defineProps(['transaction']); // non ho idea di che tipo sia
    const emits = defineEmits(['showTransactionDetails']);

    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const {t} = useI18n();

    const issuer = props.transaction.issuerID;
    const receiver = props.transaction.receiverID;

    const merchantId = issuer.type == 'merchant' ? issuer.id : receiver.id;
    const merchantName = ref("");

    const date = ref("");

    onMounted(async () => {
            date.value = new Date(props.transaction.issuingDate).toLocaleDateString();


            merchantName.value = await fetch(`${backendAPI}/shops/${merchantId}`)
                .then((res) => { return res.json() })
                .then((shop) => { return shop.name });
        }
    );
</script>

<template>
    <div v-if="props.transaction" class="card card-side bg-base-100 shadow-sm m-4 cursor-pointer" @click="$emit('showTransactionDetails', transaction)">
        <div class="card-body rounded-md flex-row justify-between p-2" :class="props.transaction.transactionStatus == 'Success' ? 'bg-lime-600' : 'bg-red-400'">
            <div class="card-title text-white text-md">{{ merchantName }}</div>
            <div class="card-title text-white text-md">{{ date }}</div>
        </div>
    </div>
</template>