const fs = require('fs')
const path = require('path')
const proxy_check = require('proxy-check');

const filePath = path.join(__dirname, 'checkproxy.txt')

const readFileProxyProcess = () => {
    return fs.readFileSync(filePath, 'utf-8').toString().split(/\r?\n/)
}

const checkProxy = async () => {
    const arrProxy = []
    const dataProxy = readFileProxyProcess() 
    dataProxy.forEach(proxy => {
        const proxySplit = proxy.split(":")
        const host = proxySplit[0]
        const port = parseInt(proxySplit[1])
        const proxyAuth = `${proxySplit[2]}:${proxySplit[3]}`
        const objProxy = {
            host,
            port,
            proxyAuth
        }
        arrProxy.push(objProxy)
    })

    // tiến hành check proxy
    arrProxy.forEach(proxy => {
        proxy_check(proxy).then(r => {
            console.log(`${proxy.host}:${proxy.port}:${proxy.proxyAuth}-live`); // true
            fs.writeFileSync("proxyLive.txt",`${proxy.host}:${proxy.port}:${proxy.proxyAuth}-live\n`,{ flag: "a" })
        }).catch(e => {
            console.error(`${proxy.host}:${proxy.port}:${proxy.proxyAuth}-die`); // ECONNRESET
            fs.writeFileSync("proxyDie.txt",`${proxy.host}:${proxy.port}:${proxy.proxyAuth}-die\n`,{ flag: "a" })
        })
    })
}

checkProxy()




