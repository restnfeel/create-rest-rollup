import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import alias from "rollup-plugin-alias";
import postcss from "rollup-plugin-postcss";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import replace from "rollup-plugin-replace";
import path from "path";
import image from "rollup-plugin-img";

const distName = path.basename(__dirname);

export default {
  input: "index.js",
  output: {
    file: `./dist/${distName}.min.js`,
    format: "umd",
    //name : `${distName.replace(/-/gi,"")}`,
    globals: {}
  },
  external: [],
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: "node_modules/**"
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    postcss({
      plugins: []
    }),
    image({
      output: './dist/images',
      extensions: /\.(png|jpg|jpeg|gif|svg)$/,
      limit : 8192,
      exclude: 'node_modules/**'
    }),
    replace({
      "values": {
          ENVIROMENT: JSON.stringify('local'),
          API_URL : JSON.stringify("https://api.restnfeel.com/api")
      }
    }),
    commonjs({
      include: ["node_modules/**"],
      sourceMap : true,
      namedExports: {
        "node_modules/react/index.js": ["React", "Component", "Fragment", "createElement", "PureComponent",
            "Children", "isValidElement","cloneElement"],
        "node_modules/react-dom/index.js": ["ReactDOM", "findDOMNode", "unstable_batchedUpdates", "createPortal"],
          "node_modules/@semantic-ui-react/event-stack/lib/index.js" : ["instance"]
      }
    }),
    alias({}),
    globals(),
    builtins(),
    //uglify()
  ]
};
