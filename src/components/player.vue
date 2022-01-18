<template>
  <div>

  </div>
</template>

<script>
import request from "@/utils/request";
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';

export default {
  data() {
    return {
      ap : this.$store.state.aplayer,
      playKey: this.$store.state.playKey
    }
  },
  mounted() {
    const that = this
    if (!that.$store.state.aplayer) {
      this.ap = new APlayer({
        container: document.getElementById('aplayer'),
        lrcType: 1,
        mutex: true,
        fixed: true
      })
      that.$store.commit('setAplayer', this.ap)
    }
    that.ap.on('ended', function () {
      that.play(++that.playKey)
    });
  },
  methods: {
    play: async function (i) {
      const temp = this.$store.state.itemList
      if (!temp[i]) {
        console.log('url is null...')
        return
      }
      const res1 = await request('get', '/song/url','',{
        id: temp[i].id
      })

      if (!res1.data.data[0].url) {
        await this.play(++i)
      }
      const lyric =  await request('get', '/lyric','',{
        id: temp[i].id
      })
      this.ap.list.clear()
      this.ap.list.add({
        name: temp[i].name,
        artist: temp[i].ar,
        url: res1.data.data[0].url,
        cover: temp[i].al.picUrl,
        theme: "#ebd0c2",
        lrc: lyric.data.lrc.lyric
      });
      this.$store.commit('setPlayKey', i)
      this.ap.lrc.show()
      this.ap.play()
    }
  }
}
</script>
