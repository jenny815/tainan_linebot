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

// 計算距離公式
// lat1 點 1 的緯度
// lon1 點 1 的經度
// lat2 點 2 的緯度
// lon2 點 2 的經度
// unit 單位，不傳是英里，K 是公里，N 是海里
const distance = (lat1, lon1, lat2, lon2, unit = 'K') => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  } else {
    const radlat1 = (Math.PI * lat1) / 180
    const radlat2 = (Math.PI * lat2) / 180
    const theta = lon1 - lon2
    const radtheta = (Math.PI * theta) / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') {
      dist = dist * 1.609344
    }
    if (unit === 'N') {
      dist = dist * 0.8684
    }
    return dist
  }
}

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
  } else if (event.message.type === 'location') {
    // const result = data.filter(d => {
    //   return d.行政區 === event.message.text
    // })[0]
    // event.reply({
    //   type: 'location',
    //   title: result.行政區,
    //   address: result.地點,
    //   latitude: result.經度,
    //   longitude: result.緯度
    // })
    // console.log(event.message)
    let arr = []
    for (const d of data) {
      const dis = distance(d.long, d.lat, event.message.longitude, event.message.latitude)
      if (dis <= 2) {
        arr.push({
          type: 'location',
          title: d.name,
          address: d.address,
          latitude: d.lat,
          longitude: d.long,
          dis
        })
      }
    }
    arr = arr
      .sort((a, b) => {
        return a.dis - b.dis
      })
      .map(a => {
        delete a.dis
        return a
      })
      .slice(0, 4)
    event.reply(arr)
  }
})
