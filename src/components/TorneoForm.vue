<template>
  <div>
    <h1>{{ isEditing ? "Editar Torneo" : "Crear Torneo" }}</h1>
    <form @submit.prevent="guardarTorneo">
      <label for="nombre">Nombre:</label>
      <input v-model="torneo.nombre" id="nombre" type="text" required />
      <span v-if="errors.nombre" class="error">{{ errors.nombre }}</span>

      <label for="fecha">Fecha:</label>
      <input v-model="torneo.fecha" id="fecha" type="date" required />
      <span v-if="errors.fecha" class="error">{{ errors.fecha }}</span>

      <label for="participantes">Selecciona los Participantes:</label>
      <select v-model="torneo.participantes" id="participantes" multiple>
        <option v-for="robot in robots" :key="robot.id" :value="robot.id">
          {{ robot.nombre }}
        </option>
      </select>
      <span v-if="errors.participantes" class="error">{{ errors.participantes }}</span>

      <button type="submit">{{ isEditing ? "Actualizar" : "Crear" }}</button>
    </form>
  </div>
</template>



<script>
import apiClient from "../services/api";

export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      torneo: {
        nombre: "",
        fecha: "",
        participantes: [],
      },
      errors: {
        nombre: "",
        fecha: "",
        participantes: "",
      },
      robots: [],
      // participantesInput: "",
      isEditing: false,
    };
  },
  methods: {
    validarFormulario() {
      this.errors = {
        nombre: "",
        fecha: "",
        participantes: "",
      };

      let valido = true;

      // Validar nombre
      if (!this.torneo.nombre || this.torneo.nombre.length < 3) {
        this.errors.nombre = "El nombre debe tener al menos 3 caracteres.";
        valido = false;
      }

      // Validar fecha
      if (!this.torneo.fecha) {
        this.errors.fecha = "La fecha es obligatoria.";
        valido = false;
      } else {
        const fechaTorneo = new Date(this.torneo.fecha);
        const fechaActual = new Date();
        if (fechaTorneo < fechaActual) {
          this.errors.fecha = "La fecha debe ser posterior a la fecha actual.";
          valido = false;
        }
      }

      // Validar participantes
      if (this.torneo.participantes.length !== 2) {
        this.errors.participantes = "Debes seleccionar exactamente 2 participantes.";
        valido = false;
      }

      return valido;
    },

    guardarTorneo() {
      if (!this.validarFormulario()) {
        return; // Detener si hay errores
      }

      if (this.isEditing) {
        apiClient.put(`/torneos/${this.id}`, this.torneo).then(() => {
          alert("Torneo actualizado");
          this.$router.push("/torneos");
        });
      } else {
        apiClient.post("/torneos", this.torneo).then(() => {
          alert("Torneo creado");
          this.$router.push("/torneos");
        });
      }
    },
  },
  mounted() {

    // Cargar robots para el selector
    apiClient.get("/robots").then((response) => {
      this.robots = response.data;
    });


    if (this.id) {
      this.isEditing = true;
      // Cargar datos del torneo si estamos en modo edición
      apiClient.get(`/torneos/${this.id}`).then((response) => {
        this.torneo = response.data;
        // this.participantesInput = this.torneo.participantes.join(", ");
      });
    }
  },
};
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
button {
  padding: 0.8rem;
  font-size: 1rem;
}

button {
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #535bf2;
}
select {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

select[multiple] {
  height: auto;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.2rem;
}
</style>
