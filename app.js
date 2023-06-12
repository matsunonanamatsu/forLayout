const express=require('express')
const app=express()
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const path=require('path')
app.use(express.static(path.join(__dirname,'static/dist')))
// app.use(express.static('./static/dist'))
//跨域配置
const cors=require('cors')
app.use(cors())
//转码配置
app.use(express.urlencoded({extended:false}))

//引入并使用test路由
const testRouter=require('./router/test')
app.use('/',testRouter)

app.listen(5001,()=>{
  console.log(`Ctrl+点击进入http://localhost:5001`)
})