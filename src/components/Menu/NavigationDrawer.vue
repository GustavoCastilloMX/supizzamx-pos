<template>
  <v-navigation-drawer v-model="drawer" app mini-variant right permanent color="rojoSupizza">
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>John Leider</v-list-item-title>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item link>
        <v-list-item-content>
          <v-icon dark>mdi-message-bulleted</v-icon>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-content>
          <v-icon dark>{{ item.icon }}</v-icon>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    items: [
      { icon: "mdi-point-of-sale" },
      { icon: "mdi-account-arrow-right" },
    ],
  }),
};
</script>

<style lang="scss" scoped>
</style>