<template>
  <div>
    <vheader />
    <typelist />
    <backtop />
    <div class="main">
      <vmain />
      <vaside />
    </div>
    <vfooter />
  </div>
</template>


<script>
import vheader from "./header";
import typelist from "./typelist";
import backtop from "./backtop";
import vaside from "./aside";
import vmain from "./main";
import vfooter from "./footer";
export default {
  // name: "",
  components: {
    vheader,
    typelist,
    backtop,
    vaside,
    vmain,
    vfooter
  }
};
</script>

<style>
</style>
