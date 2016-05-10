var password = process.env.mongoPW
module.exports = {
	//'url' : 'mongodb://pianoboe105:'+password+'@ec2-54-200-11-149.us-west-2.compute.amazonaws.com:27017/dummyDB' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
	'url' : 'localhost:27017/dummyDB'
};
