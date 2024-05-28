<template>
  <div class="calendar py-5">
    <div class="month mb-4">
      <button class="btn btn-outline-primary" @click="prevMonth">Anterior</button>
      <strong>
        <span> {{ monthYear }} </span>
      </strong>
      <button class="btn btn-outline-primary" @click="nextMonth">Siguiente</button>
    </div>

    <hr />

    <div class="weekdays bg-primary mb-4 p-3">
      <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
    </div>

    <div class="days">
      <div
        v-for="day in daysInMonth"
        :key="day.date"
        class="day size-number"
        :class="{
          today: day.isToday,
          'prev-month': day.isPrevMonth,
          'next-month': day.isNextMonth,
        }"
      >
        <span
          @click="addReminder(day.date, day.number)"
          :style="{ backgroundColor: day.color }"
          class="style-number"
        >
          {{ day.number }}
        </span>

        <div
          v-for="reminder in day.reminders"
          :key="reminder.id"
          :style="{ background: reminder.color }"
          @click="editReminder(reminder, day.date)"
          class="mb-1"
        >
          <div>
            <p>{{ reminder.time }} - {{ reminder.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <ReminderModal
      v-if="showModal"
      @close="closeModal"
      :date="selectedDate"
      :reminder="selectedReminder"
    />
  </div>
</template>

<script>
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  subMonths,
  addMonths,
} from "date-fns";
import { mapActions, mapGetters } from "vuex";
import ReminderModal from "./ReminderModal.vue";

export default {
  components: { ReminderModal },
  data() {
    return {
      currentDate: new Date(),
      showModal: false,
      selectedDate: null,
      selectedReminder: null,
    };
  },
  computed: {
    ...mapGetters(["reminders"]),
    daysOfWeek() {
      return [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
    },
    monthYear() {
      return format(this.currentDate, "MMMM yyyy");
    },
    daysInMonth() {
      const start = startOfMonth(this.currentDate);
      const end = endOfMonth(this.currentDate);

      const days = eachDayOfInterval({ start, end })
        .map((date) => {
          if (!date) return null;
          const formattedDate = format(date, "yyyy-MM-dd");
          const reminders = this.reminders.filter(
            (r) => format(new Date(r.date), "yyyy-MM-dd") === formattedDate
          );
          return {
            date,
            number: format(date, "d"),
            reminders,
            isToday: isToday(date),
            isPrevMonth: false,
            isNextMonth: false,
          };
        })
        .filter((day) => day !== null);

      const prevMonthDays = this.getPrevMonthPaddingDays(start);
      const nextMonthDays = this.getNextMonthPaddingDays(end, start);
      return [...prevMonthDays, ...days, ...nextMonthDays];
    },
  },
  methods: {
    ...mapActions(["addReminder", "editReminder", "deleteReminder"]),
    getPrevMonthPaddingDays(start) {
      const prevMonth = subMonths(start, 1);
      const daysInPrevMonth = eachDayOfInterval({
        start: startOfMonth(prevMonth),
        end: endOfMonth(prevMonth),
      });
      const paddingDays = daysInPrevMonth.slice(-getDay(start)).map((date) => ({
        date,
        number: format(date, "d"),
        reminders: [],
        isToday: isToday(date),
        isPrevMonth: true,
        isNextMonth: false,
      }));
      return paddingDays;
    },
    getNextMonthPaddingDays(end, start) {
      const nextMonth = addMonths(end, 1);
      const daysInNextMonth = eachDayOfInterval({
        start: startOfMonth(nextMonth),
        end: endOfMonth(nextMonth),
      });
      const daysToFill =
        42 - (getDay(end) + 1) - eachDayOfInterval({ start, end }).length;
      const paddingDays = daysInNextMonth.slice(0, daysToFill).map((date) => ({
        date,
        number: format(date, "d"),
        reminders: [],
        isToday: isToday(date),
        isPrevMonth: false,
        isNextMonth: true,
      }));
      return paddingDays;
    },
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
      this.selectedDate = date;
      this.selectedReminder = null;
      this.showModal = true;
    },
    editReminder(reminder, date) {
      this.selectedDate = date;
      this.selectedReminder = reminder;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedDate = null;
      this.selectedReminder = null;
    },
    loadRemindersFromLocalStorage() {
      // Cargar desde el almacenamiento local (localStorage)
      const reminders = JSON.parse(localStorage.getItem("reminders"));
      if (reminders) {
        this.$store.commit("SET_REMINDERS", reminders);
      }
    },
  },
  mounted() {
    // Cargar recordatorios desde el almacenamiento local al montar el componente
    this.loadRemindersFromLocalStorage();
  },
};
</script>
<style scoped>
.calendar {
  width: 100%;
  margin: 0 auto;
}
.month {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.weekdays {
  color: #fff;
}
.weekdays,
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.day {
  padding: 10px;
  border: 1px solid #e2dbdb;
  cursor: pointer;
}
.today {
  background-color: #0d6efd;
  color: #fff;
}
.prev-month,
.next-month {
  color: #ccc;
}

.size-number {
  height: 100px;
  font-size: 14px;
  overflow: auto;
}

.style-number {
  margin-right: 90%;
}
</style>
