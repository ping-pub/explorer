<script setup lang="ts">
import ApexCharts from 'vue3-apexcharts';
import { computed, type PropType } from 'vue';
import { useFormatter } from '@/stores';
import type { CommissionRate } from '@/types';

const props = defineProps({
    commission: { type: Object as PropType<CommissionRate> },
});

let rate = computed(
    () => Number(props.commission?.commission_rates.rate || 0) * 100
);
let change = computed(
    () => Number(props.commission?.commission_rates.max_change_rate || 0) * 100
);
let max = computed(
    () => Number(props.commission?.commission_rates.max_rate || 1) * 100
);

const left = rate;
const right = computed(() => max.value - rate.value);

const s1 = computed(() =>
    left.value > change.value ? left.value - change.value : 0
);
const s2 = computed(() =>
    left.value > change.value ? change.value : left.value
);
const s3 = 2;
const s4 = computed(() =>
    right.value > change.value ? change.value : right.value
);
const s5 = computed(() =>
    right.value > change.value ? right.value - change.value : 0
);

const series = computed(() => [s1.value, s2.value, s3, s4.value, s5.value]);

const format = useFormatter();

const chartConfig = computed(() => {

    const secondaryText = `hsl(var(--bc))`;
    const primaryText = `hsl(var(--bc))`;

    return {
        chart: {
            width: '200px',
            sparkline: { enabled: false },
        },
        colors: ['rgba(109,120,141,0.2)', 'rgba(114,225,40,0.2)', 'rgba(114,225,40,1)', 'rgba(114,225,40,0.2)', 'rgba(109,120,141,0.2)'],
        legend: { show: false },
        tooltip: { enabled: false },
        dataLabels: { enabled: false },
        stroke: {
            width: 3,
            lineCap: 'round',
            colors: ['hsl(var(--b1))'],
        },
        labels: [
            'Available',
            'Daily Change',
            'Commission Rate',
            'Daily Change',
            'Available',
        ],
        states: {
            hover: {
                filter: { type: 'none' },
            },
            active: {
                filter: { type: 'none' },
            },
        },
        plotOptions: {
            pie: {
                endAngle: 130,
                startAngle: -130,
                customScale: 0.9,
                donut: {
                    size: '83%',
                    labels: {
                        show: true,
                        name: {
                            offsetY: 25,
                            fontSize: '1rem',
                            color: secondaryText,
                        },
                        value: {
                            offsetY: -15,
                            fontWeight: 500,
                            fontSize: '2.125rem',
                            formatter: (value: unknown) => `${rate.value.toFixed(1)}%`,
                            color: primaryText,
                        },
                        total: {
                            show: true,
                            label: 'Commission Rate',
                            fontSize: '1rem',
                            color: secondaryText,
                            formatter: () => `${rate.value.toFixed(1)}%`,
                        },
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 1709,
                options: {
                    chart: { height: 237 },
                },
            },
        ],
    };
});
</script>

<template>
    <div class="rounded-2xl border border-[#FFB206;] dark:border-gray-700 mb-4 overflow-auto">
        <div class="dark:bg-base-100 bg-base-200 px-4 py-2">
            <h2 class="text-2xl font-semibold text-[#171C1F] dark:text-[#ffffff;]">Commission Rate</h2>
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 px-4 py-2">
            {{ `Updated at ${format.toDay(props.commission?.update_time, 'short')}` }}
        </div>
        <div class="flex flex-row items-center justify-start gap-14">
            <div class="px-4 py-2">
                <div class="flex  flex-col gap-x-3">
                    <div class="flex items-center gap-x-2">
                        <div class="dark:bg-success bg-[#60BC29;] w-[14px] h-[14px] rounded"></div>
                        <span class="text-caption">Rate: {{ rate.toFixed(0) }}%</span>
                    </div>
                    <div class="flex items-center gap-x-2">
                        <div class="dark:bg-success bg-[#E8F3D9;] w-[14px] h-[14px] rounded opacity-60"></div>
                        <span class="text-caption">24h: ±{{ change }}%</span>
                    </div>
                    <div class="flex items-center gap-x-2">
                        <div class="dark:bg-secondary bg-[#E0E3E8;] w-[14px] h-[14px] rounded"></div>
                        <span class="text-caption">Max: {{ max }}%</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-start">
                <ApexCharts type="donut" :options="chartConfig" :series="series" />
            </div>
        </div>
    </div>
</template>
