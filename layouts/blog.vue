<template>
  <div>
    <vheader />
    <typelist />
    <backtop />
    <div class="main">
      <vmain />
      <vaside />
    </div>
    <vaudio></vaudio>
    <vfooter />
  </div>
</template>


<script>
import vaudio from '@/components/audio'
import Cookies from "js-cookie";
import vheader from "./header";
import typelist from "./typelist";
import backtop from "./backtop";
import vaside from "./aside";
import vmain from "./main";
import vfooter from "./footer";
import { mapActions, mapMutations } from "vuex";
export default {
  // name: "",
  components: {
    vheader,
    typelist,
    backtop,
    vaside,
    vmain,
    vaudio,
    vfooter
  },
  methods: {
    ...mapActions({
      getUserInfo: "user/getUserInfo"
    }),
    ...mapMutations({
      setToken: "user/setToken",
      logout: "user/logout"
    })
  },
  mounted() {
    if (localStorage.token) {
      this.setToken(localStorage.token);
      this.getUserInfo()
        .then(() => {
        })
        .catch(() => {
          this.logout();
        });
    }
  }
};
</script>

<style scoped>
.main {
  box-sizing: border-box;
  margin: 140px auto 0;
  overflow: hidden;
  min-height: calc(100vh - 120px);
  padding-bottom: 100px;
}
@media screen and (max-width: 540px) {
  .main {
    box-sizing: border-box;
    width: 100%;
    margin: 120px auto 0 !important;
    /* padding: 0 10px; */
  }
}
</style>
