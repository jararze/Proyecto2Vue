<template>
  <div>
    <h1>Lista de Robots</h1>
    <!-- Buscador -->
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar robots..."
        class="search-input"
    />

    <!-- Filtro por estado -->
    <select v-model="estadoFiltro">
      <option value="">Todos</option>
      <option value="Activo">Activo</option>
      <option value="Inactivo">Inactivo</option>
    </select>

    <!-- Filtro por rango de fuerza -->
    <label for="fuerzaMin">Fuerza Mínima:</label>
    <input v-model.number="fuerzaMin" id="fuerzaMin" type="number" placeholder="Mínima" />

    <label for="fuerzaMax">Fuerza Máxima:</label>
    <input v-model.number="fuerzaMax" id="fuerzaMax" type="number" placeholder="Máxima" />


    <!-- Tabla -->
    <table>
      <thead>
      <tr>
        <th>Nombre</th>
        <th>Fuerza</th>
        <th>Velocidad</th>
        <th>Defensa</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="robot in paginatedRobots" :key="robot.id">
        <td>{{ robot.nombre }}</td>
        <td>{{ robot.fuerza }}</td>
        <td>{{ robot.velocidad }}</td>
        <td>{{ robot.defensa }}</td>
        <td>{{ robot.estado }}</td>
        <td>
          <button @click="editarRobot(robot.id)">Editar</button>
          <button @click="eliminarRobot(robot.id)">Eliminar</button>
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
      robots: [],
      searchQuery: "", // Texto del buscador
      estadoFiltro: "", // Estado seleccionado
      fuerzaMin: null, // Fuerza mínima
      fuerzaMax: null, // Fuerza máxima
      currentPage: 1,
      itemsPerPage: 5, // Elementos por página
    };
  },
  computed: {
    filteredRobots() {
      // Filtrar robots por nombre
      return this.robots.filter((robot) => {
        // Filtrar por nombre
        const matchesSearch = robot.nombre
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());

        // Filtrar por estado
        const matchesEstado =
            !this.estadoFiltro || robot.estado === this.estadoFiltro;

        // Filtrar por rango de fuerza
        const matchesFuerza =
            (this.fuerzaMin === null || robot.fuerza >= this.fuerzaMin) &&
            (this.fuerzaMax === null || robot.fuerza <= this.fuerzaMax);

        return matchesSearch && matchesEstado && matchesFuerza;
      });
    },
    paginatedRobots() {
      // Paginación de robots filtrados
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredRobots.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredRobots.length / this.itemsPerPage);
    },
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    editarRobot(id) {
      this.$router.push(`/robots/edit/${id}`);
    },
    eliminarRobot(id) {
      if (confirm("¿Estás seguro de que deseas eliminar este robot?")) {
        apiClient.delete(`/robots/${id}`).then(() => {
          alert("Robot eliminado");
          this.robots = this.robots.filter((robot) => robot.id !== id);
        });
      }
    },
  },
  mounted() {
    fetch("http://localhost:3000/robots")
        .then((response) => response.json())
        .then((data) => {
          this.robots = data;
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th,
table td {
  padding: 1rem;
  text-align: left;
  border: 1px solid #ddd;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #646cff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
