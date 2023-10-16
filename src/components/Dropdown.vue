
<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
 placement:String,
 userName:String
});
</script>
<template>
<Dropdown :placement="placement">
        <Button>{{userName}}</Button>
        <template #overlay>
          <Menu>
            <MenuItem>
              <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
              </a>
            </MenuItem>
            <MenuItem>
              <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
              </a>
            </MenuItem>
            <MenuItem>
              <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
              </a>
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>
</template>