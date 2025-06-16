<script lang="ts" setup>
import {
  useBlockchain,
  useFormatter,
  useStakingStore,
  useTxDialog,
} from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import DonutChart from '@/components/charts/DonutChart.vue';
import { computed, ref } from '@vue/reactivity';
import { onMounted } from 'vue';
import { Icon } from '@iconify/vue';

import type {
  AuthAccount,
  Delegation,
  TxResponse,
  DelegatorRewards,
  UnbondingResponses,
  VestingInfo,
  Coin,
} from '@/types';
import Countdown from '@/components/Countdown.vue';
import { fromBase64 } from '@cosmjs/encoding';

const props = defineProps(['address', 'chain']);

const blockchain = useBlockchain();
const stakingStore = useStakingStore();
const dialog = useTxDialog();
const format = useFormatter();
const account = ref({} as AuthAccount);
const txs = ref({} as TxResponse[]);
const delegations = ref([] as Delegation[]);
const rewards = ref({} as DelegatorRewards);
const balances = ref([] as Coin[]);
const spendableBalances = ref([] as Coin[]);
const isVestingAccount = ref(false);
const recentReceived = ref([] as TxResponse[]);
const unbonding = ref([] as UnbondingResponses[]);
const unbondingTotal = ref(0);
const chart = {};
onMounted(() => {
  loadAccount(props.address);
});
const totalAmountByCategory = computed(() => {
  let sumDel = 0;
  delegations.value?.forEach((x) => {
    sumDel += Number(x.balance.amount);
  });
  let sumRew = 0;
  rewards.value?.total?.forEach((x) => {
    sumRew += Number(x.amount);
  });
  let sumUn = 0;
  unbonding.value?.forEach((x) => {
    x.entries?.forEach((y) => {
      sumUn += Number(y.balance);
    });
  });

  let baseAmounts = [sumDel, sumRew, sumUn]
  
  // For vesting accounts, split balance into spendable (immediately usable) and vesting (locked)
  if (isVestingAccount.value) {
    // Spendable = spendable balance (what can actually be used immediately)
    const spendableAmount = Number(spendableBalances.value?.[0]?.amount || 0);
    
    // Vesting = theoretical locked amount based on vesting schedules
    const total = totalOriginalVesting.value;
    const vested = theoreticalVestedAmount.value;
    if (total !== undefined && vested !== undefined) {
      let vestingAmount = total - vested
      return [spendableAmount, ...baseAmounts, vestingAmount]
    } else {
      return [spendableAmount, ...baseAmounts]
    }
  } else {
    // For regular accounts, show total balance as spendable (no vesting locks)
    let sumBal = 0;
    balances.value?.forEach((x) => {
      sumBal += Number(x.amount);
    });
    return [sumBal, ...baseAmounts];
  }
});

const labels = computed(() => {
  const baseLabels = ['Balance', 'Delegation', 'Reward', 'Unbonding'];
  if (isVestingAccount.value && totalAmountByCategory.value.length === 5) {
    return [...baseLabels, 'Vesting'];
  } else {
    return baseLabels;
  }
});

const totalAmount = computed(() => {
  return totalAmountByCategory.value.reduce((p, c) => c + p, 0);
});

const totalValue = computed(() => {
  let value = 0;
  delegations.value?.forEach((x) => {
    value += format.tokenValueNumber(x.balance);
  });
  rewards.value?.total?.forEach((x) => {
    value += format.tokenValueNumber(x);
  });
  
  // For vesting accounts, use spendable balances for available amount
  if (isVestingAccount.value) {
    spendableBalances.value?.forEach((x) => {
      value += format.tokenValueNumber(x);
    });
  } else {
    balances.value?.forEach((x) => {
      value += format.tokenValueNumber(x);
    });
  }
  
  unbonding.value?.forEach((x) => {
    x.entries?.forEach((y) => {
      value += format.tokenValueNumber({amount: y.balance, denom: stakingStore.params.bond_denom});
    });
  });
  return format.formatNumber(value, '0,0.00');
});

// Helper function to calculate vested amount for a single schedule
function calculateVestedAmount(
  originalVesting: number,
  startTime: number,
  endTime: number,
  currentTime: number
): number | undefined {
  // Validate schedule parameters
  if (originalVesting <= 0 || startTime >= endTime) {
    return undefined;
  }

  // Calculate vested amount based on time
  if (currentTime <= startTime) {
    return 0; // Vesting hasn't started
  } else if (currentTime >= endTime) {
    return originalVesting; // Vesting completed
  } else {
    // Linear vesting progress
    const vestedTime = currentTime - startTime;
    const totalVestingTime = endTime - startTime;
    return originalVesting * (vestedTime / totalVestingTime);
  }
}

