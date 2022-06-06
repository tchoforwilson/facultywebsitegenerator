import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";
import APIFeatures from "./../utils/apiFeatures.js";

/**
 * @brief Create a new document in a model
 * @param {Model} Model
 * @returns
 */
export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.filename; // add file to the request bo
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
 * @brief Get a single data from a Model
 * @param {Model} Model
 * @param {string} popOptions
 * @returns
 */
export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
 * @brief Get all the data from a model
 * @param {Object} Model
 * @returns
 */
export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow nested get reviews on tour (hack)
    let filter = {};
    //if (req.params.tourId) filter = { tour: req.params.tourId };
    // EXECUTE THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //const doc = await features.query.explain();
    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

/**
 * @brief Update a single document in the model
 * @param {Model} Model
 * @returns
 */
export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
 * @brief Delete a single document from the Model
 * @param {Model} Model
 * @returns
 */
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No tour found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
