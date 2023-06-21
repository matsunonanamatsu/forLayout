const mysql=require('mysql2')

const db=mysql.createPool({
  host:'192.168.0.178',
  user:'matsuno',
  password:'nanamatsu',
  database:'my_test'
})

// const db=mysql.createPool({
//   host:'127.0.0.1',
//   user:'root',
//   password:'root',
//   database:'my_test'
// })
module.exports=db