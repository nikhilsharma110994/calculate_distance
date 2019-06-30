'use strict';

/**
 * Module dependencies.
 */
const constants = require('./constants'),
  usersToInvite = [];

/**
 * Fetching Users.
 * 
 * Fetch users from a file who are at a distance within 100km and sort by their user_id.
 */
exports.fetchUser = (filePath) => {
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(filePath)
  });
  lineReader.on('line', (line) => {
    line = JSON.parse(line);
    filterUsers(line);
  })
    .on('close', () => {
      sortUsers();
      console.log(usersToInvite);
    });
}

/**
 * Filter Users.
 * 
 * Filter users who are at a distance within 100kms.
 * 
 * @param  user details of user used for filtering on the basis of 100km condition. 
 */
const filterUsers = (user) => {
  var distanceFromDublin = calculateDistance(user.latitude, user.longitude);
  if (distanceFromDublin <= 100) {
    usersToInvite.push({ "user_id": user.user_id, "name": user.name });
  }
}

/**
 * Degree to Radian.
 * 
 * Convert Degree to Radian.
 * 
 * @param degrees for converting degrees to radian.
 */
const degToRad = (degrees) => {
  return degrees * Math.PI / 180;
}

/**
 * Calculate Distance.
 * 
 * Calculating distance between two locations.
 * 
 * @param userLat user latitude.
 * @param userLon user longitude.
 */
const calculateDistance = (userLat, userLon) => {
  var dLat = degToRad(userLat - constants.DUBLIN_LAT);
  var dLon = degToRad(userLon - constants.DUBLIN_LON);

  var dublinLatRad = degToRad(constants.DUBLIN_LAT);
  var userLatRad = degToRad(userLat);

  var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(dublinLatRad) * Math.cos(userLatRad);
  var y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return Math.ceil(constants.EARTH_RADIUS_KM * y);
}

/**
 * Sort User.
 * 
 * Sorting user based on user_id.
 */
const sortUsers = () => {
  usersToInvite.sort((a, b) => (a.user_id > b.user_id) ? 1 : ((b.user_id > a.user_id) ? -1 : 0));
}
