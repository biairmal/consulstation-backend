const { Router } = require('express')
const { contractPlanController } = require('../controllers')
const { verifyToken } = require('../middlewares')
const router = Router()

router.post(
  '/contractPlan',
  verifyToken,
  contractPlanController.createContractPlan
)
router.get(
  '/contractPlans',
  verifyToken,
  contractPlanController.getContractPlansForConsultant
)
router.get(
  '/contractPlan/:contractPlanId',
  verifyToken,
  contractPlanController.getContractPlanById
)
router.delete(
  '/contractPlan/:contractPlanId',
  verifyToken,
  contractPlanController.deleteContractPlanById
)
router.patch(
  '/contractPlan/:contractPlanId',
  verifyToken,
  contractPlanController.updateContractPlanById
)

module.exports = router
