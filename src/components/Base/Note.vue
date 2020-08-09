<template>
  <v-dialog v-model="showNote" persistent max-width="800">
    <v-card>
      <v-toolbar dense flat color="rojoSupizza" dark class="mb-5">
        <v-toolbar-title class="font-weight-medium">Nota</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-textarea
            outlined
            color="green"
            label="Nota"
            v-model="newNote"
          ></v-textarea>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="cancel">Cancelar</v-btn>
        <v-btn color="green darken-1" dark @click="saveNote">Guardar</v-btn>
      </v-card-actions>
    </v-card>


  </v-dialog>
</template>

<script>

export default {
  name: "NoteComponent",
  props: {
    showNote: {
      type: Boolean,
      required: true,
    },
    note: {
        type: String,
        required: true
    }
  },
  data: () => ({
    newNote: ""
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    saveNote() {
        this.$emit('saveNote', this.newNote);
    }
  },
  watch: {
      showNote: function() {
          if(this.showNote) this.newNote = this.note;
      }
  }
};
</script>

<style lang="scss" scoped>
</style>