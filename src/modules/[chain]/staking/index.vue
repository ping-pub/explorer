<script lang="ts" setup>
import { useBaseStore, useFormatter, useStakingStore } from '@/stores';
import { toBase64, toHex } from '@cosmjs/encoding';
import { computed } from '@vue/reactivity';
import { onMounted, ref, type DebuggerEvent } from 'vue';
import { consensusPubkeyToHexAddress } from '@/libs';
import type { Key, Validator } from '@/types';
const staking = useStakingStore();
const format = useFormatter();

const cache = JSON.parse(localStorage.getItem('avatars') || '{}');
const avatars = ref(cache || {});
const latest = ref({} as Record<string, number>);
const yesterday = ref({} as Record<string, number>);
const tab = ref('active');
const unbondList = ref([] as Validator[]);
const base = useBaseStore();
onMounted(() => {
  staking.fetchInacitveValdiators().then((x) => {
    unbondList.value = x;
  });
});

async function fetchChange() {
  console.log('fetch changes')
  let page = 0

  let height = Number(base.latest?.block?.header?.height || 0)
  if (height > 14400) {
    height -= 14400
  } else {
    height = 1
  }
  // voting power in 24h ago
  while(page < staking.validators.length && height > 0) {
    await base.fetchValidatorByHeight(height, page).then(x => {
      x.validators.forEach(v => {
        yesterday.value[v.pub_key.key] = Number(v.voting_power)
      })
    })
    page += 100
  }

  page = 0
  // voting power for now
  while(page < staking.validators.length) {
    await base.fetchLatestValidators(page).then(x => {
      x.validators.forEach(v => {
        latest.value[v.pub_key.key] = Number(v.voting_power)
      })
    })
    page += 100
  }
}

fetchChange();

const changes = computed(() => {
  const changes = {} as Record<string, number>
  Object.keys(latest.value).forEach(k => {
    const l = latest.value[k] || 0
    const y = yesterday.value[k] || 0
    changes[k] = l - y
  })
  return changes
})

const change24 = (key: Key) => {
  // console.log('hex key:', consensusPubkeyToHexAddress(key))
  const txt = key.key;
  // const n: number = latest.value[txt];
  // const o: number = yesterday.value[txt];
  // // console.log( txt, n, o)
  // return n > 0 && o > 0 ? n - o : 0;
  return changes.value[txt]
};

const change24Text = (key?: Key) => {
  if (!key) return '';
  const v = change24(key);
  return v !== 0 ? format.showChanges(v) : '';
};

const change24Color = (key?: Key) => {
  if (!key) return '';
  const v = change24(key);
  if (v > 0) return 'text-success';
  if (v < 0) return 'text-error';
};

const update = (m: DebuggerEvent) => {
  if (m.key === 'validators') {
    loadAvatars();
  }
};

const list = computed(() => {
  return tab.value === 'active' ? staking.validators : unbondList.value;
  // return staking.validators
});

const loadAvatars = () => {
  // fetch avatar from keybase
  let promise = Promise.resolve();
  staking.validators.forEach((item) => {
    promise = promise.then(
      () =>
        new Promise((resolve) => {
          const identity = item.description?.identity;
          if (identity && !avatars.value[identity]) {
            staking.keybase(identity).then((d) => {
              if (Array.isArray(d.them) && d.them.length > 0) {
                const uri = String(d.them[0]?.pictures?.primary?.url).replace(
                  'https://s3.amazonaws.com/keybase_processed_uploads/',
                  ''
                );
                if (uri) {
                  avatars.value[identity] = uri;
                  localStorage.setItem(
                    'avatars',
                    JSON.stringify(avatars.value)
                  );
                }
              }
              resolve();
            });
          } else {
            resolve();
          }
        })
    );
  });
};

