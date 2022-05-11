<template>
  <div class="iconfont">
    <component :size="size" :color="color" v-bind:is="currentView"></component>
  </div>
</template>

<script>
import iconWORD from './iconWORD.vue';
import iconbianzu from './iconbianzu.vue';
import iconbianzu16 from './iconbianzu16.vue';
import iconbianzu19 from './iconbianzu19.vue';
import iconbianzu4 from './iconbianzu4.vue';
import iconbianzu6 from './iconbianzu6.vue';
import iconbianzu7 from './iconbianzu7.vue';
import iconbianzu8 from './iconbianzu8.vue';
import iconbianzu9 from './iconbianzu9.vue';
import iconbiaoqing from './iconbiaoqing.vue';
import iconcaidan from './iconcaidan.vue';
import iconchahao from './iconchahao.vue';
import icondagou from './icondagou.vue';
import icondanxuankuang from './icondanxuankuang.vue';
import icondelete from './icondelete.vue';
import icondiandian from './icondiandian.vue';
import icondingzi from './icondingzi.vue';
import iconemoji_icon2_copy from './iconemoji_icon2_copy.vue';
import iconemoji_icon3 from './iconemoji_icon3.vue';
import iconexcel from './iconexcel.vue';
import iconfankui from './iconfankui.vue';
import iconfork from './iconfork.vue';
import iconfuxuankuang from './iconfuxuankuang.vue';
import iconfuxuankuangactive from './iconfuxuankuangactive.vue';
import iconfuzhi from './iconfuzhi.vue';
import icongantanhao from './icongantanhao.vue';
import iconguanyu from './iconguanyu.vue';
import iconheimingdan from './iconheimingdan.vue';
import iconhuaban from './iconhuaban.vue';
import iconicon_xiaolian from './iconicon_xiaolian.vue';
import iconicon_yuyinshipin from './iconicon_yuyinshipin.vue';
import iconicon_yuyinshipin1 from './iconicon_yuyinshipin1.vue';
import iconjiami from './iconjiami.vue';
import iconjieping from './iconjieping.vue';
import iconjingyin from './iconjingyin.vue';
import iconleft from './iconleft.vue';
import iconlianxiren from './iconlianxiren.vue';
import iconlianxiren1 from './iconlianxiren1.vue';
import iconliaotianjilu from './iconliaotianjilu.vue';
import iconnarrow_icon from './iconnarrow_icon.vue';
import iconpaishe from './iconpaishe.vue';
import iconpdf from './iconpdf.vue';
import iconplay1 from './iconplay1.vue';
import iconquanburenyuan from './iconquanburenyuan.vue';
import iconqunliao from './iconqunliao.vue';
import iconradio from './iconradio.vue';
import iconright from './iconright.vue';
import iconsearch from './iconsearch.vue';
import iconshijian from './iconshijian.vue';
import iconshipintonghua from './iconshipintonghua.vue';
import iconshoucang from './iconshoucang.vue';
import iconshoujihaoma from './iconshoujihaoma.vue';
import iconshoujihaoma1 from './iconshoujihaoma1.vue';
import iconshuangxiangsudicopy from './iconshuangxiangsudicopy.vue';
import iconsousuo from './iconsousuo.vue';
import iconsuspend from './iconsuspend.vue';
import icontongzhi from './icontongzhi.vue';
import icontuichu from './icontuichu.vue';
import icontuichu1 from './icontuichu1.vue';
import icontuijianhaoyou from './icontuijianhaoyou.vue';
import iconvideo_icon1 from './iconvideo_icon1.vue';
import iconvideo_icon7 from './iconvideo_icon7.vue';
import iconvideo_refuse from './iconvideo_refuse.vue';
import iconvioce_refuse from './iconvioce_refuse.vue';
import iconweizhi from './iconweizhi.vue';
import iconwenjian from './iconwenjian.vue';
import iconwenjian1 from './iconwenjian1.vue';
import iconwenjian2 from './iconwenjian2.vue';
import iconxiangce from './iconxiangce.vue';
import iconxiangji from './iconxiangji.vue';
import iconxitongjingyin from './iconxitongjingyin.vue';
import iconyaoqinghaoyou from './iconyaoqinghaoyou.vue';
import iconyaoqinghaoyoubeifen from './iconyaoqinghaoyoubeifen.vue';
import iconyidu from './iconyidu.vue';
import iconyidu1 from './iconyidu1.vue';
import iconyincangbukejian from './iconyincangbukejian.vue';
import iconyuehoujifen from './iconyuehoujifen.vue';
import iconyuehoujifen2 from './iconyuehoujifen2.vue';
import iconyuehoujifenbeifen1 from './iconyuehoujifenbeifen1.vue';
import iconyunwenjian from './iconyunwenjian.vue';
import iconyuyan from './iconyuyan.vue';
import iconyuyin from './iconyuyin.vue';
import iconzhiding from './iconzhiding.vue';
import iconzhihangfankui from './iconzhihangfankui.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  props: {
    size: String,
    color: {
      type: String,
    },
    name: String,
  },
  components: {
    iconWORD,
    iconbianzu,
    iconbianzu16,
    iconbianzu19,
    iconbianzu4,
    iconbianzu6,
    iconbianzu7,
    iconbianzu8,
    iconbianzu9,
    iconbiaoqing,
    iconcaidan,
    iconchahao,
    icondagou,
    icondanxuankuang,
    icondelete,
    icondiandian,
    icondingzi,
    iconemoji_icon2_copy,
    iconemoji_icon3,
    iconexcel,
    iconfankui,
    iconfork,
    iconfuxuankuang,
    iconfuxuankuangactive,
    iconfuzhi,
    icongantanhao,
    iconguanyu,
    iconheimingdan,
    iconhuaban,
    iconicon_xiaolian,
    iconicon_yuyinshipin,
    iconicon_yuyinshipin1,
    iconjiami,
    iconjieping,
    iconjingyin,
    iconleft,
    iconlianxiren,
    iconlianxiren1,
    iconliaotianjilu,
    iconnarrow_icon,
    iconpaishe,
    iconpdf,
    iconplay1,
    iconquanburenyuan,
    iconqunliao,
    iconradio,
    iconright,
    iconsearch,
    iconshijian,
    iconshipintonghua,
    iconshoucang,
    iconshoujihaoma,
    iconshoujihaoma1,
    iconshuangxiangsudicopy,
    iconsousuo,
    iconsuspend,
    icontongzhi,
    icontuichu,
    icontuichu1,
    icontuijianhaoyou,
    iconvideo_icon1,
    iconvideo_icon7,
    iconvideo_refuse,
    iconvioce_refuse,
    iconweizhi,
    iconwenjian,
    iconwenjian1,
    iconwenjian2,
    iconxiangce,
    iconxiangji,
    iconxitongjingyin,
    iconyaoqinghaoyou,
    iconyaoqinghaoyoubeifen,
    iconyidu,
    iconyidu1,
    iconyincangbukejian,
    iconyuehoujifen,
    iconyuehoujifen2,
    iconyuehoujifenbeifen1,
    iconyunwenjian,
    iconyuyan,
    iconyuyin,
    iconzhiding,
    iconzhihangfankui,
  },
  data() {
    return {
      currentView: null,
    };
  },
  mounted() {
    if (this.name) {
      this.currentView = this.name;
    }
  },
};
</script>
