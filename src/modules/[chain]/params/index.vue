<script lang="ts" setup>
import { useFormatter, useParamStore, useStakingStore } from '@/stores';
import { ref, onMounted, computed } from 'vue';
import CardParameter from '@/components/CardParameter.vue';
import ArrayObjectElement from '@/components/dynamic/ArrayObjectElement.vue';
import ApexCharts from 'vue3-apexcharts';
import { Icon } from '@iconify/vue';
import type { Validator } from '@/types';
import type { NodeInfo } from '@/types/base';

interface ValidatorNodeInfo {
  validator: Validator;
  nodeInfo: NodeInfo | null;
}

interface VersionData {
  count: number;
  validators: Validator[];
}

const store = useParamStore();
const stakingStore = useStakingStore();
const chain = ref(store.chain);
const validatorVersions = ref<Record<string, VersionData>>({});
const isLoading = ref(true);
const format = useFormatter()


onMounted(async () => {
  // fetch the data
  await store.initial();
  isLoading.value = false;
  
  // Fetch validators to analyze versions
  await loadValidatorVersions();
});

async function loadValidatorVersions() {
  // Get active validators
  const validators = await stakingStore.fetchValidators('BOND_STATUS_BONDED');
  
  // Get node info for each validator
  const validatorNodes = await Promise.all(
    validators.map(async (validator) => {
      try {
        // In a real implementation, we would fetch each validator's node info
        // For now, we'll mock this with the current node version
        const nodeInfo = await store.fetchAbciInfo();
        return {
          validator,
          nodeInfo
        } as ValidatorNodeInfo;
      } catch (error) {
        console.error(`Failed to fetch node info for validator ${validator.description.moniker}`, error);
        return {
          validator,
          nodeInfo: null
        } as ValidatorNodeInfo;
      }
    })
  );
  
  // Extract version information
  const versionMap: Record<string, VersionData> = {};
  validatorNodes.forEach(data => {
    if (data.nodeInfo && data.nodeInfo.application_version) {
      const version = data.nodeInfo.application_version.version;
      if (!versionMap[version]) {
        versionMap[version] = {
          count: 0,
          validators: []
        };
      }
      versionMap[version].count++;
      versionMap[version].validators.push(data.validator);
    }
  });
  
  validatorVersions.value = versionMap;
}

const latestVersion = computed(() => {
  if (!store.appVersion?.items?.length) return null;
  const versionItem = store.appVersion.items.find(item => item.subtitle === 'version');
  return versionItem ? versionItem.value : null;
});

const versionChartOptions = computed(() => {
  return {
    chart: {
      type: 'donut',
      height: 220,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        speed: 500,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    labels: Object.keys(validatorVersions.value).map(version => `v${version}`),
    dataLabels: {
      enabled: true,
      formatter: function(val: number) {
        return Math.round(val) + '%'
      },
      style: {
        fontSize: '12px',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 600,
      },
      dropShadow: {
        enabled: true,
        opacity: 0.3,
        blur: 3,
        left: 0,
        top: 0
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 600,
              formatter: function(val: number) {
                return val
              }
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 500,
              formatter: function() {
                return stakingStore.validators.length
              }
            }
          }
        },
        expandOnClick: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    legend: {
      position: 'bottom',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      labels: {
        colors: 'rgba(255, 255, 255, 0.8)'
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'system-ui, sans-serif'
      },
      y: {
        title: {
          formatter: function(seriesName: string) {
            return 'Version ' + seriesName + ':'
          }
        },
        formatter: function(value: number) {
          return `${value} validators (${Math.round(value / stakingStore.validators.length * 100)}%)`
        }
      }
    },
    stroke: {
      width: 2,
      colors: ['transparent']
    }
  };
});

const versionChartSeries = computed(() => {
  return Object.values(validatorVersions.value).map((v: VersionData) => v.count);
});

function formatTitle(v: string) {
  if(!v) return ""
  // capitalize the first letter of each word
  return v.replace(/_/g, " ").replace('bonded', 'Staked').replace('unbonding', 'Unstaking').replace('unbonded', 'Unstaked').replace(/\b\w/g, (char) => char.toUpperCase())
}
</script>
<template>
  <div>
  <p class="bg-[#09279F;] dark:bg-base-200 text-2xl rounded-md px-4 py-2 my-4 font-bold text-[#ffffff;]">Parameters</p>
  <div class="overflow-hidden">
    <!-- Chain ID -->
    <div class="bg-base-100 px-4 pt-3 pb-4 w-[80%;] rounded-md">
      <div class="flex items-center mb-4">
        <!-- <Icon icon="mdi:cube-outline" class="text-2xl text-info mr-2" /> -->
        <div class="text-[30px]/[40px] font-semibold text-main">{{ chain.title }}</div>
      </div>
      <div
        class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4"
      >
        <div
          v-for="(item, index) of chain.items"
          :key="index"
          class="rounded-2xl bg-base-200 px-4 py-3 hover:bg-base-300"
        >
          <div class="text-xs mb-2 text-secondary flex items-center justify-center">
            <Icon :icon="`mdi:${item.icon || 'information-outline'}`" class="mr-1 text-info" />
            {{ formatTitle(item.subtitle) }}
          </div>
          <div class="text-base text-main font-medium overflow-hidden text-ellipsis flex items-center justify-center">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <!-- Validator Version Distribution -->
