import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state() {
    return {
      reminders: [],
    };
  },
  mutations: {
    ADD_REMINDER(state, reminder) {
      state.reminders.push(reminder);
    },

    EDIT_REMINDER(state, updatedReminder) {
      const index = state.reminders.findIndex(r => r.id === updatedReminder.id);
      if (index !== -1) {
        state.reminders[index] = updatedReminder;
      }
    },

    DELETE_REMINDER(state, id) {
      state.reminders = state.reminders.filter(r => r.id !== id);
    },

    SET_REMINDERS(state, reminders) {
      state.reminders = reminders;
    },
  },
  actions: {
    addReminder({ commit }, reminder) {
      commit('ADD_REMINDER', reminder);
    },

    editReminder({ commit }, updatedReminder) {
      commit('EDIT_REMINDER', updatedReminder);
    },

    deleteReminder({ commit }, id) {
      commit('DELETE_REMINDER', id);
    },

    async fetchWeather(_, { city, date }) {
      try {
        const APIKEY = "3492ea6beb2c2f1cffbcbe13cae6f7b7"
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`);
        const weatherData = response.data;
    
        return {
          description: weatherData.weather[0].description,
          city: weatherData.name,
          temperature: weatherData.main.temp,
          icon: weatherData.weather[0].icon
        };
        
      } catch (error) {
        console.error("Error fetching weather data", error);
        return null;
      }
    },
    
  },
  getters: {
    reminders: state => state.reminders,
  },
});

export default store;
