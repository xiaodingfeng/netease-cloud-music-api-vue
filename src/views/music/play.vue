<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
      <el-form-item style="width: calc(22%)">
        <el-select v-model="category" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: calc(38%)">
        <el-input v-model="keyWords" placeholder="赶快动手吧!" @keyup.enter.native="clearSearch"></el-input>
      </el-form-item>
      <el-form-item style="width: calc(22%)">
        <el-button type="primary" icon="el-icon-search" @click="clearSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
        ref="TestTable"
        :data="itemList"
        border
        height="600"
    >
      <el-table-column
          label="封面"
          minWidth="80">
        <template slot-scope="scope">
          <el-link @click="handle(scope.row)">
            <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.al.picUrl"></el-image>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="歌名"
          minWidth="120">
      </el-table-column>
      <el-table-column
          prop="ar"
          label="歌手"
          minWidth="120">
      </el-table-column>
      <el-table-column
          label="操作"
          minWidth="200">
        <template slot-scope="scope">
          <el-link type="warning" @click="download(scope.row.index)">下载</el-link>
        </template>
      </el-table-column>
    </el-table>
    <Player ref="player"></Player>
  </div>
</template>
<style>
/*.el-table__body-wrapper::-webkit-scrollbar {*/
/*  !*width: 0;宽度为0隐藏*!*/
/*  width: 0px;*/
/*}*/
/*.el-table__body-wrapper::-webkit-scrollbar-thumb {*/
/*  border-radius: 2px;*/
/*  height: 50px;*/
/*  background: #eee;*/
/*}*/
/*.el-table__body-wrapper::-webkit-scrollbar-track {*/
/*  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
/*  border-radius: 2px;*/
/*  background: rgba(0, 0, 0, 0.4);*/
/*}*/
</style>
<script>
import request from "@/utils/request";
import Player from "../../components/player";
export default {
  components: {Player},
  data() {
        return {
            keyWords: "",
            itemList: this.$store.state.itemList,
            playKey: this.$store.state.playKey,
            query: { page: 1, pageSize: 10},
            options: [{
              value: 1,
              label: '单曲'
            }, {
              value: 100,
              label: '歌手'
            }],
            category: 1
          }
},
  mounted() {
    // this.$router.push('/')
    const that = this

    that.listener()
  },
  methods: {
    download: async function (i) {
      const temp = this.itemList
      if (!temp[i]) {
        console.log('url is null...')
        return
      }
      const res1 = await request('get', '/song/url','',{
        id: temp[i].id
      })
      const link = document.createElement('a');
      link.setAttribute('href', res1.data.data[0].url); //设置下载文件的url地址
      link.setAttribute('target','view_frame')
      //link.setAttribute('download', 'download'); //用于设置下载文件的文件名
      link.click();
    },
    clearSearch() {
      this.query = {page: 1, pageSize: 10}
      this.itemList = []
      this.search()
    },
    play: async function (i) {
      this.$refs.player.play(i);
    },
    handle(row) {
      this.$refs.player.play(row.index);
    },
    listener() {
      const that = this;
      let dom = that.$refs.TestTable.bodyWrapper
      dom.addEventListener("scroll", function () {
        const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
        if (scrollDistance <= 10) {
          that.query.page++;
          that.search()
        }
      })
    },
    search: async function () {
      const _that = this;
      if (!_that.keyWords) {
        let hotUrl = '/search/hot'
        if (_that.category === 100) {
          hotUrl = '/top/artists'
        }
        const res = await request('get', hotUrl)
        if (_that.category === 100) {
          _that.keyWords = res.data.artists[parseInt(Math.random() * 10)].name;
        } else {
          _that.keyWords = res.data.result.hots[parseInt(Math.random() * 10)].first;
        }
      }
      let res = await request('get', '/cloudsearch','',{
        keywords: _that.keyWords,
        limit: _that.query.pageSize,
        offset: ((_that.category === 100 ? 1 : _that.query.page) - 1) * _that.query.pageSize,
        type: _that.category
      })
      let imageUrl = ''

      if (_that.category === 100) {
        if (!res.data.result.artists) {
          console.log('error ....')
          return
        }
        imageUrl = res.data.result.artists[0].picUrl
        res = await request('get', '/artist/songs','',{
          id: res.data.result.artists[0].id,
          order: 'hot',
          limit: _that.query.pageSize,
          offset: (_that.query.page - 1) * _that.query.pageSize,
        })
      }
      let temp = res.data.result ? res.data.result.songs : res.data.songs
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].ar[0]) {
          temp[i].ar = temp[i].ar[0] ? (temp[i].ar[0].name + (temp[i].ar[1] ? ('/' + temp[i].ar[1].name) : '')) : '';
        }
        if (_that.category === 100) {
          temp[i].al.picUrl = imageUrl
        }
        temp[i].index = _that.itemList.length
        _that.itemList.push(temp[i])
        this.$store.commit('setItemList', _that.itemList)
        if (_that.itemList.length === 1) {
          _that.playKey = 0
          await _that.play(0);
        }
      }
    }
  }
}
</script>
