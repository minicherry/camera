module.exports = { // 模块导出
    devServer: { // 开发服务器
        host: 'localhost', // 设置默认端口
        port: 8080,
        proxy: { // 代理
            '/api': {
                target: 'http://localhost:3000',
                ws: true, //是否跨域
                changeOrigin: true,
            }
        }
    }
}