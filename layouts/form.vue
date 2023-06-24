<template>
  <div class="bg-light vh-100">
    <Navbar />
    <div class="fix-nav-height">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.fix-nav-height {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  height: calc(100vh - 60px);
}

.fix-nav-padding {
  padding-top: 90px;
  padding-bottom: 30px;
}
</style>