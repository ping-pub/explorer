<script setup lang="ts">
interface Props {
  totalInput?: number
  default?: string
}

interface Emit {
  (e: 'updateOtp', val: string): void
}

const props = withDefaults(defineProps<Props>(), {
  totalInput: 6,
  default: '',
})

const emit = defineEmits<Emit>()

const digits = ref<string[]>([])
const refOtpComp = ref<HTMLInputElement | null>(null)

digits.value = props.default.split('')

const defaultStyle = {
  style: 'max-width: 54px; text-align: center;',
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.code !== 'Tab' && event.code !== 'ArrowRight' && event.code !== 'ArrowLeft')
    event.preventDefault()

  if (event.code === 'Backspace') {
    digits.value[index - 1] = ''

    if (refOtpComp.value !== null && index > 1) {
      const inputEl = refOtpComp.value.children[index - 2].querySelector('input')

      if (inputEl)
        inputEl.focus()
    }
  }
  const numberRegExp = /^([0-9])$/

  if (numberRegExp.test(event.key)) {
    digits.value[index - 1] = event.key

    if (refOtpComp.value !== null && index !== 0 && index < refOtpComp.value.children.length) {
      const inputEl = refOtpComp.value.children[index].querySelector('input')

      if (inputEl)
        inputEl.focus()
    }
  }

  emit('updateOtp', digits.value.join(''))
}
</script>

<template>
  <div>
    <h6 class="text-base font-weight-bold mb-3">
      Type your 6 digit security code
    </h6>
    <div
      ref="refOtpComp"
      class="d-flex align-center gap-4"
    >
      <VTextField
        v-for="i in props.totalInput"
        :key="i"
        :model-value="digits[i - 1]"
        v-bind="defaultStyle"
        maxlength="1"
        @keydown="handleKeyDown($event, i)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.v-field__field {
  input {
    padding: 0.5rem;
    font-size: 1.25rem;
    text-align: center;
  }
}
</style>
