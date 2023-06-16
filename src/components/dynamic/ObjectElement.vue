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
            class="capitalize whitespace-break-spaces min-w-max"
          >
            {{ String(k).replaceAll('_', ' ') }}
          </td>
          <td class="w-4/5">
            <div class="overflow-hidden w-auto whitespace-normal" >
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
