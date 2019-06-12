<style scoped>
  .title { text-align:center; color:#aa6; background-color:#444; font-size:22px; margin:-36px 80px 15px 80px; border-left:2px solid #aa6; border-right:2px solid #aa6; padding-bottom:1px; }
  .panel { padding:20px; background-color:#333; width:430px; margin:40px auto 20px auto; }
  .label { color:#999; font-size:15px; width:140px; display:inline-block; }
  .stat { color:#bbb; font-size:22px; width:150px; display:inline-block; text-align:right; }
  .info { color:#999; font-size:15px; display:inline-block; padding-left:7px; }
  .info.icon { width:18px; height:18px; padding-left:3px; }
  .info.icon img { margin-bottom:-2px; }
  .up { width:0; height:0; border-style:solid; border-width:0 6px 9px 6px; border-color:transparent transparent #007700 transparent; margin-left:6px; margin-bottom:4px; padding:0px; }
  .down { width:0; height:0; border-style:solid; border-width:9px 6px 0 6px; border-color:#aa0000 transparent transparent transparent; margin-left:6px; margin-bottom:2px; padding:0px; }
</style>

<style>
  .vue-tooltip { background-color:#555; }
  .vue-tooltip .tooltip-arrow { display:none; }
  #supplyTip .label { color:#ddd; font-size:12px; width:80px; }
  #supplyTip .stat { color:#ddd; font-size:12px; width:90px; }
  #supplyTip .indented { padding-left:15px; }
</style>

<template>
  <div class="panel">
    <div class="title">Rito Stats</div>
    <div class="label">Last Block</div>         <div class="stat">{{formattedInt(height)}}</div> <div class="info">{{block_age}}</div><br>
    <div class="label">Net Hash</div>           <div class="stat">{{formattedInt(networkhashps)}}</div> <div class="info">Gh/s</div><br>
    <div class="label">Difficulty</div>         <div class="stat">{{formattedInt(difficulty)}}</div><br>
    <div class="label">Last Reward</div>        <div class="stat">{{formattedInt(reward)}}</div><br>
    <div class="label">Circ. Supply</div>       <div class="stat">{{formattedInt(supply)}}</div> <div class="info icon" v-tooltip="{html:'supplyTip', class:'tooltip'}"><img src="fi-info.svg"></div><br>
    <div class="label">CryptoBridge Price</div> <div class="stat">{{last_cryptobridge_price}}</div><br>
    <div class="label">Safe.Trade Price</div>   <div class="stat">{{last_safetrade_price}}</div> <div :class="safetrade_price_change" class="info"></div><br>
    <div class="label">Price (USD)</div>        <div class="stat">{{last_dollars}}</div> <div class="info">${{last_btc}} / BTC</div><br>
    <div id="supplyTip">
      <div class="label">Rewards</div>  <div class="stat">+ {{formattedInt(this.total_rewards)}}</div><br>
      <div class="label">Dev Fund</div> <div class="stat">+ {{formattedInt(this.total_dev_funds)}}</div><br>
      <div class="label">Burned</div>   <div class="stat">- {{formattedInt(this.total_burned)}}</div><br>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'StatsPanel',
    props: {
      coin: String
    },
    data() {
      return {
        height: '',
        time: '',
        block_age: '',
        networkhashps: '',
        difficulty: '',
        reward: '',
        dev_fund: '',
        tx_fee: '',
        total_rewards: '',
        total_dev_funds: '',
        total_tx_fees: '',
        total_burned: '',
        supply: '',
        last_cryptobridge_price: '',
        last_safetrade_price: '',
        safetrade_price_change: '',
        last_dollars: '',
        last_btc: '',
      }
    },
    methods: {
      formattedNum: function (num) {
        var parts = num.toString().split(".")
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return parts.join(".")
      },
      formattedInt: function (num) {
        return this.formattedNum(Math.round(num))
      }
    },
    mounted() {
      setInterval(function(){
        this.block_age = moment(Number(this.time) * 1000).fromNow()
      }.bind(this), 5000)
    },
    sockets: {
      connect() {
        this.$socket.emit('request', 'currentBlockInfo')
        this.$socket.emit('request', 'currentPriceInfo')
      },
      currentBlockInfo(info) {
        this.height           = info.height
        this.time             = info.time
        this.block_age        = moment(info.time * 1000).fromNow()
        this.networkhashps    = Math.round(info.networkhashps / 1000000000)
        this.difficulty       = Math.round(info.difficulty)
        this.reward           = info.reward
        this.dev_fund         = info.dev_fund
        this.tx_fee           = info.tx_fee
        this.total_rewards    = Math.round(info.total_rewards / 100000000)
        this.total_dev_funds  = Math.round(info.total_dev_funds / 100000000)
        this.total_tx_fees    = Math.round(info.total_tx_fees / 100000000)
        this.total_burned     = Math.round(info.total_burned / 100000000)
        this.supply           = this.total_rewards + this.total_dev_funds - this.total_burned
      },
      currentPriceInfo(info) {
        if (Object.keys(info).length > 0) {
          this.last_cryptobridge_price  = info.cryptobridge_last.toFixed(8)
          this.last_safetrade_price     = info.safetrade_last.toFixed(8)
          this.safetrade_price_change   = info.safetrade_change
          this.last_btc                 = info.btc.toFixed(2)
          this.last_dollars             = (info.safetrade_last * info.btc).toFixed(8)
        }
      },
      reload() {
        window.location.reload()
      }
    }
  }
</script>
