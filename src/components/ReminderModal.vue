<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>

      <h2>{{ isEditing ? "Editar Recordatorio" : "Agregar Recordatorio" }}</h2>

      <div class="modal-body">
        <form @submit.prevent="saveReminder">
          <div class="row">
            <div class="col-md-6">
              <label for="text">Texto:</label>
              <input
                class="form-control mb-3"
                type="text"
                v-model="reminder.text"
                maxlength="30"
                required
                @input="validateColor"
              />
            </div>

            <div class="col-md-6">
              <label for="city">Ciudad:</label>
              <input
                class="form-control mb-3"
                type="text"
                v-model="reminder.city"
                required
                @input="validateColor"
              />
            </div>

            <div class="col-md-6">
              <label for="time">Hora:</label>
              <input
                class="form-control mb-3"
                type="time"
                v-model="reminder.time"
                required
                @input="validateColor"
              />
            </div>

            <div class="col-md-6">
              <label for="color">Color:</label>
              <input
                class="form-control mb-3"
                type="color"
                v-model="reminder.color"
                @input="validateColor"
              />
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-primary px-4 py-2" type="submit">
          {{ isEditing ? "Actualizar" : "Agregar" }}
        </button>
      </div>

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
    };
  },

  methods: {
    ...mapActions(["addReminder", "editReminder", "fetchWeather"]),

    async saveReminder() {
      const weather = await this.fetchWeather({
        city: this.reminder.city,
        date: this.reminder.date,
      });

      this.reminder.weather = weather;

      if (this.isEditing) {
        this.editReminder(this.reminder);
      } else {
        this.addReminder(this.reminder);
      }

      this.$emit("close");
    },

    closeModal() {
      this.$emit("close");
    },

    validateColor() {
      // Verificar si el color tiene el formato correcto
      if (!/^#[0-9A-F]{6}$/i.test(this.reminder.color)) {
        // Si no tiene el formato correcto, establecer un valor predeterminado
        this.reminder.color = "#FFFFFF"; // O cualquier otro valor predeterminado válido
      }
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
  width: 60%;
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
