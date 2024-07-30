export default class User {
    constructor() {
      this._data = {
        joel: 'las3rs',
        marcus: 'lulz',
        sebastian: 'secr3t'
      };
    }
  
    check(user, pass) {
      if(this._data[user] === undefined) return false;
      return this._data[user] === pass;
    }
  }