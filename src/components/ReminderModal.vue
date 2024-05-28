<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>{{ isEditing ? "Editar Recordatorio" : "Agregar Recordatorio" }}</h2>
      <form @submit.prevent="saveReminder">
        <div>
          <label for="text">Texto:</label>
          <input type="text" v-model="reminder.text" maxlength="30" required />
        </div>
        <div>
          <label for="city">Ciudad:</label>
          <input type="text" v-model="reminder.city" required />
        </div>
        <div>
          <label for="time">Hora:</label>
          <input type="time" v-model="reminder.time" required />
        </div>
        <div>
          <label for="color">Color:</label>
          <input type="color" v-model="reminder.color" />
        </div>
        <button type="submit">{{ isEditing ? "Actualizar" : "Agregar" }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";

export default {
  props: ["date", "reminder"],
  data() {
    return {
      isEditing: !!this.reminder,
      reminderData: this.reminder || {
        id: uuidv4(),
        text: "",
        city: "",
        time: "",
        color: "#ffffff",
        date: this.date,
      },
    };
  },
  methods: {
    ...mapActions(["addReminder", "editReminder", "fetchWeather"]),

    async saveReminder() {
      if (this.isEditing) {
        const weather = await this.fetchWeather({
          city: this.reminder.city,
          date: this.reminder.time,
        });

        this.reminder.weather = weather;
        this.editReminder(this.reminder);
      } else {
        const weather = await this.fetchWeather({
          city: this.reminder.city,
          date: this.reminder.time,
        });
        this.reminder.weather = weather;
        this.addReminder(this.reminder);
      }
      this.$emit("close");
    },

    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #888;
  width: 80%;
  max-width: 400px;
}
.close {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 24px;
  margin-top: 10px;
  margin-right: 10px;
  cursor: pointer;
}
.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
