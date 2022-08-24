<template>
  <b-card
    v-if="data && data.items"
    no-body
    :class="`card-statistics ${data.class} `"
  >
    <b-card-header>
      <b-card-title>{{ data.title }}</b-card-title>
    </b-card-header>
    <b-card-body class="statistics-body">
      <b-row>
        <b-col
          v-for="item in data.items"
          :key="item.icon"
          xl="3"
          md="6"
          sm="6"
          :class="item.customClass"
        >
          <div
            v-if="typeof item.title ==='object'"
          >
            <b-button
              :id="item.subtitle"
              variant="outline-primary"
              class="ml-2"
              size="sm"
            >
              {{ item.subtitle }}
            </b-button>
            <b-popover
              :target="item.subtitle"
              variant="primary"
              triggers="hover"
              placement="bottom"
            >
              <template #title>
                <span>{{ item.subtitle }}</span>
              </template>
              <span>
                <array-field-component
                  v-if="Array.isArray(item.title)"
                  :tablefield="item.title"
                />
                <object-field-component
                  v-else
                  :tablefield="item.title"
                /></span>
            </b-popover>
          </div>
          <b-media
            v-else
            no-body
          >
            <b-media-aside
              class="mr-2"
            >
              <b-avatar
                v-if="item.icon"
                size="48"
                :variant="item.color"
              >
                <feather-icon
                  size="24"
                  :icon="item.icon"
                />
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h4 class="font-weight-bolder mb-0">
                {{ item.title || '-' }}
              </h4>
              <b-card-text class="font-small-3 mb-1 text-capitalize">
                {{ item.subtitle }}
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BRow, BCol, BMedia, BMediaAside, BAvatar, BMediaBody, BPopover, BButton,
} from 'bootstrap-vue'
import ObjectFieldComponent from '../ObjectFieldComponent.vue'
import ArrayFieldComponent from '../ArrayFieldComponent.vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
    BPopover,
    BButton,
    ObjectFieldComponent,
    ArrayFieldComponent,
  },
  props: {
    data: {
      type: [Object, Array],
      default: () => {},
    },
  },
}
</script>