// Calculate theoretical vested amount based on vesting schedule (time-based)
const theoreticalVestedAmount = computed(() => {
  if (!isVestingAccount.value || !account.value) {
    return undefined;
  }
  
  const accountType = account.value['@type'] || '';
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Handle EthOwnedMultiContinuousVestingAccount with multiple vesting schedules
  if (accountType.includes('EthOwnedMultiContinuousVestingAccount') && account.value.infos) {
    let totalVestedAmount = 0;
    let hasValidSchedule = true;
    
    // Sum vested amounts across all schedules
    account.value.infos.forEach((info) => {
      const originalVesting = Number(info.original_vesting?.[0]?.amount || 0);
      const startTime = Number(info.start_time || 0);
      const endTime = Number(info.end_time || 0);
      
      const vestedAmount = calculateVestedAmount(originalVesting, startTime, endTime, currentTime);
      if (vestedAmount !== undefined) {
        totalVestedAmount += vestedAmount;
      } else {
        hasValidSchedule = false;
        return;
      }
    });
    
    return hasValidSchedule ? totalVestedAmount : undefined;
  }
  
  // Handle single vesting schedule (EthOwnedContinuousVestingAccount)
  if (account.value.vesting_account) {
    const vestingAccount = account.value.vesting_account;
    const startTime = Number(vestingAccount.start_time || 0);
    const endTime = Number(vestingAccount.base_vesting_account?.end_time || 0);
    const originalVesting = Number(vestingAccount.base_vesting_account?.original_vesting?.[0]?.amount || 0);
    
    return calculateVestedAmount(originalVesting, startTime, endTime, currentTime);
  }
  
  return undefined;
});

// Get total original vesting amount across all schedules
const totalOriginalVesting = computed(() => {
  if (!isVestingAccount.value || !account.value) {
    return undefined;
  }
  
  const accountType = account.value['@type'] || '';
  
  if (accountType.includes('EthOwnedMultiContinuousVestingAccount') && account.value.infos) {
    let total = 0;
    let hasValidSchedule = true;
    
    account.value.infos.forEach((info) => {
      const originalVesting = Number(info.original_vesting?.[0]?.amount || 0);
      const startTime = Number(info.start_time || 0);
      const endTime = Number(info.end_time || 0);
      
      if (originalVesting > 0 && startTime < endTime) {
        total += originalVesting;
      } else {
        hasValidSchedule = false;
        return;
      }
    });
    
    return hasValidSchedule ? total : undefined;
  }
  
  if (account.value.vesting_account) {
    const vestingAccount = account.value.vesting_account;
    const originalVesting = Number(vestingAccount.base_vesting_account?.original_vesting?.[0]?.amount || 0);
    const startTime = Number(vestingAccount.start_time || 0);
    const endTime = Number(vestingAccount.base_vesting_account?.end_time || 0);
    
    if (originalVesting === 0 || startTime >= endTime) return undefined;
    return originalVesting;
  }
  
  return undefined;
});

// Calculate vesting percentage for vesting accounts
const vestedPercentage = computed(() => {
  if (!isVestingAccount.value || !account.value) {
    return undefined;
  }
  
  const vested = theoreticalVestedAmount.value;
  const total = totalOriginalVesting.value;
  
  // If either value is undefined, return undefined
  if (vested === undefined || total === undefined) {
    return undefined;
  }
  
  // If total is 0, return 0 (not undefined)
  if (total === 0) {
    return 0;
  }
  
  return (vested / total) * 100;
});

// Helper to get the primary denom from balances
const primaryDenom = computed(() => balances.value?.[0]?.denom);

