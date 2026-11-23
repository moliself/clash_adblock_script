# Clash Verge / FlClash 地区代理组与去广告脚本

本指南整合了**去广告规则注入**（`AWAvenue-Ads` 与 `anti-AD`）以及**按关键字自动生成地区代理组**（支持 `url-test` 自动测速）的配置修改脚本。脚本会保留原有节点内容，并确保区域代理组可用于“手动选择”与“节点选择”。

---

## 一、完整脚本

脚本文件位于：

- `scripts/clash_verge_adblock_script.js`

脚本入口为：

```javascript
function main(config)
```

脚本接收完整配置对象并返回修改后的配置对象。

### Clash Verge Rev

1. 打开 **Clash Verge Rev**。
2. 进入 **订阅** 页面。
3. 右键对应订阅并选择 **脚本**。
4. 加载 `scripts/clash_verge_adblock_script.js`。
5. 保存脚本后刷新或重载订阅。

### FlClash

1. 打开 FlClash，并确认当前使用 Mihomo 内核。
2. 在订阅配置对应的配置修改或脚本功能中加载 `scripts/clash_verge_adblock_script.js`。
3. 保存脚本并刷新或更新订阅配置。
4. 更新后检查代理组及去广告规则是否已生成。

如果 FlClash 当前版本的界面名称与上述描述略有不同，请在应用内寻找订阅配置处理、配置覆写或脚本相关选项。

---

## 二、常见配置调整

### 1. 切换代理组模式

脚本默认使用自动测速模式：

```javascript
const autoTestConfig = {
  type: "url-test",
  url: "https://www.gstatic.com/generate_204",
  interval: 300,
  tolerance: 50
};
```

- `url-test`：按 `interval` 周期自动选择低延迟节点，代理组标签通常显示为 `URLTest`。
- `select`：改为手动选择节点，代理组标签通常显示为 `Selector`。

切换为手动模式时可将配置改为：

```javascript
const autoTestConfig = {
  type: "select"
};
```

也可以保留原配置，但手动选择时不再需要 `url`、`interval` 和 `tolerance` 字段。

### 2. 自定义地区关键字

若机场节点命名包含特殊前缀或城市名，例如 `JP-01`、`沪日`、`美西`，可修改对应正则表达式：

```javascript
const jpProxies = filterProxies(/(日本|JP|Japan|东京|大阪|沪日)/i);
const usProxies = filterProxies(/(美国|US|United States|America|洛杉矶|美西)/i);
```

地区匹配逻辑位于脚本顶部。如节点名称不包含上述关键字，需要自行调整正则表达式。

### 3. 将指定域名分流到地区组

若希望特定网站走指定地区，可在规则合并位置插入自定义规则。例如：

```javascript
const customRules = [
  "DOMAIN-SUFFIX,pixiv.net,🇯🇵 日本节点",
  "DOMAIN-SUFFIX,openai.com,🇺🇸 美国节点"
];

config["rules"] = [...adRules, ...customRules, ...remainingRules];
```

自定义规则必须放在通用规则之前，才能优先匹配。脚本原文件默认使用：

```javascript
config["rules"] = [...adRules, ...remainingRules];
```

可按需要添加 `customRules`。

---

## 三、如何验证生效

1. 保存脚本并刷新或重载订阅配置。
2. 进入客户端的代理页面，确认以下代理组已出现：
   - `🇯🇵 日本节点`
   - `🇺🇸 美国节点`
   - `🇭🇰 香港节点`
   - `🇸🇬 新加坡节点`
   - `🇹🇼 台湾节点`
   - `🇨🇦 加拿大节点`
   - `🇩🇪 德国节点`
   - `🇫🇷 法国节点`
   - `🇦🇺 澳大利亚节点`
   - `🇬🇧 英国节点`
   - `🇰🇷 韩国节点`
   - `🇮🇳 印度节点`
   - `🇳🇱 荷兰节点`
   - `🇹🇷 土耳其节点`
   - `🇧🇷 巴西节点`
   - `🇦🇪 阿联酋节点`
   - `🇷🇺 俄罗斯节点`
   - `🇹🇭 泰国节点`
   - `🇻🇳 越南节点`
   - `🇲🇾 马来西亚节点`
   - `🇮🇩 印度尼西亚节点`
   - `🇵🇭 菲律宾节点`
   - `⚡ IEPL 专线`
   - `⚡ IPLC 专线`
   - `⚡ CN2/GIA 专线`
   - `🌐 BGP 节点`
   - `🚄 低延迟节点`
   - `📶 高带宽节点`
3. 确认 `🚀 节点选择` 和 `🔰 手动选择` 中均包含相应的地区代理组及原有节点。
4. 打开客户端日志页面并浏览网页或打开应用。若看到类似以下记录，说明去广告规则已生效：

```text
[TCP] ... --> galileotelemetry.tencent.com:443 match RuleSet(anti-AD) using REJECT
```

### 排查规则下载失败

若规则集未生效，请检查：

- Mihomo 内核是否支持 `mrs` 格式。
- 客户端配置目录下的 `./ruleset/` 是否已生成：
  - `AWAvenue-Ads.mrs`
  - `anti-AD.yaml`
- 网络或代理是否正常，规则源下载是否超时。
- Clash Verge Rev 或 FlClash 是否已刷新配置并重新加载规则集。

### 处理空节点匹配

- 如果某个地区没有匹配到节点，该地区代理组会回退到 `DIRECT`，不会形成空代理组。
- 所有地区代理组仍会出现在 `🚀 节点选择` 和 `🔰 手动选择` 中；未匹配地区可切换到 `DIRECT`。

新增地区关键字包括：

- 台湾：`台湾、TW、Taiwan、台北、新北、台中、高雄`
- 加拿大：`加拿大、CA、Canada、多伦多、温哥华、蒙特利尔`
- 德国：`德国、DE、Germany、法兰克福、柏林、慕尼黑`
- 法国：`法国、FR、France、巴黎、马赛`
- 澳大利亚：`澳大利亚、AU、Australia、悉尼、墨尔本、澳洲`
- 英国：`英国、UK、GB、United Kingdom、Britain、伦敦`
- 韩国：`韩国、KR、Korea、首尔、釜山`
- 印度：`印度、IN、India、孟买、新德里、班加罗尔`

线路特征代理组包括：

- IEPL 专线：匹配 `IEPL` 或 `专线`
- IPLC 专线：匹配 `IPLC` 或 `企业专线`
- CN2/GIA 专线：匹配 `CN2` 或 `GIA`
- BGP 节点：匹配 `BGP`
- 低延迟节点：匹配 `低延迟`、`低延时`、`Low-Latency` 或 `Lite`
- 高带宽节点：匹配 `高带宽`、`大带宽`、`High-Bandwidth` 或 `Premium`
