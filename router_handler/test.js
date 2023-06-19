const db=require('../db/index')
// const csv=require('csvtojson')
const dayjs=require('dayjs')
const fs=require('fs')
const { emitWarning } = require('process')

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
// 拉取文件列表
exports.getFileList=(req,res)=>{
  const sql='select * from inventory_log'
  db.query(sql,(err,results)=>{
    if(err) return console.log(err.message)
    results.forEach((item)=>{
      item.log_date=dayjs(item.log_date).format('YYYY/MM/DD')
    })
    res.send(results)
  })
}
// 从服务器中拉取文件
exports.getFile=(req,res)=>{
  // const img=fs.readFile('static/erlou.jpg',(err,data)=>{
  //   res.send(data)
  // })
  fs.readFile('static/'+req.query.filename,'utf-8',(err,data)=>{
    if(err) return console.log(err.message)
    // console.log(data)
    res.setHeader('Content-Type','application/vnd.ms-excel')
    res.send(data)
  })

}
exports.postResults=(req,res)=>{
  const today=dayjs(Date.now()).format('YYYYMMDD')
  const area=req.body.area
  const user=req.body.user
  let okList=[]
  let ngList=[]
  let ngReasonList=[]
  req.body.okList.forEach((item)=>{
    okList.push(item.id)
  })
  req.body.ngList.forEach((item)=>{
    ngList.push(item.id)
    ngReasonList.push(item.reason)
  })
  const sql1=`select sap_number,device_name from fixed_assets where id in (${okList})`
  const sql2=`select sap_number,device_name from fixed_assets where id in (${ngList | ''})`
    // 用id请求okList
    db.query(sql1,(err,results)=>{
      if(err) return console.log(err.message)
      okList=results
      // 用id请求ngList
      db.query(sql2,ngList,(err,results)=>{
        if(err) return console.log(err.message)
        ngList=results
        let fileData=''
        // 使用fileData以string形式承接整个list
        okList.forEach((item)=>{
          fileData+=Object.values(item)+',OK,-,'+user+',\r\n'
        })
        ngList.forEach((item,index)=>{
          fileData+=Object.values(item)+',NG,'+ngReasonList[index]+','+user+'\r\n'
        })
        // 开头要加\ufeff否则中文乱码(重要！！)
        fileData='\ufeff固资编号,固资名称,盘点结果,NG原因,盘点人\r\n'+fileData
        // 写入文件
        fs.writeFile(`static/${today}${area}盘点结果.csv`,fileData,'utf-8',(err)=>{
          if(err) return res.send('提交失败！'+err.code)
          // 将文件路径记入数据库
          const sql3=`insert into inventory_log set ?`
          const obj={
            log_date:dayjs(Date.now()).format('YYYY/MM/DD HH:mm:ss'),
            file_name:`${today}${area}盘点结果.csv`,
            user:user,
            area:area
          }
          db.query(sql3,obj,(err,resutls)=>{
            if(err) return console.log(err.message)
          })
          res.send('盘点已完成!')
        })
      })
    })
}
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