// Get detailed information about individual vesting schedules for multi-vesting accounts
const vestingScheduleDetails = computed(() => {
  if (!isVestingAccount.value || !account.value) {
    return [];
  }
  
  const accountType = account.value['@type'] || '';
  
  // Handle EthOwnedMultiContinuousVestingAccount with multiple vesting schedules
  if (accountType.includes('EthOwnedMultiContinuousVestingAccount') && account.value.infos) {
    const currentTime = Math.floor(Date.now() / 1000);
    
    return account.value.infos.map((info, index) => {
      const originalVesting = Number(info.original_vesting?.[0]?.amount || 0);
      const startTime = Number(info.start_time || 0);
      const endTime = Number(info.end_time || 0);
      
      let vestedAmount = 0;
      let percentage = 0;
      let status = 'Not Started';
      
      if (originalVesting > 0 && startTime < endTime) {
        if (currentTime <= startTime) {
          // Vesting hasn't started for this schedule
          status = 'Not Started';
          percentage = 0;
        } else if (currentTime >= endTime) {
          // Vesting completed for this schedule
          status = 'Completed';
          vestedAmount = originalVesting;
          percentage = 100;
        } else {
          // Linear vesting progress for this schedule
          status = 'Active';
          const vestedTime = currentTime - startTime;
          const totalVestingTime = endTime - startTime;
          const progress = vestedTime / totalVestingTime;
          vestedAmount = Math.floor(originalVesting * progress);
          percentage = progress * 100;
        }
      }
      
      return {
        index: index + 1,
        originalVesting,
        vestedAmount,
        lockedAmount: originalVesting - vestedAmount,
        startTime: new Date(startTime * 1000),
        endTime: new Date(endTime * 1000),
        percentage,
        status,
        denom: info.original_vesting?.[0]?.denom || primaryDenom.value
      };
    });
  }
  
  // Handle single vesting schedule (EthOwnedContinuousVestingAccount)
  if (account.value.vesting_account) {
    const currentTime = Math.floor(Date.now() / 1000);
    const vestingAccount = account.value.vesting_account;
    const originalVesting = Number(vestingAccount.base_vesting_account?.original_vesting?.[0]?.amount || 0);
    const startTime = Number(vestingAccount.start_time || 0);
    const endTime = Number(vestingAccount.base_vesting_account?.end_time || 0);
    
    let vestedAmount = 0;
    let percentage = 0;
    let status = 'Not Started';
    
    if (originalVesting > 0 && startTime < endTime) {
      if (currentTime <= startTime) {
        status = 'Not Started';
        percentage = 0;
      } else if (currentTime >= endTime) {
        status = 'Completed';
        vestedAmount = originalVesting;
        percentage = 100;
      } else {
        status = 'Active';
        const vestedTime = currentTime - startTime;
        const totalVestingTime = endTime - startTime;
        const progress = vestedTime / totalVestingTime;
        vestedAmount = Math.floor(originalVesting * progress);
        percentage = progress * 100;
      }
    }
    
    return [{
      index: 1,
      originalVesting,
      vestedAmount,
      lockedAmount: originalVesting - vestedAmount,
      startTime: new Date(startTime * 1000),
      endTime: new Date(endTime * 1000),
      percentage,
      status,
      denom: vestingAccount.base_vesting_account?.original_vesting?.[0]?.denom || primaryDenom.value
    }];
  }
  
  return [];
});

// Check if this is a multi-vesting account
const isMultiVestingAccount = computed(() => {
  if (!account.value) return false;
  const accountType = account.value['@type'] || '';
  return accountType.includes('EthOwnedMultiContinuousVestingAccount') && account.value.infos && account.value.infos.length > 1;
});

// Get number of vesting schedules for badge display
const vestingScheduleCount = computed(() => {  
  if (!isVestingAccount.value || !account.value) return 0;
  
  const accountType = account.value['@type'] || '';
  
  if (accountType.includes('EthOwnedMultiContinuousVestingAccount') && account.value.infos) {
    return account.value.infos.length;
  }
  
  if (account.value.vesting_account) {
    return 1;
  }
  
  return 0;
});

// Separate function to load balances after we know the account type
function loadBalances(address: string) {
  // Always load regular balances
  blockchain.rpc.getBankBalances(address).then((x) => {
    balances.value = x.balances;
    
    // For vesting accounts, also load spendable balances
    if (isVestingAccount.value) {
      blockchain.rpc.getBankSpendableBalances(address).then((spendableResponse) => {
        spendableBalances.value = spendableResponse.balances;
      }).catch((error) => {
        console.warn('Failed to load spendable balances for vesting account:', error);
        // For vesting accounts, if spendable balances fail, use regular balances as a fallback
        spendableBalances.value = x.balances;
      });
    } else {
      // For non-vesting accounts, spendable balances are the same as regular balances
      spendableBalances.value = x.balances;
    }
  }).catch((error) => {
    console.error('Failed to load regular balances:', error);
    balances.value = [];
    spendableBalances.value = [];
  });
}

