const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNr: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { versionKey: false }
);

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
