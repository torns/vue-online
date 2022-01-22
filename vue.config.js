module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,
    publicPath:
        process.env.NODE_ENV === "production" ? "/vue-running" : "/vue-running",
    productionSourceMap: false, //关闭生产环境的sourceMap
};