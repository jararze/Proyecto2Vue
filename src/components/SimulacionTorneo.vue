<template>
  <div>
    <h1>Simulación de Torneo</h1>


    <div v-if="robot1 && robot2" class="battle-area">
      <h2>{{ robot1.nombre }} vs {{ robot2.nombre }}</h2>

      <div v-if="log.length" class="battle-log">
        <h3>Registro de la Batalla:</h3>
        <ul>
          <li v-for="(event, index) in log" :key="index">{{ event }}</li>
        </ul>
      </div>


      <!-- Barra de vida Robot 1 -->
      <div class="robot">
        <h3>{{ robot1.nombre }}</h3>
        <div class="progress-bar">
          <div class="progress" :style="{ width: robot1Life + '%' }"></div>
        </div>
        <p>Vida: {{ robot1Life }}%</p>
      </div>

      <!-- Barra de vida Robot 2 -->
      <div class="robot">
        <h3>{{ robot2.nombre }}</h3>
        <div class="progress-bar">
          <div class="progress" :style="{ width: robot2Life + '%' }"></div>
        </div>
        <p>Vida: {{ robot2Life }}%</p>
      </div>

      <!-- Botón para iniciar la batalla -->
      <button @click="iniciarBatalla" :disabled="batallaEnCurso"><i class="fas fa-robot"></i> Iniciar Batalla</button>
    </div>

    <!-- Ganador -->
    <div v-if="ganador">
      <h2>¡El ganador es {{ ganador }}!</h2>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SimulacionTorneo',
  props: {
    participantes: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      participantesArray: [],
      robots: [], // Lista de robots desde la API
      robot1: null, // Robot 1
      robot2: null, // Robot 2
      robot1Life: 100, // Vida de Robot 1
      robot2Life: 100, // Vida de Robot 2
      batallaEnCurso: false, // Estado de la batalla
      ganador: null, // Ganador de la batalla
      log: []
    };
  },
  methods: {
    cargarRobots() {
      fetch("http://localhost:3000/robots")
          .then((response) => response.json())
          .then((data) => {
            console.log("Robots fetched from API:", data);
            this.robots = data;

            // Validate participantesArray before finding robots
            if (!Array.isArray(this.participantesArray) || this.participantesArray.length !== 2) {
              console.error("Invalid participantesArray:", this.participantesArray);
              return;
            }

            // Ensure IDs are numbers for matching
            this.robot1 = this.robots.find((robot) => robot.id === String(this.participantesArray[0]));
            this.robot2 = this.robots.find((robot) => robot.id === String(this.participantesArray[1]));

            console.log("Robot 1:", this.robot1);
            console.log("Robot 2:", this.robot2);

            if (!this.robot1 || !this.robot2) {
              console.error("One or both robots could not be found. Check participantesArray and robots data.");
            }
          })
          .catch((error) => {
            console.error("Error loading robots:", error);
          });
    },

    iniciarBatalla() {
      this.batallaEnCurso = true;
      this.robot1Life = 100;
      this.robot2Life = 100;
      this.ganador = null;
      this.log = []; // Reinicia el log para una nueva batalla

      const interval = setInterval(() => {
        const damageToRobot1 = Math.max(5, Math.random() * this.robot2.fuerza - this.robot1.defensa / 2);
        const damageToRobot2 = Math.max(5, Math.random() * this.robot1.fuerza - this.robot2.defensa / 2);

        this.robot1Life = Math.max(0, this.robot1Life - damageToRobot1);
        this.robot2Life = Math.max(0, this.robot2Life - damageToRobot2);

        // Registrar los eventos de la batalla
        this.log.push(`Robot ${this.robot2.nombre} causa ${damageToRobot1.toFixed(2)} de daño a ${this.robot1.nombre}`);
        this.log.push(`Robot ${this.robot1.nombre} causa ${damageToRobot2.toFixed(2)} de daño a ${this.robot2.nombre}`);

        if (this.robot1Life === 0 || this.robot2Life === 0) {
          this.ganador = this.robot1Life > this.robot2Life ? this.robot1.nombre : this.robot2.nombre;
          this.log.push(`¡El ganador es ${this.ganador}!`);
          this.batallaEnCurso = false;
          clearInterval(interval);
        }
      }, 500);
    },
  },
  mounted() {
    this.cargarRobots();
  },
  created() {
    try {
      // Decodificar y parsear el string
      const decodedString = decodeURIComponent(this.participantes);
      console.log("Decoded participantes:", decodedString);
      this.participantesArray = JSON.parse(decodedString).map(String);
      if (!Array.isArray(this.participantesArray) || this.participantesArray.length !== 2) {
        console.error("ParticipantesArray is not valid:", this.participantesArray);
        this.participantesArray = [];
      }
      console.log("Parsed participantesArray:", this.participantesArray);
    } catch (error) {
      console.error('Error al procesar los participantes:', error);
      this.participantesArray = [];
    }
  }
};
</script>
<style>
.battle-area {
  text-align: center;
  margin-top: 2rem;
}

.robot {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #646cff;
  transition: width 0.5s ease-in-out;
}

button {
  padding: 1rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.battle-log {
  margin-top: 20px;
  padding: 10px;
  background-color: #2d2d44;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.battle-log ul {
  list-style: none;
  padding: 0;
}

.battle-log li {
  margin-bottom: 5px;
  font-size: 12px;
}

</style>