staking.$subscribe((m, s) => {
  if (Array.isArray(m.events)) {
    m.events.forEach((x) => {
      update(x);
    });
  } else {
    update(m.events);
  }
});
const logo = (identity?: string) => {
  if (!identity) return '';
  const url = avatars.value[identity] || '';
  return url.startsWith('http')
    ? url
    : `https://s3.amazonaws.com/keybase_processed_uploads/${url}`;
};
const rank = function (position: number) {
  let sum = 0;
  for (let i = 0; i < position; i++) {
    sum += Number(staking.validators[i]?.delegator_shares);
  }
  const percent = sum / staking.totalPower;

  switch (true) {
    case tab.value === 'active' && percent < 0.33:
      return 'error';
    case tab.value === 'active' && percent < 0.67:
      return 'warning';
    default:
      return 'primary';
  }
};
</script>
<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="tabs tabs-boxed bg-transparent mb-4">
        <a
          class="tab text-gray-400"
          :class="{ 'tab-active': tab === 'active' }"
          @click="tab = 'active'"
          >Active</a
        >
        <a
          class="tab text-gray-400"
          :class="{ 'tab-active': tab === 'inactive' }"
          @click="tab = 'inactive'"
          >Inactive</a
        >
      </div>

      <div class="text-lg font-semibold">
        {{ list.length }}/{{ staking.params.max_validators }}
      </div>
    </div>
    <div>
      <VCard>
        <VTable class="text-no-wrap table-header-bg rounded-0">
          <thead>
            <tr>
              <th scope="col" style="width: 3rem">#</th>
              <th scope="col">VALIDATOR</th>
              <th scope="col" class="text-right">VOTING POWER</th>
              <th scope="col" class="text-right">24h CHANGES</th>
              <th scope="col" class="text-right">COMMISSION</th>
              <th scope="col">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, i) in list" :key="v.operator_address">
              <!-- 👉 rank -->
              <td>
                <VChip label :color="rank(i)">
                  {{ i + 1 }}
                </VChip>
              </td>

              <!-- 👉 Validator -->
              <td>
                <div
                  class="d-flex align-center overflow-hidden"
                  style="max-width: 400px"
                >
                  <VAvatar
                    variant="tonal"
                    class="me-3"
                    size="34"
                    icon="mdi-help-circle-outline"
                    :image="logo(v.description?.identity)"
                  />
                  <div class="d-flex flex-column">
                    <h6 class="text-sm text-primary">
                      <RouterLink
                        :to="{
                          name: 'chain-staking-validator',
                          params: { validator: v.operator_address },
                        }"
                        class="font-weight-medium user-list-name"
                      >
                        {{ v.description?.moniker }}
                      </RouterLink>
                    </h6>
                    <span class="text-xs">{{
                      v.description?.website || v.description?.identity || '-'
                    }}</span>
                  </div>
                </div>
              </td>

              <!-- 👉 Voting Power -->
              <td class="text-right">
                <div class="d-flex flex-column">
                  <h6 class="text-sm font-weight-medium">
                    {{
                      format.formatToken(
                        {
                          amount: parseInt(v.tokens).toString(),
                          denom: staking.params.bond_denom,
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
              <td
                class="text-right text-xs"
                :class="change24Color(v.consensus_pubkey)"
              >
                {{ change24Text(v.consensus_pubkey) }}
                <VChip label v-if="v.jailed" color="error">Jailed</VChip>
              </td>
              <!-- 👉 commission -->
              <td class="text-right">
                {{
                  format.formatCommissionRate(
                    v.commission?.commission_rates?.rate
                  )
                }}
              </td>
              <!-- 👉 Action -->
              <td>
                {{ 2 }}
              </td>
            </tr>
          </tbody>
        </VTable>
        <VDivider />
        <VCardActions class="py-2">
          <VChip label color="error">Top 33%</VChip>
          <VChip label color="warning" class="mx-2">Top 67%</VChip>
        </VCardActions>
      </VCard>
    </div>
  </div>
</template>

<route>
  {
    meta: {
      i18n: 'staking',
      order: 3
    }
  }
</route>
