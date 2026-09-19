/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("work_experiences", {
    description: {
      type: "text",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("work_experiences", "description");
};
