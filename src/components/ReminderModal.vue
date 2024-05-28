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
              <label for="text">Reminder</label>
              <input
                class="form-control mb-3"
                type="text"
                placeholder="Reminder"
                v-model="localReminder.text"
                maxlength="30"
                required
              />
            </div>

            <div class="col-md-6">
              <label for="city">City:</label>
              <input
                class="form-control mb-3"
                type="text"
                placeholder="City"
                v-model="localReminder.city"
                required
              />
            </div>

            <div class="col-md-6">
              <label for="time">Time</label>
              <input
                class="form-control mb-3"
                type="time"
                v-model="localReminder.time"
                required
              />
            </div>

            <div class="col-md-6">
              <label for="color">Color</label>
              <input
                class="form-control mb-3 input-color"
                type="color"
                v-model="localReminder.color"
                required
                @input="validateColor"
              />
            </div>
          </div>
        </form>

        <div class="mt-4" v-if="localReminder.weather">
          <h5
            v-if="
              localReminder.weather.description ||
              localReminder.weather.city ||
              localReminder.weather.temperature
            "
          >
            Weather Information
          </h5>
          <span v-if="localReminder.weather.description">
            Description: {{ localReminder.weather.description }} <br />
            City: {{ localReminder.weather.city }} <br />
            Temperature: {{ localReminder.weather.temperature }} °C
          </span>
        </div>
      </div>

      <div class="modal-footer d-flex justify-content-between mt-4">
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
      // Validar campos vacíos
      if (
        !this.localReminder.text ||
        !this.localReminder.city ||
        !this.localReminder.time ||
        !this.localReminder.color
      ) {
        this.$swal({
          title: "Error",
          icon: "error",
          text: "All fields are required.",
        });
        return;
      }

      const selectedDate = new Date(this.date);
      const currentDate = new Date();

      if (selectedDate < currentDate) {
        this.$swal({
          title: "Ups",
          icon: "warning",
          text: "You can't create reminders in past days.",
        });
        return;
      }

      this.localReminder.weather = await this.fetchWeather({
        city: this.localReminder.city,
        date: this.date,
      });

      if (this.isEditing) {
        this.editReminder(this.localReminder);
        this.$swal({
          title: "Reminder Updated",
          icon: "success",
          text: "The reminder has been updated successfully!",
        });
      } else {
        this.localReminder.id = uuidv4();
        this.localReminder.date = this.date;
        this.addReminder(this.localReminder);
        this.$swal({
          title: "Reminder Created",
          icon: "success",
          text: "The reminder has been created successfully!",
        });
      }

      this.$emit("close");
      this.saveRemindersToLocalStorage();
    },

    deleteCurrentReminder() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete",
          cancelButtonText: "Cancel",
          cancelButtonColor: "#d33",
          confirmButtonColor: "#198754",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.deleteReminder(this.localReminder.id);
            this.$swal({
              title: "The reminder has been deleted!",
              icon: "success",
            });
            this.$emit("close");
            this.saveRemindersToLocalStorage();
          } else {
            this.$emit("close");
          }
        });
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
        weather: {},
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
