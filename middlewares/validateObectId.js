import mongoose from "mongoose";

const validateObjectId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  console.log("validating", id);
  console.log("validated", isValid);
  if (!isValid) throw new Error("Not a Valid id or Not Found ");
};

export default validateObjectId;
