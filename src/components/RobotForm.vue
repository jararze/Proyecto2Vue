<template>
  <div>
    <h1>{{ isEditing ? "Editar Robot" : "Crear Robot" }}</h1>
    <form @submit.prevent="guardarRobot">
      <label for="nombre">Nombre:</label>
      <input v-model="robot.nombre" id="nombre" type="text" required />
      <span v-if="errors.nombre" class="error">{{ errors.nombre }}</span>

      <label for="fuerza">Fuerza:</label>
      <input v-model.number="robot.fuerza" id="fuerza" type="number" min="0" max="100" />
      <span v-if="errors.fuerza" class="error">{{ errors.fuerza }}</span>

      <label for="velocidad">Velocidad:</label>
      <input v-model.number="robot.velocidad" id="velocidad" type="number" min="0" max="100" />
      <span v-if="errors.velocidad" class="error">{{ errors.velocidad }}</span>

      <label for="defensa">Defensa:</label>
      <input v-model.number="robot.defensa" id="defensa" type="number" min="0" max="100" />
      <span v-if="errors.defensa" class="error">{{ errors.defensa }}</span>

      <label for="estado">Estado:</label>
      <select v-model="robot.estado">
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
      <span v-if="errors.estado" class="error">{{ errors.estado }}</span>

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
      robot: {
        nombre: "",
        fuerza: 0,
        velocidad: 0,
        defensa: 0,
        estado: "Activo",
      },
      errors: {
        nombre: "",
        fuerza: "",
        velocidad: "",
        defensa: "",
        estado: "",
      },
      isEditing: false,
    };
  },
  methods: {
    validarFormulario() {
      this.errors = {
        nombre: "",
        fuerza: "",
        velocidad: "",
        defensa: "",
        estado: "",
      };

      let valido = true;

      // Validar nombre
      if (!this.robot.nombre || this.robot.nombre.length < 3) {
        this.errors.nombre = "El nombre debe tener al menos 3 caracteres.";
        valido = false;
      }

      // Validar fuerza
      if (this.robot.fuerza < 0 || this.robot.fuerza > 100) {
        this.errors.fuerza = "La fuerza debe estar entre 0 y 100.";
        valido = false;
      }

      // Validar velocidad
      if (this.robot.velocidad < 0 || this.robot.velocidad > 100) {
        this.errors.velocidad = "La velocidad debe estar entre 0 y 100.";
        valido = false;
      }

      // Validar defensa
      if (this.robot.defensa < 0 || this.robot.defensa > 100) {
        this.errors.defensa = "La defensa debe estar entre 0 y 100.";
        valido = false;
      }

      // Validar estado
      if (this.robot.estado !== "Activo" && this.robot.estado !== "Inactivo") {
        this.errors.estado = "El estado debe ser 'Activo' o 'Inactivo'.";
        valido = false;
      }

      return valido;
    },

    guardarRobot() {
      if (!this.validarFormulario()) {
        return;
      }

      if (this.isEditing) {
        apiClient.put(`/robots/${this.id}`, this.robot).then(() => {
          alert("Robot actualizado");
          this.$router.push("/robots");
        });
      } else {
        apiClient.post("/robots", this.robot).then(() => {
          alert("Robot creado");
          this.$router.push("/robots");
        });
      }
    },
  },
  mounted() {
    if (this.id) {
      this.isEditing = true;
      console.log("Editando robot con ID:", this.id); // Depuración
      // Cargar datos del robot si estamos en modo edición
      apiClient.get(`/robots/${this.id}`).then((response) => {
        console.log("Datos del robot:", response.data); // Depuración
        this.robot = response.data;
      });
    }
  },
};
</script>
<style>
.error {
  color: red;
  font-size: 0.9rem;
}
</style>
