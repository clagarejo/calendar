<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header mb-3">
        <span class="close p-3" @click.prevent="closeModal">&times;</span>
        <h4>{{ isEditing ? "Edit reminder" : "Add reminder" }}</h4>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveReminder">
          <div class="row">
            <div class="col-md-6">
              <label for="text">Remidnder</label>
              <input
                class="form-control mb-3"
                type="text"
                placeholder="Recordario"
                v-model="localReminder.text"
                maxlength="30"
                required
                @input="validateColor"
              />
            </div>

            <div class="col-md-6">
              <label for="city">City:</label>
              <input
                class="form-control mb-3"
                type="text"
                placeholder="Bogota"
                v-model="localReminder.city"
                required
                @input="validateColor"
              />
            </div>

            <div class="col-md-6">
              <label for="time">Time</label>
              <input
                class="form-control mb-3"
                type="time"
                v-model="localReminder.time"
                required
                @input="validateColor"
              />
            </div>

            <div class="col-md-6">
              <label for="color">Color</label>
              <input
                class="form-control mb-3 input-color"
                type="color"
                v-model="localReminder.color"
                @input="validateColor"
              />
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer d-flex justify-content-between">
        <div>
          <button
            class="btn btn-danger px-4 py-2"
            v-if="isEditing"
            @click.prevent="deleteCurrentReminder"
          >
            Delete
          </button>
        </div>

        <div class="d-flex">
          <button
            class="btn btn-outline-danger space px-4 py-2"
            @click.prevent="closeModal"
          >
            Cancel
          </button>

          <button
            class="btn btn-primary px-4 py-2"
            type="submit"
            @click.prevent="saveReminder"
          >
            {{ isEditing ? "Update" : "Save" }}
          </button>
        </div>
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
      localReminder: this.reminder ? { ...this.reminder } : this.newReminder(),
      isEditing: !!this.reminder,
    };
  },

  methods: {
    ...mapActions(["addReminder", "editReminder", "deleteReminder", "fetchWeather"]),
    async saveReminder() {
      const selectedDate = new Date(this.date);
      const currentDate = new Date();

      // Verificar si la fecha seleccionada es anterior a la fecha actual
      if (selectedDate < currentDate) {
        alert("No puedes crear recordatorios en días anteriores a hoy.");
        return;
      }

      const weather = await this.fetchWeather({
        city: this.localReminder.city,
        date: this.date,
      });

      this.localReminder.weather = weather;

      if (this.isEditing) {
        this.editReminder(this.localReminder);
      } else {
        this.localReminder.id = uuidv4();
        this.localReminder.date = this.date;
        this.addReminder(this.localReminder);
      }

      this.$emit("close");
      this.saveRemindersToLocalStorage(); // Guardar en localStorage después de actualizar o guardar
    },

    deleteCurrentReminder() {
      this.deleteReminder(this.localReminder.id);
      this.$emit("close");
      this.saveRemindersToLocalStorage(); // Guardar en localStorage después de eliminar
    },

    closeModal() {
      this.$emit("close");
    },

    validateColor() {
      if (!/^#[0-9A-F]{6}$/i.test(this.localReminder.color)) {
        this.localReminder.color = "#FFFFFF";
      }
    },

    newReminder() {
      return {
        id: uuidv4(),
        text: "",
        city: "",
        time: "",
        color: "#FFFFFF",
        weather: "",
      };
    },

    saveRemindersToLocalStorage() {
      const reminders = JSON.stringify(this.$store.state.reminders);
      localStorage.setItem("reminders", reminders);
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

.space {
  margin-right: 10px;
}

.input-color {
  cursor: pointer;
  height: 35px;
}
</style>
