<script lang="ts" setup>
import {
    useBaseStore,
    useBlockchain,
    useFormatter,
    useMintStore,
    useStakingStore,
    useTxDialog,
} from '@/stores';
import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import type { Key, SlashingParam, Validator } from '@/types';
import { formatSeconds } from '@/libs/utils'

const staking = useStakingStore();
const base = useBaseStore();
const format = useFormatter();
const dialog = useTxDialog();
const chainStore = useBlockchain();
const mintStore = useMintStore()

const cache = JSON.parse(localStorage.getItem('avatars') || '{}');
const avatars = ref(cache || {});
const latest = ref({} as Record<string, number>);
const yesterday = ref({} as Record<string, number>);
const slashing = ref({} as SlashingParam)
const allValidators = ref([] as Validator[]);
const isLoading = ref(true);

onMounted(async () => {
    isLoading.value = true;
    useStakingStore().init();

    // Fetch slashing parameters
    chainStore.rpc.getSlashingParams().then(res => {
        slashing.value = res.params;
    });

    // Fetch all validators (bonded, unbonding, and unbonded)
    try {
        const bonded = await staking.fetchValidators('BOND_STATUS_BONDED');
        const unbonding = await staking.fetchValidators('BOND_STATUS_UNBONDING');
        const unbonded = await staking.fetchValidators('BOND_STATUS_UNBONDED');

        // Combine all validators into a single list
        allValidators.value = [
            ...bonded,
            ...unbonding,
            ...unbonded
        ];

        // Sort by delegator shares (voting power) in descending order
        allValidators.value.sort((a, b) => Number(b.delegator_shares) - Number(a.delegator_shares));
    } catch (error) {
        console.error("Error fetching validators:", error);
    } finally {
        isLoading.value = false;
    }

    // Start fetching voting power changes
    fetchChange();
});

async function fetchChange(blockWindow: number = 14400) {
    let page = 0;

    let height = Number(base.latest?.block?.header?.height || 0);
    if (height > blockWindow) {
        height -= blockWindow;
    } else {
        height = 1;
    }
    // voting power in 24h ago
    while (page < staking.validators.length && height > 0) {
        await base.fetchValidatorByHeight(height, page).then((x) => {
            x.validators.forEach((v) => {
                yesterday.value[v.pub_key.key] = Number(v.voting_power);
            });
        });
        page += 100;
    }

    page = 0;
    // voting power for now
    while (page < staking.validators.length) {
        await base.fetchLatestValidators(page).then((x) => {
            x.validators.forEach((v) => {
                latest.value[v.pub_key.key] = Number(v.voting_power);
            });
        });
        page += 100;
    }
}

const changes = computed(() => {
    const changes = {} as Record<string, number>;
    Object.keys(latest.value).forEach((k) => {
        const l = latest.value[k] || 0;
        const y = yesterday.value[k] || 0;
        changes[k] = l - y;
    });
    return changes;
});

const change24 = (entry: { consensus_pubkey: Key; tokens: string }) => {
    const txt = entry.consensus_pubkey.key;
    const latestValue = latest.value[txt];
    if (!latestValue) {
        return 0;
    }

    const displayTokens = format.tokenAmountNumber({
        amount: parseInt(entry.tokens, 10).toString(),
        denom: staking.params.bond_denom,
    });
    const coefficient = displayTokens / latestValue;
    return changes.value[txt] * coefficient;
};

const change24Text = (entry: { consensus_pubkey: Key; tokens: string }) => {
    if (!entry) return '';
    const v = change24(entry);
    return v && v !== 0 ? format.showChanges(v) : '';
};

const change24Color = (entry: { consensus_pubkey: Key; tokens: string }) => {
    if (!entry) return '';
    const v = change24(entry);
    if (v > 0) return 'text-success';
    if (v < 0) return 'text-error';
};

