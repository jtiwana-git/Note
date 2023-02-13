const moment = require('moment');

module.exports = {
  diffForHumans: (date) => {
    const formattedDate = moment(date * 1).format('DD/MM/YYYY');
    // const dateArr = formattedDate.split("/");
    // console.log(dateArr);

    return moment(formattedDate).fromNow();
  },
};
