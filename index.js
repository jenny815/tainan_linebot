import linebot from 'linebot'
import dotenv from 'dotenv'

// 讓套件讀取 .env 檔案
// 讀取後可以使用 process.env.變數使用
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

bot.on('message', event => {
  console.log(event)
})
