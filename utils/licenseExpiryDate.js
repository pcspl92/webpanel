const moment = require('moment');

const getExpiryDate = (renewal) => {
  switch (renewal) {
    case 'monthly':
      return moment().utc().add(1, 'M').format('YYYY-MM-DD HH:mm:ss');
    case 'quarterly':
      return moment().utc().add(1, 'Q').format('YYYY-MM-DD HH:mm:ss');
    case 'half_yearly':
      return moment().utc().add(2, 'Q').format('YYYY-MM-DD HH:mm:ss');
    case 'yearly':
      return moment().utc().add(1, 'y').format('YYYY-MM-DD HH:mm:ss');
    case 'one_time':
      return '2038-01-19 03:14:07';
    default:
      return null;
  }
};

module.exports = getExpiryDate;
