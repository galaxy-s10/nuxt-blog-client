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
import Cookies from "js-cookie";
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
  },
  created() {
    var token = Cookies.get("token");
    if (token != undefined) {
      console.log("开始验证token");
      this.$store.dispatch("user/getInfo");
    } else {
      console.log("没有token");
    }
  }
};
</script>

<style>
</style>
