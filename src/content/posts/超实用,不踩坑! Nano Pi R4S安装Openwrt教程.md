---
title: 超实用,不踩坑! Nano Pi R4S安装Openwrt教程
published: 2026-08-08
description: ''
image: './超实用,不踩坑! Nano Pi R4S安装Openwrt教程/2.png'
tags: ['软路由', 'Openwrt', 'ImmortalWrt', 'NanoPi R4S']
category: '软路由'
draft: false
lang: ''
---

# 超实用,不踩坑! Nano Pi R4S安装Openwrt教程

## 一、前言

笔者安装过多次Openwrt, 也踩过不少坑, 也体验到了Openwrt的强大和它丰富的功能，这次笔者将分享Nano Pi R4S安装Openwrt的教程, 以及它的一些使用技巧，希望能帮助到大家。

## 二、准备工作

1. 16G以上的TF卡与读卡器
2. 科学上网环境
3. TP-Link路由器
4. NanoPi R4S 配套散热风扇（可选）
5. USB SSD（可选，用来制作nas和个人网盘）

![](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/7.jpg)

我这是将NanoPi R4S连接上家里的光猫的交换机上(或者学校寝室中的路由器上)，然后插上一个2T USB SSD准备做NAS和个人网盘，最后接上一个散热风扇，防止NanoPi R4S过热。

还需要接上一个TP-Link路由器，用于广播WiFi信号，方便手机、平板、笔记本等设备连接上网。

## 三、安装Openwrt——ImmortalWrt固件系统

### 安装配套散热风扇 (可选)

![](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/1.png)