<div class="bg-base-100 px-4 pt-3 pb-4 rounded-md mt-6">
  <div class="flex items-center mb-4">
    <!-- Title -->
    <div class="text-[30px]/[40px] font-semibold text-main">
      Validator Version Distribution
    </div>
  </div>

  <div v-if="isLoading" class="flex justify-center py-8">
    <div class="loading loading-spinner loading-lg text-primary"></div>
  </div>

  <div v-else>
    <!-- Row for Version Box + Status Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
      <!-- Version Box (small width) -->
      <div class="md:col-span-1">
        <div v-for="(versionData, version) in validatorVersions" :key="version" 
          class="bg-base-200 p-4 rounded-2xl hover:bg-base-300"
          :class="versionData.count === stakingStore.validators.length ? 'border-success' : versionData.count > stakingStore.validators.length / 2 ? 'border-primary' : 'border-warning'">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center">
              <!-- <Icon icon="mdi:tag-text" class="mr-2 text-primary" /> -->
              <span class="text-[#64748B;] font-semibold">v{{ version }}</span>
            </div>
            <!-- <span class="badge badge-lg" 
              :class="versionData.count === stakingStore.validators.length ? 'badge-success' : versionData.count > stakingStore.validators.length / 2 ? 'badge-primary' : 'badge-warning'">
              {{ Math.round(versionData.count / stakingStore.validators.length * 100) }}%
            </span>         -->
          </div>
          <div class="text-sm dark:text-gray-200 text-[#171C1F;] flex justify-between items-center mb-2">
            <span class="font-medium">{{ versionData.count }} out of {{ stakingStore.validators.length }} validators </span>
            <span class="badge badge-lg dark:bg-success bg-[#6AC13633;] dark:text-[#171C1F;] text-[#60BC29;]" 
              :class="versionData.count === stakingStore.validators.length ? 'badge-success' : versionData.count > stakingStore.validators.length / 2 ? 'badge-primary' : 'badge-warning'">
              {{ Math.round(versionData.count / stakingStore.validators.length * 100) }}%
            </span>
          </div>
          <div class="mt-3 w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
            <div class="h-2.5 rounded-full transition-all duration-500 bg-[#60BC29;]" 
              :class="versionData.count === stakingStore.validators.length ? 'bg-success' : versionData.count > stakingStore.validators.length / 2 ? 'bg-primary' : 'bg-warning'"
              :style="`width: ${versionData.count / stakingStore.validators.length * 100}%`"></div>
          </div>
        </div>
      </div>

      <!-- Status Summary Box (bigger width) -->
      <div class="md:col-span-2 w-[50%;]">
        <div class="p-3 rounded-2xl border-[#60BC29;] h-full flex items-center"
          :class="Object.keys(validatorVersions).length === 1 ? 'bg-success/10 border border-success/20' : Object.keys(validatorVersions).length > 1 ? 'bg-warning/10 border border-warning/20' : 'bg-base-200'">
          <Icon :icon="Object.keys(validatorVersions).length === 1 ? 'mdi:check-circle' : 'mdi:alert-circle'" 
            class="text-3xl mr-2" 
            :class="Object.keys(validatorVersions).length === 1 ? 'text-[#60BC29;]' : 'text-warning'" />
          <div>
            <span class="text-xs">
              <span v-if="Object.keys(validatorVersions).length === 1" class="dark:text-[#60BC29;] text-[#171C1F;]">
                All validators are running the latest protocol version.
              </span>
              <span v-else-if="Object.keys(validatorVersions).length > 1" class="text-warning">
                Multiple validator versions detected
              </span>
              <span v-else class="text-secondary">
                No validator version data available
              </span>
            </span>
            <p class="text-xs mt-1 text-secondary">
              <span v-if="Object.keys(validatorVersions).length === 1" class="dark:text-gray-200 text-[#171C1FA6;]">
                Network is synchronized with all validators on the same software version.
              </span>
              <span v-else-if="Object.keys(validatorVersions).length > 1">
                Network upgrade in progress. Some validators may need to update their software.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<!-- Custom template for CardParameter components -->
