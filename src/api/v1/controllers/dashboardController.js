const { dashboardServices } = require('../services')

exports.getDashboardData = async (req, res) => {
  const user = req.user

  try {
    if (user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'You are not admin!',
      })
    }

    const data = await dashboardServices.getDashboardData()

    return res.status(200).json({
      success: false,
      message: 'Succesfully retreived dashboard data!',
      data: data,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retreive dashboard data!',
      errors: err,
    })
  }
}
