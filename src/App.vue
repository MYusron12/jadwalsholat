<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container">
        <a class="navbar-brand" href="#">
          <font-awesome-icon icon="mosque" />
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
          aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/jadwalsholat">Jadwal Sholat</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/alquran">Al-Quran</router-link>
            </li>
            <li class="nav-item">
              <!-- <a class="nav-link" href="#">Pricing</a> -->
            </li>
          </ul>
          <span class="navbar-text">
            Powered API Muslim v2 - by myQuran
          </span>
        </div>
      </div>
    </nav>
    <div class="container mt-2">
      <router-view />
    </div>
  </div>
</template>

<script>
// 
</script>