<div class="bg-base-100 px-4 pt-3 pb-4 rounded-md mt-6 shadow-md border-t-4 border-success"
  v-if="store.mint?.items && store.mint?.items?.length > 0">
  <div class="flex items-center mb-4">
    <Icon icon="mdi:cash-multiple" class="text-2xl text-success mr-2" />
    <div class="text-lg font-semibold text-main">{{ store.mint?.title }}</div>
  </div>
  <div class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4">
    <div
      v-for="(item, index) of store.mint?.items"
      :key="index"
      class="rounded-md bg-base-200 px-4 py-3 hover:bg-base-300 transition-all duration-200 border-l-4 border-success/50"
    >
      <div class="text-xs mb-2 text-secondary flex items-center">
        <Icon icon="mdi:currency-usd" class="mr-1 text-success" />
        <span class="capitalize">{{ formatTitle(item?.subtitle) }}</span>
      </div>
      <div class="text-base text-main font-medium overflow-hidden text-ellipsis">{{ item?.value }}</div>
    </div>
  </div>
</div>

    
    <!-- Staking Parameters -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md mt-6"
      v-if="store.staking?.items && store.staking?.items?.length > 0">
      <div class="flex items-center mb-4">
        <!-- <Icon icon="mdi:bank" class="text-2xl text-secondary mr-2" /> -->
        <div class="text-[30px]/[40px] font-semibold text-main">{{ store.staking?.title }}</div>
      </div>
      <div class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4">
        <div
          v-for="(item, index) of store.staking?.items"
          :key="index"
          class="rounded-2xl bg-base-200 px-4 py-3 hover:bg-base-300"
        >
          <div class="text-xs mb-2 text-[#64748B;] flex items-center justify-center">
            <!-- <Icon icon="mdi:gavel" class="mr-1 text-secondary" /> -->
            <span class="capitalize">{{ formatTitle(item?.subtitle) }}</span>
          </div>
          <div class="text-base text-main font-medium overflow-hidden text-ellipsis flex justify-center items-center">{{ item?.value }}</div>
        </div>
      </div>
    </div>
    
    <!-- Governance Parameters -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md mt-6"
      v-if="store.gov?.items && store.gov?.items?.length > 0">
      <div class="flex items-center mb-4">
        <!-- <Icon icon="mdi:gavel" class="text-2xl text-accent mr-2" /> -->
        <div class="text-[30px]/[40px] font-semibold text-main">{{ store.gov?.title }}</div>
      </div>
      <div class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-6 2xl:!grid-cols-7 gap-4">
        <div
          v-for="(item, index) of store.gov?.items"
          :key="index"
          class="rounded-md bg-base-200 px-4 py-3 hover:bg-base-300"
        >
          <div class="text-xs mb-2 text-[#64748B;] flex items-center justify-center">
            <!-- <Icon icon="mdi:vote" class="mr-1 text-accent" /> -->
            <span class="capitalize">{{ formatTitle(item?.subtitle) }}</span>
          </div>
          <div class="text-xs text-main font-medium overflow-hidden text-ellipsis flex items-center justify-center">{{ item?.subtitle == 'min_deposit' ? format.formatToken(item.value[0]) : item?.value }}</div>
        </div>
      </div>
    </div>
    
    <!-- Distribution Parameters -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md mt-6"
      v-if="store.distribution?.items && store.distribution?.items?.length > 0">
      <div class="flex items-center mb-4">
        <!-- <Icon icon="mdi:share-variant" class="text-2xl text-warning mr-2" /> -->
        <div class="text-[30px]/[40px] font-semibold text-main">{{ store.distribution?.title }}</div>
      </div>
      <div class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4">
        <div
          v-for="(item, index) of store.distribution?.items"
          :key="index"
          class="rounded-2xl bg-base-200 px-4 py-3 hover:bg-base-300"
        >
          <div class="text-xs mb-2 text-[#64748B;] flex items-center justify-center">
            <!-- <Icon icon="mdi:percent" class="mr-1 text-warning" /> -->
            <span class="capitalize">{{ formatTitle(item?.subtitle) }}</span>
          </div>
          <div class="text-base text-main font-medium overflow-hidden text-ellipsis flex items-center justify-center">{{ item?.value }}</div>
        </div>
      </div>
    </div>
    
    <!-- Slashing Parameters -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md mt-6"
      v-if="store.slashing?.items && store.slashing?.items?.length > 0">
      <div class="flex items-center mb-4">
        <!-- <Icon icon="mdi:alert" class="text-2xl text-error mr-2" /> -->
        <div class="text-[30px]/[40px] font-semibold text-main">{{ store.slashing?.title }}</div>
      </div>
      <div class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4">
        <div
          v-for="(item, index) of store.slashing?.items"
          :key="index"
          class="rounded-2xl bg-base-200 px-4 py-3 hover:bg-base-300"
        >
          <div class="text-xs mb-2 text-[#64748B;] flex items-center justify-center">
            <!-- <Icon icon="mdi:sword" class="mr-1 text-error" /> -->
            <span class="capitalize">{{ formatTitle(item?.subtitle) }}</span>
          </div>
          <div class="text-base text-main font-medium overflow-hidden text-ellipsis flex items-center justify-center">{{ item?.value }}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<route>
{
  meta: {
    i18n: 'parameters',
    order: 50
  }
}
</route>
