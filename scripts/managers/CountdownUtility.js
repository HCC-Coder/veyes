class CountdownUtilitiy
{
  constructor()
  {

  }

  updateCountdown(obj) {
    var str_countdown = '';
    if (obj.hours > 0) {
      str_countdown += ('00' + obj.hours + ':').slice(-3);
    }
    str_countdown += ('00' + obj.minutes + ':').slice(-3);
    str_countdown += ('00' + obj.seconds).slice(-2);
    return str_countdown
  }

  setTodayTillTime(time_till) {
    var till = new Date();
    till.setHours(
      Math.floor(time_till / 100)
    );
    till.setMinutes(
      Math.floor(time_till % 100)
    );
    till.setSeconds(0);
    return till;
  }

  getTimeRemaining(endtime){
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }
}

module.exports = CountdownUtilitiy