<script lang="ts" setup>
import { select } from './index';

const props = defineProps(['value']);
</script>
<template>
  <div class="overflow-auto">
    <table class="table table-compact w-full text-sm">
      <tbody>
        <tr v-for="(v, k) of value">
          <td
            class="text-capitalize whitespace-break-spaces w-1/5"
            style="min-width: 180px"
          >
            {{ String(k).replaceAll('_', ' ') }}
          </td>
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
