<template>
  <div class="bg-light min-vh-100 overflow-auto">
    <Navbar />
    <div class="fix-nav-height">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.fix-nav-height {
  height: calc(100vh - 60px);
}
</style>