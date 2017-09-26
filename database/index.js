const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/eq_visualizer', {
  useMongoClient: true
});

let userSchema = mongoose.Schema({
  username: String,
  data: String
});

var User = mongoose.model('User', userSchema);

let save = ({username, data}) => {
  return new User({username: username, data: JSON.stringify(data)}).save();
};

let find = (username) => {
  return User.find({username: username});
};

module.exports.save = save;
module.exports.find = find;