module.exports = {
  extends: ["prettier/react"],
  plugins: ["react", "react-hooks"],
  rules: {
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"]
      }
    ],
    "react/jsx-one-expression-per-line": 0,
    "react/destructuring-assignment": 0,
    "react/button-has-type": 0,
    "react/jsx-wrap-multilines": 0,
    "react-hooks/rules-of-hooks": 2
  },
  settings: {
    react: {
      version: "16.8"
    }
  },
  env: {
    browser: true
  }
};