买的就是这种PWM控制的散热风扇，不占用USB接口，[风扇安装教程](https://mp.weixin.qq.com/s/fDqWqgEp87BDvejwWvCaAQ)，据说还不支持温控。

### 构建需要安装的镜像

1. 打开[NanoPi R4S 构建 immortalwrt 镜像网站](https://firmware-selector.immortalwrt.org/?version=24.10.6&target=rockchip%2Farmv8&id=friendlyarm_nanopi-r4s)，选择 R4S，版本选择 24.10.6
    > 24.10.6这个版本是最后一个能支持opkg安装软件包的版本，后续的版本就迁移使用apk安装包，不再支持opkg安装软件包了，为了良好的兼容性，建议还是使用有opkg安装包的版本(24.10.6也支持使用apk安装)。
2. 在**预安装软件包**后面添加一个主题`luci-theme-argon`，点击**请求构建**
3. 下载镜像，选择 **SYSUPGRADE (EXT4)** 格式的，方便后续/overlay的扩容
   > 如果选择 SYSUPGRADE (SQUASHFS)，默认的/overlay分区只有300MB，安装大量软件包后会经常不够用。
4. 使用rpi-imager或者win32diskimager将镜像写入TF卡，写入完成后将TF卡继续插在电脑上，准备进行overlay分区扩容。

### overlay分区扩容

这里使用gparted工具进行分区扩容，gparted是一个开源的分区管理工具，支持Linux、Windows和MacOS系统。

```bash
sudo gparted
```

![](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/3.png)

![](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/4.png)

调整了根目录的空间后，剩余的分给了/overlay分区，就足足差不多有32GB的空间了

### 开机打开web管理界面

开机后，有线连接NanoPi R4S和电脑，打开192.168.1.1的web管理界面，默认用户名密码为root/空密码

> 如果你出现502无法访问web界面的问题，但是能curl访问192.168.1.1，关闭梯子软件或者手动设置系统的梯子代理即可

![](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/2.png)

进来就可以看到熟系的界面了

### 设置风扇开启自转脚本

在系统-启动项-本地启动脚本中添加一下内容，保存即可

```bash
# NanoPi R4S fan fixed speed (90%)

PWM=/sys/class/pwm/pwmchip1

[ -d "$PWM/pwm0" ] || echo 0 > "$PWM/export"

sleep 1

echo 0 > "$PWM/pwm0/enable"
echo 50000 > "$PWM/pwm0/period"
echo 45000 > "$PWM/pwm0/duty_cycle"
echo 1 > "$PWM/pwm0/enable"
```

## 四、安装软件包

1. 进入系统管理-软件包，点击更新列表，等待更新完成
2. 在软件包搜索栏中输入你想安装的软件包名称，点击安装即可，这里我推荐几个安装
   - `luci-app-argon-config`: 主题设置
   - `luci-app-openlist`: 开源的网盘openlist
   - `luci-app-filebrowser-go`: 文件管理器
   - `luci-app-docker`: docker
   - `luci-app-samba4`: NAS
   - `luci-app-netdata`: 网络监控
   - `luci-app-ddns-go`: DDNS
   - `luci-app-ttyd`: 终端工具
   - `luci-app-sqm`: 智能队列管理

### 安装openclash

1. 现在自己电脑上打开[https://github.com/vernesong/OpenClash/releases](https://github.com/vernesong/OpenClash/releases)，下载最新版的ipk
2. 使用scp指令将ipk文件传到NanoPi R4S的/tmp目录下，scp指令如下：
    ```bash
    scp luci-app-openclash_0.47.133_all.ipk root@192.168.1.1:/tmp
    ```
3. ssh登录NanoPi R4S，执行以下命令安装ipk包：
    ```bash
    opkg install /tmp/luci-app-openclash_0.47.133_all.ipk
    ```
4. 安装完成后，退出openwrt web管理界面重新登录一下，就可以在服务-OpenClash中看到OpenClash的设置界面了，刚开始会提示安装clash内核，安装即可。

> 在插件设置-外部控制中，可以修改clash的web管理界面(如zashborad)的密码，保存设置，然后应用设置

### 配置filebrowser

在openwrt上安装部署filebrowser也超简单，在软件包中安装filebrowser后，退出重登openwrt就可以在`服务`中看到filebrowser了。

![](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/6.png)

在这里我仿照《绝区零》的风格编写了一套美化的css，在`全局设置`-`品牌信息文件夹路径`添加上文件夹路径，配置好后好看多了。

![](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/5.png)

开源链接：[https://github.com/riyuexingchennnn/filebrowser-zzz-style](https://github.com/riyuexingchennnn/filebrowser-zzz-style)

## 五、系统配置总览

安装好系统、装好软件包之后，笔者再来分享一下目前的完整配置，给大家一个参考。

### 硬件与系统

- **硬件**：NanoPi R4S（4GB 内存版，RK3399，aarch64）
- **系统**：ImmortalWrt 24.10.6 (r33869)
- **根分区**：29.3GB（overlay 扩容后，安装大量软件包也不慌）
- **存储**：2TB USB SSD（/mnt/nas，做 NAS 和个人网盘）

![LuCI 主界面](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/8.png)

登录后就是这个熟悉的界面了，可以看到系统状态、CPU 负载、内存占用等实时信息。

### 目前安装的常用软件包

![软件包列表](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/9.png)

笔者目前的装机清单（按用途分类）：

- **主题美化**：`luci-theme-argon` + `luci-app-argon-config`（Argon 主题设置）
- **容器**：`luci-app-docker` + `luci-app-dockerman`（Docker 管理面板）
- **网盘**：`luci-app-openlist`（OpenList 网盘聚合）
- **文件管理**：`luci-app-filebrowser-go`（FileBrowser）
- **内网穿透**：`luci-app-frpc`、`luci-app-ddns-go`（DDNS）、`luci-app-easytier`（EasyTier 组网）、`luci-app-tailscale-community`（Tailscale）
- **代理**：`luci-app-openclash`
- **NAS**：`luci-app-samba4`（SMB 共享）
- **监控**：`luci-app-netdata`、`luci-app-statistics`
- **网络优化**：`luci-app-sqm`（智能队列管理）
- **工具**：`luci-app-ttyd`（网页终端）、`luci-app-cpufreq`（CPU 调频）、`adguardhome`（DNS 广告过滤）

> 小技巧：如果软件包列表更新慢，可以在"系统-软件包"里先点"更新列表"，再搜索安装，速度会快很多。

## 六、Docker 实战：把服务都装进容器

装了 `luci-app-dockerman` 之后，管理容器就非常方便了，图形化界面一目了然。

![Docker 容器管理界面](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/10.png)

笔者目前跑着 6 个容器，全部是实战级应用：

| 容器 | 用途 | 端口 |
|------|------|------|
| `vaultwarden` | 自托管密码管理器（Bitwarden 兼容） | 18080 |
| `pdfjs` | 自建 PDF 在线查看器（支持页面间距切换） | 8088 |
| `qinglong` | 青龙面板（定时任务） | - |
| `homeassistant` | 智能家居中枢 | - |
| `xiaomiqiu-arm64` | 小米球内网穿透（VIP 节点） | - |
| `xiaomiqiu-arm64-free` | 小米球内网穿透（免费节点） | - |

### 部署一个容器（以 Vaultwarden 为例）

```bash
docker run -d \
  --name vaultwarden \
  --restart unless-stopped \
  -p 18080:80 \
  -v /mnt/nas/docker/vaultwarden:/data \
  vaultwarden/server:latest
```

> 注意：数据目录记得放到 NAS 盘（/mnt/nas）上，这样重刷系统不丢数据。另外容器数据目录的权限要给对（chown 1000:1000），不然容器会报 "unable to open database file"。

## 七、开机自启动

### 风扇固定转速

在"系统-启动项-本地启动脚本"中保留风扇脚本，开机自动调速：

```bash
# NanoPi R4S fan fixed speed (90%)
PWM=/sys/class/pwm/pwmchip1
[ -d "$PWM/pwm0" ] || echo 0 > "$PWM/export"
sleep 1
echo 0 > "$PWM/pwm0/enable"
echo 50000 > "$PWM/pwm0/period"
echo 45000 > "$PWM/pwm0/duty_cycle"
echo 1 > "$PWM/pwm0/enable"
```

### 开机自动启动所有 Docker 容器

虽然容器都设置了 `--restart unless-stopped`，但为了保险，笔者在 rc.local 里加了一段"遍历启动所有容器"的脚本，双保险：

```bash
# Auto-start all Docker containers on boot
if command -v docker >/dev/null 2>&1; then
    # Wait for the Docker daemon to become ready (max 30s)
    i=0
    while [ $i -lt 30 ]; do
        docker info >/dev/null 2>&1 && break
        sleep 1
        i=$((i+1))
    done
    # Start every stopped container
    for cid in $(docker ps -aq); do
        state=$(docker inspect -f '{{.State.Running}}' "$cid" 2>/dev/null)
        if [ "$state" = "false" ]; then
            docker start "$cid" >/dev/null 2>&1
        fi
    done
fi
```

> 为什么要加这段？因为 Docker 守护进程启动比 rc.local 慢，直接执行 docker 命令可能失败，所以先循环等待 daemon 就绪，再遍历启动所有容器。实测软路由断电重启后，6 个容器全部自动拉起，非常稳。

## 八、内网穿透全家桶

R4S 当软路由，最实用的场景之一就是内网穿透，笔者目前同时用了四套方案，各司其职：

| 方案 | 用途 |
|------|------|
| **frpc** | 稳定穿透 HTTP/HTTPS 服务（配合 DDNS 使用） |
| **ddns-go** | 动态域名解析，让穿透域名永不失效 |
| **Tailscale** | 异地组网，手机/电脑随时连回家（WireGuard 协议） |
| **EasyTier** | 轻量级组网，和 Tailscale 互为备份 |
| **小米球（xiaomiqiu）** | ngrok 类内网穿透，VIP + 免费双节点 |

### 服务列表一览

![LuCI 服务菜单](./超实用,不踩坑!%20Nano%20Pi%20R4S安装Openwrt教程/11.png)

在"服务"菜单里可以看到所有已安装的服务，OpenClash、DDNS、EasyTier、FileBrowser、FRPC、Tailscale 等都集中在这里管理，非常方便。

> 小提示：Tailscale 和 EasyTier 都是组网工具，功能有重叠，如果只用其中一个，可以把另一个停掉，省一点内存。

## 九、总结

经过这一整套配置，NanoPi R4S 已经从"一台小路由器"进化成了"家庭服务器全家桶"：

- ✅ 科学上网（OpenClash）
- ✅ 自建网盘（OpenList + FileBrowser + Samba NAS）
- ✅ 密码管理（Vaultwarden）
- ✅ 智能家居（Home Assistant）
- ✅ 内网穿透（frpc + DDNS + Tailscale + EasyTier + 小米球）
- ✅ 在线 PDF 查看（pdfjs）
- ✅ 定时任务（青龙）
- ✅ 广告过滤（AdGuard Home）

一台 300 块的 R4S，能干的事情远超它的价格。如果大家有什么好玩的玩法，欢迎在评论区交流！

> 本文会持续更新，如果后面笔者又折腾了新功能，会继续补充到这篇教程里。

