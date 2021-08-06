<template>
  <b-card
    title="Address"
    class="align-items-stretch "
  >
    <!-- address media -->
    <b-media
      class="mb-1"
      no-body
    >
      <b-media-aside class="mr-1">
        <b-avatar
          rounded
          variant="light-primary"
          size="34"
        >
          <feather-icon
            icon="UserIcon"
            size="18"
          />
        </b-avatar>
      </b-media-aside>
      <b-media-body class="text-truncate">
        <h6 class="mb-0">
          Account Address
        </h6>
        <small>{{ accountAddress }}</small>
      </b-media-body>
    </b-media>
    <b-media
      class="mb-1"
      no-body
    >
      <b-media-aside class="mr-1">
        <b-avatar
          rounded
          variant="light-primary"
          size="34"
        >
          <feather-icon
            icon="Link2Icon"
            size="18"
          />
        </b-avatar>
      </b-media-aside>
      <b-media-body class="text-truncate">
        <h6 class="mb-0">
          Validator Address
        </h6>
        <small>{{ operatorAddress }}</small>
      </b-media-body>
    </b-media>
    <b-media
      class="mb-1"
      no-body
    >
      <b-media-aside class="mr-1">
        <b-avatar
          rounded
          variant="light-primary"
          size="34"
        >
          <feather-icon
            icon="KeyIcon"
            size="18"
          />
        </b-avatar>
      </b-media-aside>
      <b-media-body class="text-truncate">
        <h6 class="mb-0">
          Consensus Public Address
        </h6>
        <small>{{ consensusPubkey }}</small>
      </b-media-body>
    </b-media>
    <b-media
      class="mb-1 text-truncate"
      no-body
    >
      <b-media-aside class="mr-1">
        <b-avatar
          rounded
          variant="light-primary"
          size="34"
        >
          <feather-icon
            icon="HashIcon"
            size="18"
          />
        </b-avatar>
      </b-media-aside>
      <b-media-body>
        <h6 class="mb-0">
          Hex Address
        </h6>
        <small>{{ hexAddress }}</small>
      </b-media-body>
    </b-media>
  </b-card>
</template>

<script>
import {
  BCard, BAvatar, BMedia, BMediaAside, BMediaBody, VBTooltip,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BAvatar,
    BMedia,
    BMediaAside,
    BMediaBody,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    operatorAddress: {
      type: String,
      default: '-',
    },
    accountAddress: {
      type: String,
      default: '-',
    },
    consensusPubkey: {
      type: [Object, String],
      required: true,
    },
    hexAddress: {
      type: String,
      default: '-',
    },
  },
}
</script>

<style scoped>
.media small {
  white-space:nowrap;
  overflow: hidden;
}
</style>