const calculateRank = function (position: number, totalValidators: number) {
    let sum = 0;
    for (let i = 0; i < position; i++) {
        sum += Number(allValidators.value[i]?.delegator_shares);
    }
    const totalShares = allValidators.value.reduce((sum, validator) => sum + Number(validator.delegator_shares), 0);
    const percent = totalShares > 0 ? sum / totalShares : 0;

    // Active validators have special coloring based on their position
    // Top 33% are error, next 34% are warning, rest are primary
    if (position < Math.ceil(totalValidators * 0.33)) {
        return 'error';
    } else if (position < Math.ceil(totalValidators * 0.67)) {
        return 'warning';
    } else {
        return 'primary';
    }
};

function isFeatured(endpoints: string[], who?: { website?: string, moniker: string }) {
    if (!endpoints || !who) return false
    return endpoints.findIndex(x => who.website && who.website?.substring(0, who.website?.lastIndexOf('.')).endsWith(x) || who?.moniker?.toLowerCase().search(x.toLowerCase()) > -1) > -1
}

const validatorsList = computed(() => {
    const activeCount = allValidators.value.filter(v => v.status === 'BOND_STATUS_BONDED').length;
    return allValidators.value.map((x, i) => ({
        v: x,
        rank: x.status === 'BOND_STATUS_BONDED' ? calculateRank(i, activeCount) : 'primary',
        logo: logo(x.description.identity),
        statusBadge: getStatusBadge(x.status),
    }));
});

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'BOND_STATUS_BONDED':
            return { class: 'badge-success !bg-[#6AC13633] !text-[#60BC29] ', color: 'bg-[#6AC13633;] text-[#60BC29;]', text: 'Staked' };
        case 'BOND_STATUS_UNBONDING':
            return { class: 'badge-warning', text: 'Unstaking' };
        case 'BOND_STATUS_UNBONDED':
            return { class: 'badge-error !text-[#E03834] !bg-[#E0383433]', text: 'Unstaked' };
        default:
            return { class: 'badge-ghost', text: 'Unknown' };
    }
};

const fetchAvatar = (identity: string) => {
    // fetch avatar from keybase
    return new Promise<void>((resolve) => {
        staking
            .keybase(identity)
            .then((d) => {
                if (Array.isArray(d.them) && d.them.length > 0) {
                    const uri = String(d.them[0]?.pictures?.primary?.url).replace(
                        'https://s3.amazonaws.com/keybase_processed_uploads/',
                        ''
                    );

                    avatars.value[identity] = uri;
                    resolve();
                } else throw new Error(`failed to fetch avatar for ${identity}`);
            })
            .catch((error) => {
                // console.error(error); // uncomment this if you want the user to see which avatars failed to load.
                resolve();
            });
    });
};

const loadAvatar = (identity: string) => {
    // fetches avatar from keybase and stores it in localStorage
    fetchAvatar(identity).then(() => {
        localStorage.setItem('avatars', JSON.stringify(avatars.value));
    });
};

const loadAvatars = () => {
    // fetches all avatars from keybase and stores it in localStorage
    const promises = allValidators.value.map((validator) => {
        const identity = validator.description?.identity;

        // Here we also check whether we haven't already fetched the avatar
        if (identity && !avatars.value[identity]) {
            return fetchAvatar(identity);
        } else {
            return Promise.resolve();
        }
    });

    Promise.all(promises).then(() =>
        localStorage.setItem('avatars', JSON.stringify(avatars.value))
    );
};

const logo = (identity?: string) => {
    if (!identity || !avatars.value[identity]) return '';
    const url = avatars.value[identity] || '';
    return url.startsWith('http')
        ? url
        : `https://s3.amazonaws.com/keybase_processed_uploads/${url}`;
};

const loaded = ref(false);
base.$subscribe((_, s) => {
    if (s.recents.length >= 2 && loaded.value === false) {
        loaded.value = true;
        const diff_time = Date.parse(s.recents[1].block.header.time) - Date.parse(s.recents[0].block.header.time)
        const diff_height = Number(s.recents[1].block.header.height) - Number(s.recents[0].block.header.height)
        const block_window = Number(Number(86400 * 1000 * diff_height / diff_time).toFixed(0))
        fetchChange(block_window);
    }
});

