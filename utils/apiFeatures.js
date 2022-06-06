/**
 * @brief: This class implements all the features related to API,
 * This features include :
 * 1. Filtering: This filter the fields that are not table fields like page, sort, limit and fields
 * 2. Sorting: This sort the data been queried in ascending order
 * 3. Limiting: This limit the fields to be queried from the database
 * 4. Pagination: This fields implement the amount of data to query from the database
 */
class APIFeatures {
  /**
   * @brief Parameterized constructor, Takes as parameter the query object
   * and the query string
   * @param {String} query  -> query object
   * @param {String} queryString  -< query string
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  /**
   *
   * @returns Object -> query object
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
export default APIFeatures;
