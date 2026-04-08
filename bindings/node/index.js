const path = require("path");
const root = path.join(__dirname, "..", "..");

// 尝试加载预构建二进制文件
// node-gyp-build 对于 scoped package 可能无法正确解析文件名
// 所以手动尝试多种可能的路径
let binding;
try {
  binding = require("node-gyp-build")(root);
} catch (e) {
  // 如果失败，尝试直接加载特定路径
  const platform = process.platform + "-" + process.arch;
  const scopedName = "@fsdev+tree-sitter-pascal";
  const unscopedName = "tree-sitter-pascal";
  const bindingName = "tree_sitter_pascal_binding";

  const tryPaths = [
    path.join(root, "prebuilds", platform, scopedName + ".node"),
    path.join(root, "prebuilds", platform, unscopedName + ".node"),
    path.join(root, "prebuilds", platform, bindingName + ".node"),
    path.join(root, "build", "Release", bindingName + ".node"),
  ];

  let loaded = false;
  for (const tryPath of tryPaths) {
    try {
      binding = require(tryPath);
      loaded = true;
      break;
    } catch (_) {}
  }

  if (!loaded) {
    throw e;
  }
}

module.exports = binding;

try {
  module.exports.nodeTypeInfo = require("../../src/node-types.json");
} catch (_) {}
