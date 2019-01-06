module.exports = {
  extends: ["airbnb", "plugin:prettier/recommended"],
  parser: "babel-eslint",
  plugins: ["prettier"],
  rules: {
    "prefer-destructuring": 0,
    "import/prefer-default-export": 0
  },
  env: {
    node: true
  }
};
