# OrbitDB Browser

OrbitDB Browser是一个OrbitDB WebUI管理工具，实现了Events、Documents,KeyValue类型数据库的增删改查，简化libp2p配置，支持配置Stun节点、Relay服务器以及PubSub Topics，默认支持WebRTC实现浏览器间节点传输。支持查看libp2p连接情况。支持OrbitDB Identity导入导出，支持OrbitDB AccessController管理数据库权限，通过WebUI轻松上手OrbitDB,管理你的公共数据库。

在线示例:   
 [https://orbitdb.linsoap.tech](https://orbitdb.linsoap.tech)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m797545247-08424d2f39d27871217796c9)


## 部署
### 本地测试
```shell
 git clone https://github.com/LinSoap/orbitdb-browser.git
 cd orbitdb-browser
 npm install
 npm run dev
```
### 本地部署
使用serve配合pm2守护进程。具体操作询问AI。需要注意，由于helia和libp2p在浏览器中的限制，在未配置https的情况下，只能通过localhost访问。如需上线公网，则需要通过nginx配置https。配置https后，由于浏览器安全策略，无法连接到ws节点,需要连接wss节点。

## 使用方式
### 初始化Libp2p设置
IPFS是建立与Libp2p设置之上的，OrbitDB是建立在IPFS之上的，首先需要进行Libp2p设置，本项目已经精简大部分Libp2p配置，使得该浏览器节点支持目前libp2p所有支持的连接方式（Webtransport,Websocket,WebRTC,WebRTC-Direct），只需要进入Libp2p Config页面，配置PubSub Topics,Stun Servers,Bootstrap Servers即可，大部分情况只需配置Bootstrap Servers即可。  
概念解释：  
[PubSub Topics](https://docs.libp2p.io/concepts/pubsub/overview/)：可以看作为在网络中配置了相同Topics的节点会互相连接  
[Stun Servers](https://docs.libp2p.io/concepts/transports/webrtc/#webrtc-private-to-private):用于WebRTC连接穿透NAT  
[Bootstrap Servers](https://docs.libp2p.io/concepts/discovery-routing/rendezvous/#rendezvous-in-libp2p):可以看作为启动节点时，会自动尝试连接到这些节点
### 创建OrbitDB Identity
OrbitDB支持数据库权限管理，在创建和使用数据库时需要验证身份，在Identity Manager页面输入字符串点击创建即可，由于浏览器环境中使用OrbitDB,存储块会保留在浏览器存储空间中，更换浏览器或消除缓存后会导致身份文件和数据库文件丢失，以及新环境创建Identity结果完全随机。所以完成创建后记得导出身份文件，防止失去丢数据库的权限。

### 创建数据库
OrbitDB创建数据库时会依据所有的选项进行一次计算，产生一个随机的OrbitDB Address。故所有的选项如果相同，则会打开同一个数据库。在Address选项中，可以输入一个string或者一个OrbitDB Address，如果是一个OrbitDB Address,则会直接打开现有的数据库，而不会使用下面配置的内容，故推荐在Connect Database中打开数据库，而不是在Create New Database页面。  
[配置选项](https://api.orbitdb.org/module-Database.html)

### 权限控制
OrbitDB支持IPFS AccessController和OrbitDB AccessController,需要在创建数据库时指定，创建时添加Writable ID指定了哪些身份可以操作该数据库，该值创建后无法修改。若使用OrbitDB AccessController，该数据库则会创建一个同名的KeyValue的Orbitdb数据库作为权限凭证。可在数据库的Detail页面查看地址、添加或删除权限。


## 已知问题
 - 使用React进行无法建立稳定的Libp2p连接，经常与公共BootstrapServers断开连接
 - 使用公共Bootstrap发现节点多，尝试建立的Web transport通道超过浏览器上限，且回收通道机制存在问题  
总之基于以上问题，该项目仍难以以浏览器作为对等节点加入公共Libp2p网络，完成去中心化数据库，仍需要自建relay节点，通过relay节点完成公共数据库的同步。如果你知道解决方案欢迎联系我。

## 技术栈
 - React
 - TypeScript
 - OrbitDB
 - libp2p
 - IPFS
 - Chakra UI