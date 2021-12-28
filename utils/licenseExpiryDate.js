const moment = require('moment');

const getExpiryDate = (renewal, number, oldDate) => {
  let expiryDate;
  let date;

  switch (renewal) {
    case 'monthly':
      date = oldDate
        ? moment(oldDate).add(number, 'M').format('YYYY-MM-DD HH:mm:ss')
        : moment().utc().add(number, 'M').format('YYYY-MM-DD HH:mm:ss');
      expiryDate = moment(date).isAfter('2038-01-19 03:14:07')
        ? '2038-01-19 03:14:07'
        : date;
      break;
    case 'quarterly':
      date = oldDate
        ? moment(oldDate).add(number, 'Q').format('YYYY-MM-DD HH:mm:ss')
        : moment().utc().add(number, 'Q').format('YYYY-MM-DD HH:mm:ss');
      expiryDate = moment(date).isAfter('2038-01-19 03:14:07')
        ? '2038-01-19 03:14:07'
        : date;
      break;
    case 'half_yearly':
      date = oldDate
        ? moment(oldDate)
            .add(2 * number, 'Q')
            .format('YYYY-MM-DD HH:mm:ss')
        : moment()
            .utc()
            .add(2 * number, 'Q')
            .format('YYYY-MM-DD HH:mm:ss');
      expiryDate = moment(date).isAfter('2038-01-19 03:14:07')
        ? '2038-01-19 03:14:07'
        : date;
      break;
    case 'yearly':
      date = oldDate
        ? moment(oldDate).add(number, 'y').format('YYYY-MM-DD HH:mm:ss')
        : moment().utc().add(number, 'y').format('YYYY-MM-DD HH:mm:ss');
      expiryDate = moment(date).isAfter('2038-01-19 03:14:07')
        ? '2038-01-19 03:14:07'
        : date;
      break;
    case 'one_time':
      expiryDate = '2038-01-19 03:14:07';
      break;
    default:
      break;
  }

  return expiryDate;
};

module.exports = getExpiryDate;
