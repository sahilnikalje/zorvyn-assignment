const express=require('express')
const protect=require('../middlewares/authMiddleware')
const authorizeRoles=require('../middlewares/rolesMiddleware')
const{ getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity }=require('../controllers/dashboardController')

const dashboardRouter=express.Router()

dashboardRouter.get('/summary', getSummary)
dashboardRouter.get('/category-totals', getCategoryTotals)
dashboardRouter.get('/monthly-trends', getMonthlyTrends)
dashboardRouter.get('/recent', getRecentActivity)

module.exports=dashboardRouter