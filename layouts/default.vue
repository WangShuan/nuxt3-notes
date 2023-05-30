<template>
  <div class="bg-light vh-100">
    <Navbar />
    <div class="fix-navbar-height">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.fix-navbar-height {
  position: absolute;
  bottom: 0px;
  height: calc(100vh - 60px);
  width: 100%;
  overflow: scroll;
}

.fix-navbar-height .container {
  max-width: 1200px;
}
</style>