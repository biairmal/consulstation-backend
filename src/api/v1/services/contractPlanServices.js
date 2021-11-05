const { ContractPlan, Consultant } = require('../models')

exports.createContractPlan = async (consultantId, form) => {
  try {
    const contractPlan = new ContractPlan({
      title: form.title,
      description: form.description,
      price: form.price,
      consultantId: consultantId,
    })
    const consultant = await Consultant.findOne({ _id: consultantId })
    consultant.contracts.push(contractPlan)
    await consultant.save()

    return contractPlan.save()
  } catch (err) {
    throw err
  }
}

exports.getContractPlansByConsultantId = async (consultantId) => {
  try {
    const result = await ContractPlan.find({ consultantId: consultantId })

    if (!result) throw 'No contract plans found!'

    return result
  } catch (err) {
    throw err
  }
}

exports.getContractPlanById = async (contractPlanId) => {
  try {
    const result = await ContractPlan.findOne({ _id: contractPlanId })

    if (!result) throw 'No contract plans found!'

    return result
  } catch (err) {
    throw err
  }
}

exports.deleteContractPlanById = async (contractPlanId, consultantId) => {
  try {
    const contractPlan = await ContractPlan.findOne({ _id: contractPlanId })

    if (!contractPlan) throw 'No contract plans found!'
    if (!contractPlan.consultantId.equals(consultantId))
      throw 'This contract plan does not belong to this consultant!'

    const consultant = await Consultant.findOneAndUpdate(
      { _id: consultantId },
      {
        $pull: {
          contracts: contractPlanId ,
        },
      }
    )
    // await consultant.contracts.filter((x) => !x.equals(contractPlan.id))
    // await consultant.save()
    const result = await ContractPlan.findOneAndRemove({ _id: contractPlanId })

    return result
  } catch (err) {
    throw err
  }
}

exports.updateContractPlanById = async (contractPlanId, consultantId, form) => {
  try {
    const contractPlan = await ContractPlan.findOne({ _id: contractPlanId })

    if (!contractPlan) throw 'No contract plans found!'
    if (!contractPlan.consultantId.equals(consultantId))
      throw 'This contract plan does not belong to this consultant!'

    const result = await ContractPlan.findOneAndUpdate(
      { _id: contractPlanId },
      form
    )

    return result
  } catch (err) {
    throw err
  }
}
