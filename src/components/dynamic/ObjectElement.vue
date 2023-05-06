<script lang="ts" setup>
import DynamicComponent from './DynamicComponent.vue';
import { select } from './index';

const props = defineProps(['value']);
</script>
<template>
  <div class="overflow-x-auto">
    <table class="table w-full text-sm">
      <tbody>
        <tr v-for="(v, k) of value">
          <td class="text-capitalize" style="max-width: 200px">{{ k }}</td>
          <td>
            <div
              class="overflow-hidden w-auto whitespace-normal"
              style="max-width: 1000px"
            >
              <Component
                v-if="v"
                :is="select(v, 'horizontal')"
                :value="v"
              ></Component>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
