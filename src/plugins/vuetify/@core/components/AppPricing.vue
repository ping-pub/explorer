<script setup lang="ts">
import pricingIllustration1 from '@images/misc/pricing-illustration-1.png'
import pricingIllustration2 from '@images/misc/pricing-illustration-2.png'
import pricingIllustration3 from '@images/misc/pricing-illustration-3.png'

interface Pricing {
  title?: string
  xs?: number | string
  sm?: number | string
  md?: string | number
  lg?: string | number
  xl?: string | number
}

const props = defineProps<Pricing>()

const annualMonthlyPlanPriceToggler = ref(true)

const pricingPlans = [
  {
    name: 'Basic',
    tagLine: 'A simple start for everyone',
    logo: pricingIllustration1,
    monthlyPrice: 0,
    yearlyPrice: 0,
    isPopular: false,
    current: true,
    features: [
      '100 responses a month',
      'Unlimited forms and surveys',
      'Unlimited fields',
      'Basic form creation tools',
      'Up to 2 subdomains',
    ],
  },
  {
    name: 'Standard',
    tagLine: 'For small to medium businesses',
    logo: pricingIllustration2,
    monthlyPrice: 49,
    yearlyPrice: 480,
    isPopular: true,
    current: false,
    features: [
      'Unlimited responses',
      'Unlimited forms and surveys',
      'Instagram profile page',
      'Google Docs integration',
      'Custom “Thank you” page',
    ],
  },
  {
    name: 'Enterprise',
    tagLine: 'Solution for big organizations',
    logo: pricingIllustration3,
    monthlyPrice: 99,
    yearlyPrice: 960,
    isPopular: false,
    current: false,
    features: [
      'PayPal payments',
      'Logic Jumps',
      'File upload with 5GB storage',
      'Custom domain support',
      'Stripe integration',
    ],
  },
]
</script>

<template>
  <!-- 👉 Title and subtitle -->
  <div class="text-center">
    <h4 class="pricing-title text-h4 mb-4">
      {{ props.title ? props.title : 'Pricing Plans' }}
    </h4>
    <p class="text-sm mb-0">
      All plans include 40+ advanced tools and features to boost your product.
    </p>
    <p class="text-sm mb-0">
      Choose the best plan to fit your needs.
    </p>
  </div>

  <!-- 👉 Annual and monthly price toggler -->
  <div class="d-flex align-center justify-center mx-auto py-10">
    <VLabel
      for="pricing-plan-toggle"
      class="me-2"
    >
      Monthly
    </VLabel>

    <div class="position-relative">
      <div class="position-absolute price-chip d-none d-sm-flex">
        <VIcon
          icon="mdi-arrow-down-left"
          size="24"
          class="text-disabled flip-in-rtl mt-1 me-1"
        />

        <VChip
          text="Save up to 10%"
          size="x-small"
          color="primary"
        />
      </div>

      <VSwitch
        id="pricing-plan-toggle"
        v-model="annualMonthlyPlanPriceToggler"
        label="Annual"
      />
    </div>
  </div>

  <!-- SECTION pricing plans -->
  <VRow>
    <VCol
      v-for="plan in pricingPlans"
      :key="plan.logo"
      v-bind="props"
      cols="12"
    >
      <!-- 👉  Card -->
      <VCard
        flat
        border
        :class="plan.isPopular ? 'border-primary border-opacity-100' : ''"
      >
        <VCardText
          style="height: 4.125rem;"
          class="text-end"
        >
          <!-- 👉 Popular -->
          <VChip
            v-show="plan.isPopular"
            color="primary"
            size="small"
            class="font-weight-semibold"
          >
            Popular
          </VChip>
        </VCardText>

        <!-- 👉 Plan logo -->
        <VCardText class="text-center">
          <VImg
            :height="100"
            :src="plan.logo"
            class="mx-auto mb-5"
          />

          <!-- 👉 Plan name -->
          <h5 class="text-h5 mb-2">
            {{ plan.name }}
          </h5>
          <p class="mb-0">
            {{ plan.tagLine }}
          </p>
        </VCardText>

        <!-- 👉 Plan price  -->
        <VCardText class="position-relative text-center">
          <div class="d-flex justify-center align-center">
            <sup class="text-sm font-weight-medium me-1">$</sup>
            <h1 class="text-5xl font-weight-medium text-primary">
              {{ annualMonthlyPlanPriceToggler ? Math.floor(Number(plan.yearlyPrice) / 12) : plan.monthlyPrice }}
            </h1>
            <sub class="text-sm font-weight-medium ms-1 mt-4">/month</sub>
          </div>

          <!-- 👉 Annual Price -->
          <span
            v-show="annualMonthlyPlanPriceToggler"
            class="position-absolute text-caption font-weight-medium"
            style="inset-inline: 0;"
          >
            {{ plan.yearlyPrice === 0 ? 'free' : `USD ${plan.yearlyPrice}/Year` }}
          </span>
        </VCardText>

        <!-- 👉 Plan features -->
        <VCardText class="mt-2">
          <VList class="card-list mb-5">
            <VListItem
              v-for="feature in plan.features"
              :key="feature"
            >
              <template #prepend>
                <VIcon
                  :size="14"
                  icon="mdi-circle-outline"
                  class="me-3"
                />
              </template>

              <VListItemTitle class="text-body-2">
                {{ feature }}
              </VListItemTitle>
            </VListItem>
          </VList>

          <VBtn
            block
            :color="plan.current ? 'success' : 'primary'"
            :variant="plan.isPopular ? 'elevated' : 'tonal'"
          >
            {{ plan.yearlyPrice === 0 ? 'Your Current Plan' : 'Upgrade' }}
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <!-- !SECTION  -->
</template>

<style lang="scss" scoped>
.price-chip {
  display: flex;
  inset-block-start: -1.5rem;
  inset-inline-end: -6.5rem;

  // inset-inline-start: 2rem;
}

.card-list {
  --v-card-list-gap: 0.75rem;
}
</style>
