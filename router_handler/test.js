const db=require('../db/index')
// const csv=require('csvtojson')
const dayjs=require('dayjs')

exports.forAdd=(req,res)=>{
  console.log(req.body)
  const sql='insert into fixed_assets set ?'
    db.query(sql,req.body,(err,results)=>{
      if(err) return console.log(err.message)
      if(results.affectedRows===1){
        console.log('插入成功')
      }
    })
  res.send('getyou')
}

// 一次性获取所有信息（盘点用）
exports.getAllDevice=(req,res)=>{
  const sql=`select * from fixed_assets where ${req.query.search_type} = "${req.query.search_thing}"`
  db.query(sql,(err,results)=>{
    if(err) return console.log(err.message)
    results.forEach((item)=>{
      item.start_day=dayjs(item.start_day).format('YYYY/MM/DD')
      item.end_day=dayjs(item.end_day).format('YYYY/MM/DD')
    })
    res.send(results)
  })
}
// 分页获取设备信息
exports.getDevice=(req,res)=>{
  const page=req.query.page
  const startPage=(page - 1)*10
  const sql= `select * from fixed_assets where ${req.query.search_type} like "%${req.query.search_thing}%" limit ${startPage} , 10`
  // const sql=`select * from fixed_assets where ${req.query.search_type} like "%${req.query.search_thing}%" limit ? , ?`
  db.query(sql,(err,results)=>{
    if(err) return console.log(err.message)
    results.forEach((item)=>{
      item.start_day=dayjs(item.start_day).format('YYYY/MM/DD')
      item.end_day=dayjs(item.end_day).format('YYYY/MM/DD')
    })
    res.send(results)
  })
}

// 获取设备数量
exports.getCount=(req,res)=>{
  const sql=`select count(*) from fixed_assets where ${req.query.search_type} like "%${req.query.search_thing}%"`
  db.query(sql,req.query.search_thing,(err,results)=>{
    if(err) return console.log(err.message)
    const count=Object.values(results[0])[0]
    res.send(''+count)
  })
}
// 获取特定设备
// exports.getThisOne=(req,res)=>{
//   let sql
//   if(req.query.search_type==='device_name'){
//     sql=`select * from fixed_assets where device_name like "%${req.query.search_thing}%"`
//   }else{
//     sql=`select * from fixed_assets where ${req.query.search_type} = "${req.query.search_thing}"`
//   }
//   db.query(sql,(err,results)=>{
//     if(err) return console.log(err.message)
//     results.forEach((item)=>{
//       item.start_day=dayjs(item.start_day).format('YYYY/MM/DD')
//       item.end_day=dayjs(item.end_day).format('YYYY/MM/DD')
//     })
//     res.send(results)
//   })
// }
// exports.forIn=(req,res)=>{
//   sql='insert into fixed_assets set ?'
//   csv().fromFile('D:\\backgroundServer\\forLayout\\fixedAssets.csv')
//   .then((json)=>{
//     json.forEach((item)=>{
//       db.query(sql,item,(err,results)=>{
//         if(err) return console.log(err.message)
//         if(results.affectedRows===1) console.log('success')
//       })
//     })
//   })
//   res.send('allok')
// }