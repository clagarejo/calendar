<template>
  <div class="calendar py-5 row">
    <div class="month mb-4 col-sm-12 col-lg-12">
      <button class="btn btn-outline-primary" @click="prevMonth">Anterior</button>
      <strong>
        <span>{{ monthYear }}</span>
      </strong>
      <button class="btn btn-outline-primary" @click="nextMonth">Siguiente</button>
    </div>

    <hr />

    <div class="weekdays bg-primary mb-4 p-3 col-sm-12 col-lg-12">
      <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
    </div>

    <div class="days col-sm-12 col-lg-12">
      <div
        v-for="day in daysInMonth"
        :key="day ? day.date : Math.random()"
        class="day-wrapper"
      >
        <div
          v-if="day"
          @click="!day.isPast && addReminder(day.date, day.number)"
          class="day size-number"
          :class="{ today: day.isToday, past: day.isPast }"
        >
          <span :style="{ backgroundColor: day.color }" class="style-number">
            {{ day.number }}
          </span>

          <div
            v-for="reminder in day.reminders"
            :key="reminder.id"
            :style="{ background: reminder.color }"
            @click="editReminder(reminder, day.date)"
            :class="{
              'mb-1': true,
              'text-white': reminder.color.toLowerCase() !== '#ffffff',
            }"
          >
            {{ reminder.time }} - {{ reminder.text }}
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
  isPast,
  subMonths,
  addMonths,
  isBefore,
  startOfToday,
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
      const today = startOfToday();

      const days = eachDayOfInterval({ start, end }).map((date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        const reminders = this.reminders
          .filter((r) => format(new Date(r.date), "yyyy-MM-dd") === formattedDate)
          .sort(
            (a, b) =>
              new Date(`1970-01-01T${a.time}:00`) - new Date(`1970-01-01T${b.time}:00`)
          );
        return {
          date,
          number: format(date, "d"),
          reminders,
          isToday: isToday(date),
          isPast: isBefore(date, today), // Only dates before today are marked as past
        };
      });

      const firstDayOfMonth = getDay(start);
      const daysArray = Array(firstDayOfMonth).fill(null).concat(days);

      return daysArray;
    },
  },
  methods: {
    ...mapActions(["addReminder", "editReminder", "deleteReminder"]),
    prevMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
    },
    addReminder(date) {
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
      const reminders = JSON.parse(localStorage.getItem("reminders"));
      if (reminders) {
        this.$store.commit("SET_REMINDERS", reminders);
      }
    },
  },
  mounted() {
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
.day-wrapper {
  height: 100px;
}
.day {
  padding: 10px;
  border: 1px solid #e2dbdb;
  border-radius: 5%;
  cursor: pointer;
  height: 100%;
}
.today {
  background-color: #0d6efd;
  color: #fff;
}
.past {
  color: #aba9a9;
  cursor: not-allowed;
}
.size-number {
  height: 100%;
  font-size: 14px;
  overflow: auto;
}
.style-number {
  margin-right: 90%;
}
</style>
