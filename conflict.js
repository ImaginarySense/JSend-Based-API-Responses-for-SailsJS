/**
 * conflict.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.conflict();
 *     // -or-
 *     return res.conflict(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'conflict'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: optionalData }
 * ```
 */

module.exports = function conflict(optionalData) {
  //
  // Get access to `req` and `res`
  const
    // eslint-disable-next-linereq = this.req,
    res = this.res,
    // Define the status code to send in the response.
    statusCodeToSet = 409;

  // If no data was provided, use res.sendStatus().
  if (optionalData === undefined) {
    // sails.log.info('Ran custom response: res.conflict()');
    return res.sendStatus(statusCodeToSet);
    // Something went wrong in the database adapter. \_
  }
  // Else if the provided data is an Error instance, if it has
  // a toJSON() function, then always run it and use it as the
  // response body to send.  Otherwise, send down its `.stack`,
  // except in production use res.sendStatus().
  else if (_.isError(optionalData)) {
    sails.log.info('Custom response `res.conflict()` called with an Error:', optionalData);

    // If the error doesn't have a custom .toJSON(), use its `stack` instead--
    // otherwise res.json() would turn it into an empty dictionary.
    // (If this is production, don't send a response body at all.)
    if (!_.isFunction(optionalData.toJSON)) {
      if (process.env.NODE_ENV === 'production')
        return res.sendStatus(statusCodeToSet);

      else
        return res.status(statusCodeToSet).send(optionalData.stack);

    }
  }
  // Set status code and send response data.
  else {
    return res.status(statusCodeToSet).send(optionalData);
  }


};
