/**
 * @brief: Handle exceptions resulting from async await executions
 * catch the exception and pass it to the next middleware
 */
export default (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
