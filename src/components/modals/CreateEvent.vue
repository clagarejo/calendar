<template>
  <div
    class="modal fade"
    id="create_event"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between">
          <h5 class="modal-title" id="exampleModalLabel">Crear evento</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="text">Recordatorio:</label>
              <input type="text" v-model="text" maxlength="30" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="city">Ciudad:</label>
              <input type="text" v-model="city" required />
            </div>

            <div class="col-md-6">
              <label for="time">Hora:</label>
              <input type="time" v-model="time" required />
            </div>

            <div class="col-md-6">
              <label for="color">Color:</label>
              <input type="color" v-model="color" required />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
      city: "",
      time: "",
      color: "#000000",
      weather: null,
    };
  },
};
</script>
