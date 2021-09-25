import linebot from 'linebot'
import dotenv from 'dotenv'
import fs from 'fs'
import axios from 'axios'
import schedule from 'node-schedule'

let data = []

const getData = () => {
  axios
    .get('https://www.twtainan.net/data/shops_zh-tw.json')
    .then(response => {
      data = response.data
    })
    .catch()
}

// 每天零點更新資料
schedule.scheduleJob('* * 0 * *', getData)
// 機器人啟動時也要有資料
getData()

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

bot.on('message', async event => {
  if (event.message.type === 'text') {
    let result = data.filter(d => {
      return d.district === event.message.text
    })

    const newArr = []
    for (let i = 1; i <= 1; i++) {
      let num = Math.random() * result.length
      num = Math.floor(num)
      newArr.push(result[num])
    }
    result = newArr
    console.log(result)

    const flex = {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
        action: {
          type: 'uri',
          uri: 'http://linecorp.com/'
        }
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: result[0].name,
            weight: 'bold',
            size: 'xl'
          },
          // {
          //   type: 'box',
          //   layout: 'baseline',
          //   margin: 'md',
          //   contents: [
          //     {
          //       type: 'icon',
          //       size: 'sm',
          //       url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
          //     },
          //     {
          //       type: 'icon',
          //       size: 'sm',
          //       url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
          //     },
          //     {
          //       type: 'icon',
          //       size: 'sm',
          //       url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
          //     },
          //     {
          //       type: 'icon',
          //       size: 'sm',
          //       url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
          //     },
          //     {
          //       type: 'icon',
          //       size: 'sm',
          //       url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
          //     },
          //     {
          //       type: 'text',
          //       text: '4.0',
          //       size: 'sm',
          //       color: '#999999',
          //       margin: 'md',
          //       flex: 0
          //     }
          //   ]
          // },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '地址',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 1
                  },
                  {
                    type: 'text',
                    text: result[0].address,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5
                  }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '介紹',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 1
                  },
                  {
                    type: 'text',
                    text: result[0].summary,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5
                  }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '時間',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 1
                  },
                  {
                    type: 'text',
                    text: result[0].open_time,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5
                  }
                ]
              }
            ]
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'link',
            height: 'sm',
            action: {
              type: 'uri',
              label: 'CALL',
              uri: 'https://linecorp.com'
            }
          },
          {
            type: 'button',
            style: 'link',
            height: 'sm',
            action: {
              type: 'uri',
              label: 'WEBSITE',
              uri: 'https://linecorp.com'
            }
          },
          {
            type: 'spacer',
            size: 'sm'
          }
        ],
        flex: 0
      }
    }
    const message = {
      type: 'flex',
      altText: '你有新訊息',
      contents: {
        type: 'carousel',
        contents: [flex]
      }
    }
    fs.writeFileSync('aaa.json', JSON.stringify(message, null, 2))
    console.log(message)
    event.reply(message)
  }
})
