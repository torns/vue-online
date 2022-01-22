module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,
    publicPath:
        process.env.NODE_ENV === "production" ? "/vue-online" : "/vue-online",
    productionSourceMap: false, //关闭生产环境的sourceMap
};
