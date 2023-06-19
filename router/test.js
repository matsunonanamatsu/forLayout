const express=require('express')
const router=express.Router()

const testHandler=require('../router_handler/test')

router.post('/addsave',testHandler.forAdd)
router.get('/getDevice',testHandler.getDevice)
router.get('/getCount',testHandler.getCount)
router.get('/getAllDevice',testHandler.getAllDevice)
router.get('/getFile',testHandler.getFile)
router.get('/getFileList',testHandler.getFileList)
router.post('/postResults',testHandler.postResults)
module.exports=router