function loadAccount(address: string) {
  blockchain.rpc.getAuthAccount(address).then((x) => {
    account.value = x.account;
    
    // Detect if this is a vesting account
    isVestingAccount.value = detectVestingAccount(x.account);
    
    // Load balances after we know the account type
    loadBalances(address);
  });
  blockchain.rpc.getTxsBySender(address).then((x) => {
    txs.value = x.tx_responses;
  });
  blockchain.rpc.getDistributionDelegatorRewards(address).then((x) => {
    rewards.value = x;
  });
  blockchain.rpc.getStakingDelegations(address).then((x) => {
    delegations.value = x.delegation_responses;
  });
  blockchain.rpc.getStakingDelegatorUnbonding(address).then((x) => {
    unbonding.value = x.unbonding_responses;
    x.unbonding_responses?.forEach((y) => {
      y.entries.forEach((z) => {
        unbondingTotal.value += Number(z.balance);
      });
    });
  });

  const receivedQuery =  `?order_by=2&events=coin_received.receiver='${address}'&pagination.limit=5`;
  blockchain.rpc.getTxs(receivedQuery, {}).then((x) => {
    recentReceived.value = x.tx_responses;
  });
}

function updateEvent() {
  loadAccount(props.address);
}

function mapAmount(events:{type: string, attributes: {key: string, value: string}[]}[]) {
  if(!events) return []
  return events.find(x => x.type==='coin_received')?.attributes
    .filter(x => x.key === 'YW1vdW50'|| x.key === `amount`)
    .map(x => x.key==='amount'? x.value : String.fromCharCode(...fromBase64(x.value)))
}

