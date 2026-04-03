const express=require('express')
const protect=require('../middlewares/authMiddleware')
const authorizeRoles=require('../middlewares/rolesMiddleware')
const{ getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity }=require('../controllers/dashboardController')

const dashboardRouter=express.Router()

dashboardRouter.get('/summary', protect, authorizeRoles('analyst', 'admin'), getSummary)
dashboardRouter.get('/category-totals', protect, authorizeRoles('analyst', 'admin'), getCategoryTotals)
dashboardRouter.get('/monthly-trends', protect, authorizeRoles('analyst', 'admin'), getMonthlyTrends)
dashboardRouter.get('/recent', protect, authorizeRoles('analyst', 'admin'), getRecentActivity)

module.exports=dashboardRouter