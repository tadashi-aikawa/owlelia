module.exports = {
  root: true,
  // ESLintにTypeScript syntaxを理解させる
  parser: "@typescript-eslint/parser",
  // 利用するプラグインを指定
  plugins: [
    // ESLintをTypeScriptで使うためのプラグイン
    "@typescript-eslint",
  ],
  // 利用するベース設定を指定
  extends: [
    // ESLintが提供する推奨設定
    "eslint:recommended",
    // ↑の中でTypeScriptに不要なものをOFFにする設定 (TypeScriptの型チェックで事足りているもの)
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/eslint-recommended.ts
    "plugin:@typescript-eslint/eslint-recommended",
    // TypeScriptで推奨されるものをONにする設定
    "plugin:@typescript-eslint/recommended",
  ],
};
