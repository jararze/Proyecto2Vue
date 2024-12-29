<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/robots">Lista de Robots</router-link></li>
        <li><router-link to="/robots/new">Nuevo Robot</router-link></li>
        <li><router-link to="/torneos">Lista de Torneos</router-link></li>
        <li><router-link to="/torneos/new">Nuevo Torneo</router-link></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
}

nav ul li {
  display: inline;
}
</style>
