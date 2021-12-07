const { Partnership, User, Consultant, Article } = require('../models')

const queryConfig = { password: 0 }

exports.getDashboardData = async () => {
  try {
    const countPartnership = await Partnership.countDocuments({})
    const totalUser = await User.countDocuments({})
    const totalConsultant = await Consultant.countDocuments({})
    const latestArticle = await Article.find(
      {},{},
      {
        sort: { createdAt: 'descending' },
        limit: 3,
      }
    )

    const data = {
      partnershipRequests: countPartnership,
      totalUser: totalUser,
      totalConsultant: totalConsultant,
      latestArticle: latestArticle,
    }

    return data
  } catch (err) {
    throw err
  }
}
