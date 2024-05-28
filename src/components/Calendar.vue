<template>
  <div class="calendar">
    <div class="header d-flex justify-content-between mb-3">
      <button @click="previousMonth" class="btn btn-primary">Anterior</button>
      <div>{{ monthName }} {{ year }}</div>
      <button @click="nextMonth" class="btn btn-primary">Siguiente</button>
    </div>
    <div class="days-of-week d-flex">
      <div v-for="day in daysOfWeek" :key="day" class="flex-grow-1 text-center">
        {{ day }}
      </div>
    </div>
    <div class="days">
      <div v-for="empty in emptyDays" :key="'empty-' + empty"></div>
      <button
        v-for="day in daysInMonth"
        :key="day"
        class="day-button btn btn-outline-primary"
        @click="openReminderModal(day)"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date(),
      daysOfWeek: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
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
      return this.currentDate.toLocaleString("default", { month: "long" });
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

    openReminderModal(day) {
      console.log("Abrir modal para el día", day);
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
