module.exports = {
    "plugins": [
      "jest"
    ],
    "env": {
        "node": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:jest/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 2015
    },
    "rules": {
        "no-console": "off",
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