// Helper function to detect vesting account types
function detectVestingAccount(account: AuthAccount): boolean {
  const accountType = account['@type'] || '';
  return accountType.includes('VestingAccount') || 
         accountType.includes('EthOwnedContinuousVestingAccount') ||
         accountType.includes('EthOwnedMultiContinuousVestingAccount');
}
</script>
<template>
  <div v-if="account">
    <!-- address -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <div class="flex items-center">
        <!-- img -->
        <div class="inline-flex relative w-11 h-11 rounded-md">
          <div
            class="w-11 h-11 absolute rounded-md opacity-10 bg-primary"
          ></div>
          <div
            class="w-full inline-flex items-center align-middle flex-none justify-center"
          >
            <Icon
              icon="mdi-qrcode"
              class="text-primary"
              style="width: 27px; height: 27px"
            />
          </div>
        </div>
        <!-- content -->
        <div class="flex flex-1 flex-col truncate pl-4">
          <h2 class="text-sm card-title">
            {{ $t('account.address') }}:
          </h2>
          <span class="text-xs truncate"> {{ address }}</span>
          <span v-if="isVestingAccount" class="text-xs text-warning mt-1">
            <span class="badge badge-warning badge-sm mr-2">
              <Icon icon="mdi-lock-clock" class="mr-1" size="12" />
              <span v-if="vestingScheduleCount > 1">
                {{ vestingScheduleCount }} Vesting Schedules
              </span>
              <span v-else>
                Vesting Account
              </span>
              <div class="tooltip tooltip-right" :data-tip="vestingScheduleCount > 1 ? 
                'This account has multiple vesting schedules with different timelines' : 
                'This account has tokens that vest over time'">
                <Icon icon="mdi-information" class="ml-1 opacity-60" size="10" />
              </div>
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- Assets -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <div class="flex justify-between">
        <h2 class="card-title mb-4">{{ $t('account.assets') }}</h2>
        <!-- button -->
        <div class="flex justify-end mb-4 pr-5">
            <label
              for="send"
              class="btn btn-primary btn-sm mr-2"
              @click="dialog.open('send', {}, updateEvent)"
              >{{ $t('account.btn_send') }}</label
            >
            <label
              for="transfer"
              class="btn btn-primary btn-sm"
              @click="
                dialog.open(
                  'transfer',
                  {
                    chain_name: blockchain.current?.prettyName,
                  },
                  updateEvent
                )
              "
              >{{ $t('account.btn_transfer') }}</label
            >
          </div>
      </div>
      <div class="grid md:!grid-cols-3">
        <div class="md:!col-span-1">
          <DonutChart :series="totalAmountByCategory" :labels="labels" />
        </div>
        <div class="mt-4 md:!col-span-2 md:!mt-0 md:!ml-4">          
          <!-- list-->
          <div class="">
            <!--balances  -->
            <!-- For vesting accounts, show spendable and vesting amounts -->
            <template v-if="isVestingAccount">
              <!-- Spendable (Available) Balance -->
              <div class="flex items-center px-4 mb-2">
                <div
                  class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
                >
                  <Icon icon="mdi-account-cash" class="text-info" size="20" />
                  <div
                    class="absolute top-0 bottom-0 left-0 right-0 bg-info opacity-20"
                  ></div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-semibold">
                    {{ format.formatToken({
                      amount: String(totalAmountByCategory[0]),
                      denom: balances[0]?.denom || 'FUEL'
                    }) }} <span class="text-xs text-info">Spendable</span>
                  </div>
                  <div class="text-xs">
                    {{ format.calculatePercent(totalAmountByCategory[0], totalAmount) }}
                  </div>
                </div>
                <div
                  class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:invert mr-2"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:invert text-sm"
                  ></span>
                  ${{ format.tokenValue({
                    amount: String(totalAmountByCategory[0]),
                    denom: balances[0]?.denom || 'FUEL'
                  }) }}
                </div>
              </div>
              
              <!-- Vesting (Locked) Balance -->
              <div class="flex items-center px-4 mb-2">
                <div
                  class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
                >
                  <Icon icon="mdi-lock" class="text-warning" size="20" />
                  <div
                    class="absolute top-0 bottom-0 left-0 right-0 bg-warning opacity-20"
                  ></div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-semibold">
                    {{ format.formatToken({
                      amount: String(totalAmountByCategory[4]),
                      denom: balances[0]?.denom || 'FUEL'
                    }) }} <span class="text-xs text-warning">Vesting</span>
                  </div>
                  <div class="text-xs">
                    {{ format.calculatePercent(totalAmountByCategory[4], totalAmount) }}
                  </div>
                </div>
                <div
                  class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:invert mr-2"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:invert text-sm"
                  ></span>
                  ${{ format.tokenValue({
                    amount: String(totalAmountByCategory[4]),
                    denom: balances[0]?.denom || 'FUEL'
                  }) }}
                </div>
              </div>
            </template>
            
            <!-- For regular accounts, show normal balances -->
            <template v-else>
              <div
                class="flex items-center px-4 mb-2"
                v-for="(balanceItem, index) in balances"
                :key="index"
              >
                <div
                  class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
                >
                  <Icon icon="mdi-account-cash" class="text-info" size="20" />
                  <div
                    class="absolute top-0 bottom-0 left-0 right-0 bg-info opacity-20"
                  ></div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-semibold">
                    {{ format.formatToken(balanceItem) }} <span class="text-xs text-info">Spendable</span>
                  </div>
                  <div class="text-xs">
                    {{ format.calculatePercent(balanceItem.amount, totalAmount) }}
                  </div>
                </div>
                <div
                  class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:invert mr-2"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:invert text-sm"
                  ></span>
                  ${{ format.tokenValue(balanceItem) }}                
                </div>
              </div>
            </template>
            <!--delegations  -->
            <div
              class="flex items-center px-4 mb-2"
              v-for="(delegationItem, index) in delegations"
              :key="index"
            >
              <div
                class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
              >
                <Icon icon="mdi-user-clock" class="text-warning" size="20" />
                <div
                  class="absolute top-0 bottom-0 left-0 right-0 bg-warning opacity-20"
                ></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{ format.formatToken(delegationItem?.balance) }} <span class="text-xs text-warning">Delegated</span>
                </div>
                <div class="text-xs">
                  {{
                    format.calculatePercent(
                      delegationItem?.balance?.amount,
                      totalAmount
                    )
                  }}
                </div>
              </div>
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:invert mr-2"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:invert text-sm"
                ></span>
                ${{ format.tokenValue(delegationItem?.balance) }}                
              </div>
            </div>
            <!-- rewards.total -->
            <div
              class="flex items-center px-4 mb-2"
              v-for="(rewardItem, index) in rewards.total"
              :key="index"
            >
              <div
                class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
              >
                <Icon
                  icon="mdi-account-arrow-up"
                  class="text-success"
                  size="20"
                />
                <div
                  class="absolute top-0 bottom-0 left-0 right-0 bg-success opacity-20"
                ></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{ format.formatToken(rewardItem) }} <span class="text-xs text-success">Rewards</span>
                </div>
                <div class="text-xs">{{ format.calculatePercent(rewardItem.amount, totalAmount) }}</div>
              </div>
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:invert mr-2"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary  dark:invert text-sm"
                ></span>${{ format.tokenValue(rewardItem) }}
                
              </div>
            </div>
            <!-- mdi-account-arrow-right -->
            <div class="flex items-center px-4">
              <div
                class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
              >
                <Icon
                  icon="mdi-account-arrow-right"
                  class="text-error"
                  size="20"
                />
                <div
                  class="absolute top-0 bottom-0 left-0 right-0 bg-error opacity-20"
                ></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{
                    format.formatToken({
                      amount: String(unbondingTotal),
                      denom: stakingStore.params.bond_denom,
                    })
                  }} <span class="text-xs text-error">Unbonding</span>
                </div>
                <div class="text-xs">
                  {{ format.calculatePercent(unbondingTotal, totalAmount) }}
                </div>
              </div>
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:invert mr-2"
              >
                <span class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:invert"></span>
                ${{format.tokenValue({
                      amount: String(unbondingTotal),
                      denom: stakingStore.params.bond_denom,
                    })
                  }}                
              </div>
            </div>
          </div>
          <div class="mt-4 text-lg font-semibold mr-5 pl-5 border-t pt-4 text-right">
            {{ $t('account.total_value') }}: ${{ totalValue }}
          </div>
        </div>
      </div>
    </div>

    <!-- Vesting Schedules Details -->
    <div v-if="isVestingAccount && vestingScheduleCount > 0" class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <div class="collapse collapse-arrow">
        <input type="checkbox" class="collapse-toggle" />
        <div class="collapse-title">
          <div class="flex items-center justify-between mb-2">
            <h2 class="card-title flex items-center flex-wrap gap-2">
              <Icon icon="mdi-calendar-multiple" class="mr-2" size="20" />
              Vesting Schedules
              <span class="badge badge-info badge-outline badge-lg">{{ vestingScheduleCount }} schedule{{ vestingScheduleCount > 1 ? 's' : '' }}</span>
              <!-- Summary Badges -->
              <div v-if="vestedPercentage !== undefined" 
                   class="badge badge-lg relative overflow-hidden text-white font-semibold" 
                   :style="{
                     background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${vestedPercentage}%, #374151 ${vestedPercentage}%, #374151 100%)`
                   }">
                <Icon icon="mdi-chart-line" class="mr-1" size="12" />
                {{ vestedPercentage.toFixed(1) }}% vested
              </div>
              <div v-else class="badge badge-lg badge-warning">
                <Icon icon="mdi-alert" class="mr-1" size="12" />
                Vesting Progress N/A
              </div>
              <div class="badge badge-success badge-outline badge-lg">
                <Icon icon="mdi-check-circle" class="mr-1" size="12" />
                {{ theoreticalVestedAmount !== undefined ? 
                  format.formatToken({
                    amount: String(theoreticalVestedAmount),
                    denom: primaryDenom
                  }) + ' vested' : 'Total Vested N/A' }}
              </div>
              <div class="badge badge-warning badge-outline badge-lg">
                <Icon icon="mdi-lock" class="mr-1" size="12" />
                {{ totalOriginalVesting !== undefined && theoreticalVestedAmount !== undefined ? 
                  format.formatToken({
                    amount: String(totalOriginalVesting - theoreticalVestedAmount),
                    denom: primaryDenom
                  }) + ' vesting' : 'Total Remaining Vesting N/A' }}
              </div>
              <div class="badge badge-info badge-outline badge-lg">
                <Icon icon="mdi-sigma" class="mr-1" size="12" />
                {{ totalOriginalVesting !== undefined ? 
                  format.formatToken({
                    amount: String(totalOriginalVesting),
                    denom: primaryDenom
                  }) + " total": 'Total Vesting N/A' }}
              </div>
            </h2>
          </div>
        </div>
        <div class="collapse-content">
          <!-- Vesting Schedules Table -->
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th class="py-3">Schedule</th>
                  <th class="py-3">Status</th>
                  <th class="py-3">Progress</th>
                  <th class="py-3">
                    <div class="tooltip tooltip-bottom" data-tip="Amount of tokens that have been unlocked by the vesting schedule based on time elapsed">
                      Vested
                    </div>
                  </th>
                  <th class="py-3">
                    <div class="tooltip tooltip-bottom" data-tip="Tokens still locked in the vesting schedule, will unlock over the remaining vesting period">
                      Vesting
                    </div>
                  </th>
                  <th class="py-3">Total</th>
                  <th class="py-3">Weight</th>
                  <th class="py-3">Start Date</th>
                  <th class="py-3">End Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="schedule in vestingScheduleDetails" :key="'schedule-' + schedule.index">
                  <td class="py-3">
                    <div class="font-semibold">{{ schedule.index }}</div>
                  </td>
                  <td class="py-3">
                    <span 
                      class="badge badge-sm"
                      :class="{
                        'badge-success': schedule.status === 'Completed',
                        'badge-warning': schedule.status === 'Active',
                        'badge-neutral': schedule.status === 'Not Started'
                      }"
                    >
                      {{ schedule.status }}
                    </span>
                  </td>
                  <td class="py-3">
                    <div class="flex items-center">
                      <div class="w-16 bg-base-300 rounded-full h-2 mr-2">
                        <div 
                          class="h-2 rounded-full"
                          :class="{
                            'bg-success': schedule.status === 'Completed',
                            'bg-warning': schedule.status === 'Active',
                            'bg-neutral': schedule.status === 'Not Started'
                          }"
                          :style="{ width: schedule.percentage + '%' }"
                        ></div>
                      </div>
                      <span class="text-xs">{{ schedule.percentage.toFixed(1) }}%</span>
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="font-semibold text-success">
                      {{ format.formatToken({
                        amount: String(schedule.vestedAmount),
                        denom: schedule.denom
                      }) }}
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="font-semibold text-warning">
                      {{ format.formatToken({
                        amount: String(schedule.lockedAmount),
                        denom: schedule.denom
                      }) }}
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="font-semibold">
                      {{ format.formatToken({
                        amount: String(schedule.originalVesting),
                        denom: schedule.denom
                      }) }}
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="font-semibold">
                      {{ totalOriginalVesting !== undefined ? 
                        format.calculatePercent(schedule.originalVesting, totalOriginalVesting) : 
                        'N/A' }}
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="text-xs">{{ format.toDay(schedule.startTime.toISOString(), 'short') }}</div>
                  </td>
                  <td class="py-3">
                    <div class="text-xs">{{ format.toDay(schedule.endTime.toISOString(), 'short') }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Delegations -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <div class="flex justify-between">
        <h2 class="card-title mb-4">{{ $t('account.delegations') }}</h2>
        <div class="flex justify-end mb-4">
          <label
            for="delegate"
            class="btn btn-primary btn-sm mr-2"
            @click="dialog.open('delegate', {}, updateEvent)"
            >{{ $t('account.btn_delegate') }}</label
          >
          <label
            for="withdraw"
            class="btn btn-primary btn-sm"
            @click="dialog.open('withdraw', {}, updateEvent)"
            >{{ $t('account.btn_withdraw') }}</label
          >
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table w-full text-sm table-zebra">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.validator') }}</th>
              <th class="py-3">{{ $t('account.delegation') }}</th>
              <th class="py-3">{{ $t('account.rewards') }}</th>
              <th class="py-3">{{ $t('account.action') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="delegations.length === 0"><td colspan="10"><div class="text-center">{{ $t('account.no_delegations') }}</div></td></tr>
            <tr v-for="(v, index) in delegations" :key="index">
              <td class="text-caption text-primary py-3">
                <RouterLink
                  :to="`/${chain}/staking/${v.delegation.validator_address}`"
                  >{{
                    format.validatorFromBech32(v.delegation.validator_address) || v.delegation.validator_address
                  }}</RouterLink
                >
              </td>
              <td class="py-3">
                {{ format.formatToken(v.balance, true, '0,0.[000000]') }}
              </td>
              <td class="py-3">
                {{
                  format.formatTokens(
                    rewards?.rewards?.find(
                      (x) =>
                        x.validator_address === v.delegation.validator_address
                    )?.reward
                  )
                }}
              </td>
              <td class="py-3">
                <div v-if="v.balance" class="flex justify-end">
                  <label
                    for="delegate"
                    class="btn btn-primary btn-xs mr-2"
                    @click="
                      dialog.open(
                        'delegate',
                        {
                          validator_address: v.delegation.validator_address,
                        },
                        updateEvent
                      )
                    "
                    >{{ $t('account.btn_delegate') }}</label
                  >
                  <label
                    for="redelegate"
                    class="btn btn-primary btn-xs mr-2"
                    @click="
                      dialog.open(
                        'redelegate',
                        {
                          validator_address: v.delegation.validator_address,
                        },
                        updateEvent
                      )
                    "
                    >{{ $t('account.btn_redelegate') }}</label
                  >
                  <label
                    for="unbond"
                    class="btn btn-primary btn-xs"
                    @click="
                      dialog.open(
                        'unbond',
                        {
                          validator_address: v.delegation.validator_address,
                        },
                        updateEvent
                      )
                    "
                    >{{ $t('account.btn_unbond') }}</label
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Unbonding Delegations -->
    <div
      class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow"
      v-if="unbonding && unbonding.length > 0"
    >
      <h2 class="card-title mb-4">{{ $t('account.unbonding_delegations') }}</h2>
      <div class="overflow-x-auto">
        <table class="table text-sm w-full">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.creation_height') }}</th>
              <th class="py-3">{{ $t('account.initial_balance') }}</th>
              <th class="py-3">{{ $t('account.balance') }}</th>
              <th class="py-3">{{ $t('account.completion_time') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm" v-for="(v, index) in unbonding" :key="index">
              <tr>
                <td class="text-caption text-primary py-3 bg-slate-200" colspan="10">
                  <RouterLink
                    :to="`/${chain}/staking/${v.validator_address}`"
                    >{{
                      v.validator_address
                    }}</RouterLink
                  >
                </td>
              </tr>
              <tr v-for="entry in v.entries">
                <td class="py-3">{{ entry.creation_height }}</td>
                <td class="py-3">
                  {{
                    format.formatToken(
                      {
                        amount: entry.initial_balance,
                        denom: stakingStore.params.bond_denom,
                      },
                      true,
                      '0,0.[00]'
                    )
                  }}
                </td>
                <td class="py-3">
                  {{
                    format.formatToken(
                      {
                        amount: entry.balance,
                        denom: stakingStore.params.bond_denom,
                      },
                      true,
                      '0,0.[00]'
                    )
                  }}
                </td>
                <td class="py-3">
                  <Countdown :time="new Date(entry.completion_time).getTime() - new Date().getTime()" />
                </td>
              </tr>
          </tbody>          
        </table>
      </div>
    </div>

    <!-- Transactions -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">{{ $t('account.transactions') }}</h2>
      <div class="overflow-x-auto">
        <table class="table w-full text-sm">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.height') }}</th>
              <th class="py-3">{{ $t('account.hash') }}</th>
              <th class="py-3">{{ $t('account.messages') }}</th>
              <th class="py-3">{{ $t('account.time') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="txs.length === 0"><td colspan="10"><div class="text-center">{{ $t('account.no_transactions') }}</div></td></tr>
            <tr v-for="(v, index) in txs" :key="index">
              <td class="text-sm py-3">
                <RouterLink :to="`/${chain}/block/${v.height}`" class="text-primary dark:invert">{{
                  v.height
                }}</RouterLink>
              </td>
              <td class="truncate py-3" style="max-width: 200px">
                <RouterLink :to="`/${chain}/tx/${v.txhash}`" class="text-primary dark:invert">
                  {{ v.txhash }}
                </RouterLink>
              </td>
              <td class="flex items-center py-3">
                <div class="mr-2">
                  {{ format.messages(v.tx.body.messages) }}
                </div>
                <Icon
                  v-if="v.code === 0"
                  icon="mdi-check"
                  class="text-success text-lg"
                />
                <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
              </td>
              <td class="py-3">{{ format.toLocaleDate(v.timestamp) }} <span class=" text-xs">({{ format.toDay(v.timestamp, 'from') }})</span> </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Received -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">{{ $t('account.received') }}</h2>
      <div class="overflow-x-auto">
        <table class="table w-full text-sm">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.height') }}</th>
              <th class="py-3">{{ $t('account.hash') }}</th>
              <th class="py-3">{{ $t('account.amount') }}</th>
              <th class="py-3">{{ $t('account.time') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="recentReceived.length === 0"><td colspan="10"><div class="text-center">{{ $t('account.no_transactions') }}</div></td></tr>
            <tr v-for="(v, index) in recentReceived" :key="index">
              <td class="text-sm py-3">
                <RouterLink :to="`/${chain}/block/${v.height}`" class="text-primary dark:invert">{{
                  v.height
                }}</RouterLink>
              </td>
              <td class="truncate py-3" style="max-width: 200px">
                <RouterLink :to="`/${chain}/tx/${v.txhash}`" class="text-primary dark:invert">
                  {{ v.txhash }}
                </RouterLink>
              </td>
              <td class="flex items-center py-3">
                <div class="mr-2">
                  {{ mapAmount(v.events)?.join(", ")}}
                </div>
                <Icon
                  v-if="v.code === 0"
                  icon="mdi-check"
                  class="text-success text-lg"
                />
                <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
              </td>
              <td class="py-3">{{ format.toLocaleDate(v.timestamp) }} <span class=" text-xs">({{ format.toDay(v.timestamp, 'from') }})</span> </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Account -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">{{ $t('account.acc') }}</h2>
      <DynamicComponent :value="account" />
    </div>
  </div>
  <div v-else class="text-no text-sm">{{ $t('account.error') }}</div>
</template>