loadAvatars();
</script>
<template>
    <div>  
        <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-4 my-4 font-bold text-[#ffffff]">Validators</p>
        <div class="grid sm:grid-cols-1 md:grid-cols-4 py-4 gap-4 mb-4">
            <div class="flex dark:bg-base-100 bg-base-200 rounded-xl p-4">
                <span>
                    <div class="bg-[#5E9AE4] relative w-9 h-9 rounded overflow-hidden flex items-center justify-center mr-2">
                        <Icon class="text-[#ffffff]" icon="mdi:trending-up" size="32" />
                        <div class="absolute top-0 left-0 bottom-0 right-0 opacity-20 bg-success"></div>
                    </div>
                </span>
                <span>
                    <div class="text-xs text-[#64748B]">{{ $t('staking.inflation') }}</div>
                    <div class="font-bold">{{ format.percent(mintStore.inflation) }}</div>
                </span>
            </div>
            <div class="flex dark:bg-base-100 bg-base-200 rounded-xl p-4">
                <span>
                    <div class="bg-[#5E9AE4] relative w-9 h-9 rounded overflow-hidden flex items-center justify-center mr-2">
                        <Icon class="text-[#ffffff]" icon="mdi:lock-open-outline" size="32" />
                        <div class="absolute top-0 left-0 bottom-0 right-0 opacity-20 bg-primary"></div>
                    </div>
                </span>
                <span>
                    <div class="text-xs text-[#64748B]">{{ $t('staking.unbonding_time') }}</div>
                    <div class="font-bold">{{ formatSeconds(staking.params?.unbonding_time) }}</div>
                </span>
            </div>
            <div class="flex dark:bg-base-100 bg-base-200 rounded-xl p-4">
                <span>
                    <div class="bg-[#5E9AE4] relative w-9 h-9 rounded overflow-hidden flex items-center justify-center mr-2">
                        <Icon class="text-[#ffffff]" icon="mdi:alert-octagon-outline" size="32" />
                        <div class="absolute top-0 left-0 bottom-0 right-0 opacity-20 bg-error"></div>
                    </div>
                </span>
                <span>
                    <div class="text-xs text-[#64748B]">{{ $t('staking.double_sign_slashing') }}</div>
                    <div class="font-bold">{{ format.percent(slashing.slash_fraction_double_sign) }}</div>
                </span>
            </div>
            <div class="flex dark:bg-base-100 bg-base-200 rounded-xl p-4">
                <span>
                    <div class="bg-[#5E9AE4] relative w-9 h-9 rounded overflow-hidden flex items-center justify-center mr-2">
                        <Icon class="text-[#ffffff]" icon="mdi:pause" size="32" />
                        <div class="absolute top-0 left-0 bottom-0 right-0 opacity-20 bg-error"></div>
                    </div>
                </span>
                <span>
                    <div class="text-xs text-[#64748B]">{{ $t('staking.downtime_slashing') }}</div>
                    <div class="font-bold">{{ format.percent(slashing.slash_fraction_downtime) }}</div>
                </span>
            </div>
        </div>

        <div>
            <div class="bg-base-100 rounded-xl mb-4">
                <div v-if="isLoading" class="flex justify-center items-center p-8 rounded-xl">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>
                <div v-else class="bg-[#EFF2F5] dark:bg-base-100 rounded-xl dark:border-base-100 px-0.5 pt-0.5 pb-0.5 overflow-x-auto">
                    <table class="table w-full rounded-xl">
                        <thead class="dark:bg-base-100 bg-white sticky top-0 border-0">
                            <tr class="">   <!-- ✅ border hataya -->
                                <td scope="col" style="width: 3rem; position: relative">{{ $t('staking.rank') }}</td>
                                <td scope="col">{{ $t('staking.validator') }}</td>
                                <td scope="col" class="text-center">{{ $t('staking.status') }}</td>
                                <td scope="col" class="text-right">{{ $t('staking.voting_power') }}</td>
                                <td scope="col" class="text-right">{{ $t('staking.24h_changes') }}</td>
                                <td scope="col" class="text-right">{{ $t('staking.commission') }}</td>
                            </tr>
                        </thead>
                        
                        <tbody class="divide-y-0 rounded-xl">
                            <tr
                                v-for="({ v, rank, logo, statusBadge }, i) in validatorsList" :key="v.operator_address" class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl">
                                <!-- 👉 rank -->
                                    <td>
                                        <div class="text-xs truncate relative px-2 py-1 rounded-full w-fit" :class="`text-${rank}`">
                                            <span class="inset-x-0 inset-y-0 opacity-10 absolute" :class="`bg-${rank}`"></span>
                                            {{ i + 1 }}
                                        </div>
                                    </td>
                                    <!-- 👉 Validator -->
                                    <td>
                                        <div class="flex items-center overflow-hidden" style="max-width: 300px">
                                            <div class="flex flex-col">
                                                <span
                                                    class="text-sm text-primary dark:invert whitespace-nowrap overflow-hidden">
                                                    <RouterLink :to="{
                                                        name: 'chain-staking-validator',
                                                        params: {
                                                            validator:
                                                                v.operator_address,
                                                        },
                                                    }" class="font-weight-medium">
                                                        {{ v.description?.moniker }}
                                                    </RouterLink>
                                                </span>
                                                <span class="text-xs">{{
                                                    v.operator_address ||
                                                    v.description?.identity ||
                                                    '-'
                                                    }}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- 👉 Status -->
                                    <td class="text-center">
                                        <div class="badge" :class="statusBadge.class">
                                            {{ statusBadge.text }}
                                        </div>
                                    </td>

                                    <!-- 👉 Voting Power -->
                                    <td class="text-right">
                                        <div class="flex flex-col">
                                            <h6 class="text-sm font-weight-medium whitespace-nowrap ">
                                                {{
                                                    format.formatToken(
                                                        {
                                                            amount: parseInt(
                                                                v.tokens
                                                            ).toString(),
                                                            denom: staking.params
                                                                .bond_denom,
                                                        },
                                                        true,
                                                        '0,0'
                                                    )
                                                }}
                                            </h6>
                                            <span class="text-xs">{{
                                                format.calculatePercent(
                                                    v.delegator_shares,
                                                    staking.totalPower
                                                )
                                                }}</span>
                                        </div>
                                    </td>
                                    <!-- 👉 24h Changes -->
                                    <td class="text-right text-xs" :class="change24Color(v)">
                                        {{ change24Text(v) }}
                                    </td>
                                    <!-- 👉 commission -->
                                    <td class="text-right text-xs">
                                        {{
                                            format.formatCommissionRate(
                                                v.commission?.commission_rates?.rate
                                            )
                                        }}
                                    </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="flex flex-row items-center dark:bg-base-200 bg-white px-3.5 py-4 gap-2">
                        <div class="text-xs truncate relative py-2 px-4 rounded-[15px;] w-fit text-[#171C1F] dark:text-error mr-2">
                            <span class="inset-x-0 inset-y-0 opacity-10 absolute bg-[#E03834]"></span>
                            {{ $t('staking.top') }} 33%
                        </div>
                        <div class="text-xs truncate relative py-2 px-4 rounded-[15px;] w-fit text-[#171C1F] dark:text-warning">
                            <span class="inset-x-0 inset-y-0 opacity-10 absolute bg-[#FFB206]"></span>
                            {{ $t('staking.top') }} 67%
                        </div>
                        <div class="text-sm dark:text-[#64748B;] text-[#171C1FA6;] hidden md:!block pl-2 rounded-[15px;] px-4 pt-0.5 pb-0.5 border border-[#64748B;] ">
                            {{ $t('staking.description') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<route>
  {
    meta: {
      i18n: 'validators',
      order: 7
    }
  }
</route>

<style>
.staking-table.table :where(th, td) {
    padding: 8px 5px;
    background: transparent;
}
</style>
