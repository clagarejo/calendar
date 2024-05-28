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
        }"
      >
        <span class="style-number">
          {{ day.number }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  subMonths,
  addMonths,
} from "date-fns";

export default {
  data() {
    return {
      currentDate: new Date(),
    };
  },
  computed: {
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

      return eachDayOfInterval({ start, end }).map((date) => {
        return {
          date,
          number: format(date, "d"),
          isToday: isToday(date),
        };
      });
    },
  },
  methods: {
    prevMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
    },
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
  border-radius: 5%;
  cursor: pointer;
}
.today {
  background-color: #0d6efd;
  color: #fff;
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
