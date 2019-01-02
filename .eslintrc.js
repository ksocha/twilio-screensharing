module.exports = {
  extends: ["airbnb", "plugin:prettier/recommended"],
  parser: "babel-eslint",
  plugins: ["react", "prettier"],
  rules: {
    "prefer-destructuring": 0,
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"]
      }
    ],
    "react/jsx-one-expression-per-line": 0,
    "react/destructuring-assignment": 0,
    "react/button-has-type": 0,
    "react/jsx-wrap-multilines": 0
  },
  settings: {
    react: {
      version: "16.6"
    }
  }
};
