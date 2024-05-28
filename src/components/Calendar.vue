<template>
  <div class="calendar py-5">
    <div class="month mb-4">
      <button class="btn btn-outline-primary" @click="prevMonth"> Anterior </button>
      <strong> <span> {{ monthYear }} </span> </strong>
      <button class="btn btn-outline-primary" @click="nextMonth"> Siguiente </button>
    </div>

    <hr />

    <div class="weekdays mb-4 p-3">
      <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
    </div>

    <div class="days">
      <div v-for="day in daysInMonth" :key="day.date" class="day">
        <span
          @click="addReminder(day.date, day.number)"
          :style="{ backgroundColor: day.color }"
          >{{ day.number }}</span
        >
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

      const days = eachDayOfInterval({ start, end })
        .map((date) => {
          if (!date) return null; // Verificar si la fecha es válida

          const formattedDate = format(date, "yyyy-MM-dd");

          const reminders = this.reminders.filter(
            (r) => format(new Date(r.date), "yyyy-MM-dd") === formattedDate
          );

          return {
            date,
            number: format(date, "d"),
            reminders,
          };
        })
        .filter((day) => day !== null); // Filtrar los días nulos

      const paddingDays = new Array(getDay(start))
        .fill(null)
        .map((_, i) => ({ date: null, number: "", reminders: [], color: "#ffffff" })); // Use white as default color for padding days
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

    addReminder(date, day) {
      console.log(date, "fecha");
      console.log(day, "number");
      this.selectedDate = { date, day };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedDate = null;
    },
  },
};
</script>

<style>
.calendar {
  width: 100%;
  margin: 0 auto;
}

.month {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.weekdays {
    background: #eee;
}

.weekdays,
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.day {
  padding: 10px;
  border: 1px solid #90b9f7;
}
</style>
