import moment from "moment";

export const getMessageAge = (createdAt: Date) => {
    const now = moment(new Date()); //todays date
    const end = moment(createdAt);
    const duration = moment.duration(now.diff(end)).asMinutes();
    let ageString = ''
    if (duration < 1) {
      ageString = 'just now'
    } else if (duration < 60) {
      ageString = Math.floor(duration)  + 'm ago';
    } else if (duration > 60 && duration < 60 * 24) {
      ageString = Math.floor(duration / 60) + 'h ago'; // minutes -> hours
    } else if (duration > 60 * 24 && duration < 60 * 24 * 7) {
      ageString = Math.floor(duration / 60 / 24) + 'd ago'; // minutes -> hours -> days
    } else {
      ageString = Math.floor(duration / 60 / 24 / 7) + 'w ago';
    }
    return ageString;
  }