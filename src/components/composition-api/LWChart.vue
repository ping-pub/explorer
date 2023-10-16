<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  defineExpose,
  defineProps,
} from 'vue';
import { createChart } from 'lightweight-charts';

const props = defineProps({
  type: {
    type: String,
    default: 'candlestick',
  },
  data: {
    type: Array,
    required: true,
  },
  autosize: {
    default: true,
    type: Boolean,
  },
  chartOptions: {
    type: Object,
  },
  seriesOptions: {
    type: Object,
  },
  timeScaleOptions: {
    type: Object,
  },
  priceScaleOptions: {
    type: Object,
  },
});
// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type) {
  return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}
// Lightweight Chart instances are stored as normal JS variables
// If you need to use a ref then it is recommended that you use `shallowRef` instead
let series;
let chart;

const chartContainer = ref();

const fitContent = () => {
  if (!chart) return;
  chart.timeScale().fitContent();
};

const getChart = () => {
  return chart;
};

defineExpose({ fitContent, getChart });

// Auto resizes the chart when the browser window is resized.
const resizeHandler = () => {
  if (!chart || !chartContainer.value) return;
  const dimensions = chartContainer.value.getBoundingClientRect();
  chart.resize(dimensions.width, dimensions.height);
};

// Creates the chart series and sets the data.
const chartData = ref([]);

const addSeriesAndData = () => {
 if (series) {
    chart.removeSeries(series);
  }

  // Tạo biểu đồ mới nếu chưa tồn tại
  if (!chart) {
    chart = createChart(chartContainer.value, props.chartOptions);
  }

  // Thêm series mới
  series = chart.addLineSeries(props.seriesOptions);
  series.setData(chartData.value);
  };

watch(() => props.data[0].data, (newData) => {
  chartData.value = newData;
  addSeriesAndData();

});

onMounted(() => {
  // Create the Lightweight Charts Instance using the container ref.
  chart = createChart(chartContainer.value, props.chartOptions);
  series = chart.addLineSeries(props.seriesOptions);
  chartData.value=props.data[0].data;
  addSeriesAndData();

  if (props.priceScaleOptions) {
    chart.priceScale().applyOptions(props.priceScaleOptions);
  }

  if (props.timeScaleOptions) {
    chart.timeScale().applyOptions(props.timeScaleOptions);
  }

  chart.timeScale().fitContent();

  if (props.autosize) {
    window.addEventListener('resize', resizeHandler);
  }
});

onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }
  if (series) {
    series = null;
  }
});

watch(
  () => props.autosize,
  (enabled) => {
    if (!enabled) {
      window.removeEventListener('resize', resizeHandler);
      return;
    }
    window.addEventListener('resize', resizeHandler);
  }
);




watch(
  () => props.chartOptions,
  (newOptions) => {
    if (!chart) return;
    chart.applyOptions(newOptions);
  }
);

watch(
  () => props.seriesOptions,
  (newOptions) => {
    if (!series) return;
    series.applyOptions(newOptions);
  }
);

watch(
  () => props.priceScaleOptions,
  (newOptions) => {
    if (!chart) return;
    chart.priceScale().applyOptions(newOptions);
  }
);

watch(
  () => props.timeScaleOptions,
  (newOptions) => {
    if (!chart) return;
    chart.timeScale().applyOptions(newOptions);
  }
);

</script>

<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>

<style scoped>
.lw-chart {
  height: 100%;
}
</style>
