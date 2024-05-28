<template>
  <div class="calendar">
    <div class="month">
      <button @click="prevMonth">‹</button>
      <span>{{ monthYear }}</span>
      <button @click="nextMonth">›</button>
    </div>

    <div class="weekdays">
      <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
    </div>

    <div class="days">
      <div
        v-for="day in daysInMonth"
        :key="day.date"
        class="day"
        :style="{ backgroundColor: day.color }"
      >
        <span @click="addReminder(day.date)" :style="{ color: day.textColor }">{{
          day.number
        }}</span>
        <div
          v-for="reminder in day.reminders"
          :key="reminder.id"
          :style="{ background: reminder.color }"
        >
          {{ reminder.time }} - {{ reminder.text }}
        </div>
      </div>
    </div>

    <ReminderModal
      v-if="showModal"
      @close="closeModal"
      :date="selectedDate"
      :reminder="reminders"
    />
  </div>
</template>

<script>
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { mapActions, mapGetters } from "vuex";
import ReminderModal from "./ReminderModal.vue";

export default {
  components: { ReminderModal },
  data() {
    return {
      currentDate: new Date(),
      showModal: false,
      selectedDate: null,
    };
  },
  computed: {
    ...mapGetters(["reminders"]),

    daysOfWeek() {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    },

    monthYear() {
      return format(this.currentDate, "MMMM yyyy");
    },

    daysInMonth() {
      const start = startOfMonth(this.currentDate);
      const end = endOfMonth(this.currentDate);
      const days = eachDayOfInterval({ start, end }).map((date) => ({
        date,
        number: format(date, "d"),
        reminders: this.reminders.filter(
          (r) => format(new Date(r.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
        ),
        color: this.getEventColorForDate(date),
        textColor: this.getContrastColor(this.getEventColorForDate(date)),
      }));

      const paddingDays = new Array(getDay(start))
        .fill(null)
        .map((_, i) => ({ date: null, number: "", reminders: [] }));
      return [...paddingDays, ...days];
    },
  },
  methods: {
    ...mapActions(["addReminder", "editReminder", "deleteReminder"]),

    prevMonth() {
      this.currentDate = new Date(
        this.currentDate.setMonth(this.currentDate.getMonth() - 1)
      );
    },

    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.setMonth(this.currentDate.getMonth() + 1)
      );
    },

    addReminder(date) {
      const existingReminder = this.reminders.find(
        (reminder) =>
          format(new Date(reminder.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );

      if (existingReminder) {
        // Si ya existe un recordatorio para esta fecha, abrir en modo de edición
        this.selectedDate = date;
        this.showModal = true;
      } else {
        // Si no existe un recordatorio para esta fecha, abrir en modo de agregar
        this.selectedDate = date;
        this.showModal = true;
      }
    },

    closeModal() {
      this.showModal = false;
      this.selectedDate = null;
    },

    getEventColorForDate(date) {
      const eventsForDate = this.reminders.filter(
        (r) => format(new Date(r.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      if (eventsForDate.length > 0) {
        // Si hay eventos para este día, devolver el color del primer evento
        return eventsForDate[0].color;
      } else {
        // Si no hay eventos para este día, devolver blanco (o el color predeterminado)
        return "white";
      }
    },

    getContrastColor(color) {
      // Convertir el color a rgb
      const rgbColor = this.hexToRgb(color);
      // Calcular el contraste
      const brightness = Math.round(
        (parseInt(rgbColor[0]) * 299 +
          parseInt(rgbColor[1]) * 587 +
          parseInt(rgbColor[2]) * 114) /
          1000
      );
      // Devolver blanco o negro según el contraste
      return brightness > 125 ? "black" : "white";
    },

    hexToRgb(hex) {
      const bigint = parseInt(hex.substring(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    },
  },
};
</script>

<style>
.calendar {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.month {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}
.weekdays,
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}
.day {
  padding: 10px;
  border: 1px solid #ddd;
}
</style>
