<template>
  <div>
    <h1>Lista de Torneos</h1>
    <!-- Buscador -->
    <!-- Buscador -->
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre..."
        class="search-input"
    />

    <!-- Filtro por fecha -->
    <label for="fechaFiltro">Fecha:</label>
    <input v-model="fechaFiltro" id="fechaFiltro" type="date" />

    <!-- Filtro por cantidad de participantes -->
    <label for="participantesMin">Participantes Mínimos:</label>
    <input
        v-model.number="participantesMin"
        id="participantesMin"
        type="number"
        placeholder="Mínimos"
    />

    <!-- Tabla -->
    <table>
      <thead>
      <tr>
        <th>Nombre</th>
        <th>Fecha</th>
        <th>Participantes</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="torneo in paginatedTorneos" :key="torneo.id">
        <td>{{ torneo.nombre }}</td>
        <td>{{ torneo.fecha }}</td>
        <td>{{ torneo.participantes.map((id) => obtenerNombreRobot(id)).join(", ") }}</td>
        <td>
          <button @click="editarTorneo(torneo.id)">Editar</button>
          <button @click="eliminarTorneo(torneo.id)">Eliminar</button>
          <button @click="simularTorneo(torneo)">Simular</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Controles de Paginación -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Siguiente</button>
    </div>
  </div>
</template>

<script>

import apiClient from "../services/api";

export default {
  data() {
    return {
      torneos: [],
      robots: [], // Lista de robots
      searchQuery: "",
      fechaFiltro: "", // Fecha seleccionada
      participantesMin: null, // Participantes mínimos
      currentPage: 1,
      itemsPerPage: 5, // Elementos por página
    };
  },
  computed: {
    filteredTorneos() {
      return this.torneos.filter((torneo) => {
        // Filtrar por nombre
        const matchesSearch = torneo.nombre
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());

        // Filtrar por fecha
        const matchesFecha =
            !this.fechaFiltro || torneo.fecha === this.fechaFiltro;

        // Filtrar por cantidad de participantes
        const matchesParticipantes =
            this.participantesMin === null ||
            torneo.participantes.length >= this.participantesMin;

        return matchesSearch && matchesFecha && matchesParticipantes;
      });
    },
    paginatedTorneos() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTorneos.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTorneos.length / this.itemsPerPage);
    },
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    editarTorneo(id) {
      this.$router.push(`/torneos/edit/${id}`);
    },
    eliminarTorneo(id) {
      if (confirm("¿Estás seguro de que deseas eliminar este torneo?")) {
        apiClient.delete(`/torneos/${id}`).then(() => {
          alert("Torneo eliminado");
          this.torneos = this.torneos.filter((torneo) => torneo.id !== id);
        });
      }
    },
    // Obtener el nombre de un robot por ID
    obtenerNombreRobot(id) {
      const robot = this.robots.find((robot) => robot.id === id);
      return robot ? robot.nombre : "Desconocido";
    },

    // Navegar a la simulación con los datos del torneo
    simularTorneo(torneo) {
      // Asegúrate de que torneo.participantes sea un array válido antes de enviarlo
      if (!Array.isArray(torneo.participantes)) {
        console.error('Los participantes no son un array válido');
        return;
      }

      const participantesString = JSON.stringify(torneo.participantes);
      console.error('Participanes:' + participantesString);
      this.$router.push({
        name: 'SimulacionTorneo',
        params: { 
          participantes: encodeURIComponent(participantesString) // Codificar para URL
        }
      });
    },
  },
  mounted() {
    // Obtener torneos y robots
    Promise.all([
      fetch("http://localhost:3000/torneos").then(response => response.json()),
      fetch("http://localhost:3000/robots").then(response => response.json())
    ])
        .then(([torneos, robots]) => {
          this.torneos = torneos; // Assign fetched torneos
          this.robots = robots;   // Assign fetched robots
        })
        .catch(error => {
          console.error("Error al cargar los datos:", error); // Log the error
          alert("Error al cargar los datos"); // Notify the user
        });
  },
};
</script>
<style>
.search-input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

select,
input[type="number"],
input[type="date"] {
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th,
table td {
  padding: 0.8rem;
  text-align: left;
  border: 1px solid #ddd;
}
</style>
