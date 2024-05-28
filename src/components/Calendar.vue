<template>
  <div class="calendar mt-5">
    <div class="header d-flex justify-content-between mb-5">
      <button @click="previousMonth" class="btn btn-outline-primary">Anterior</button>
      <div>{{ monthName }} {{ year }}</div>
      <button @click="nextMonth" class="btn btn-outline-primary">Siguiente</button>
    </div>

    <div class="days-of-week d-flex mb-5">
      <div v-for="day in daysOfWeek" :key="day" class="flex-grow-1 text-center">
        {{ day }}
      </div>
    </div>

    <div class="days">
      <div v-for="empty in emptyDays" :key="'empty-' + empty"></div>
      <button
        v-for="day in daysInMonth"
        :key="day"
        :class="['day-button btn', isToday(day) ? 'btn-primary' : 'btn-outline-primary']"
        @click="openModal('#create_event', day)"
      >
        {{ day }}
      </button>
    </div>
  </div>

  <create-event />
</template>

<script>
import { Modal } from "bootstrap";

import CreateEvent from "./modals/CreateEvent.vue";

export default {
  components: { CreateEvent },

  data() {
    return {
      currentDate: new Date(),
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      modalOpen: null,
    };
  },

  computed: {
    year() {
      return this.currentDate.getFullYear();
    },
    month() {
      return this.currentDate.getMonth();
    },
    monthName() {
      return this.currentDate
        .toLocaleString("default", { month: "long" })
        .replace(/^\w/, (c) => c.toUpperCase());
    },
    daysInMonth() {
      const days = new Date(this.year, this.month + 1, 0).getDate();
      return Array.from({ length: days }, (_, i) => i + 1);
    },
    emptyDays() {
      const firstDay = new Date(this.year, this.month, 1).getDay();
      return Array.from({ length: firstDay });
    },
  },

  methods: {
    previousMonth() {
      this.currentDate.setMonth(this.month - 1);
      this.currentDate = new Date(this.currentDate);
    },

    nextMonth() {
      this.currentDate.setMonth(this.month + 1);
      this.currentDate = new Date(this.currentDate);
    },

    openModal(id, day) {
      const modalId = id.startsWith("#") ? id.slice(1) : id;
      const modal = document.getElementById(modalId);
      this.modalOpen = new Modal(modal);

      this.modalOpen.show();
    },

    closeModal() {
      this.modalOpen.hide();
      this.getUsers();
    },

    isToday(day) {
      const today = new Date();
      return (
        day === today.getDate() &&
        this.month === today.getMonth() &&
        this.year === today.getFullYear()
      );
    },
  },
};
</script>

<style scoped>
.calendar {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.days-of-week {
  background-color: #eee;
  padding: 20px;
}
.days-of-week div {
  flex: 1;
}
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
.day-button {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
