function main(config) {
  // 1. 确保基础字段存在
  config["proxies"] = config["proxies"] || [];
  config["proxy-groups"] = config["proxy-groups"] || [];
  config["rule-providers"] = config["rule-providers"] || {};
  config["rules"] = config["rules"] || [];

  // 提取所有节点名称
  const allProxyNames = config["proxies"].map((p) => p.name);

  // 按关键字筛选节点的辅助函数（可根据你的机场节点命名习惯调整正则）
  const filterProxies = (regex) => {
    // 没有匹配节点时返回空数组，由后续逻辑直接过滤掉代理组
    return allProxyNames.filter((name) => regex.test(name));
  };

  const jpProxies = filterProxies(/(日本|JP|Japan|东京|大阪|埼玉|深川)/i);
  const usProxies = filterProxies(/(美国|US|United States|America|洛杉矶|圣何塞|西雅图|纽约|达拉斯)/i);
  const hkProxies = filterProxies(/(香港|HK|Hong Kong|港)/i);
  const sgProxies = filterProxies(/(新加坡|SG|Singapore|狮城)/i);
  const twProxies = filterProxies(/(台湾|TW|Taiwan|台北|新北|台中|高雄)/i);
  const caProxies = filterProxies(/(加拿大|CA|Canada|多伦多|温哥华|蒙特利尔)/i);
  const deProxies = filterProxies(/(德国|DE|Germany|德意志|法兰克福|柏林|慕尼黑)/i);
  const frProxies = filterProxies(/(法国|FR|France|巴黎|马赛)/i);
  const auProxies = filterProxies(/(澳大利亚|AU|Australia|悉尼|墨尔本|澳洲)/i);
  const gbProxies = filterProxies(/(英国|UK|GB|United Kingdom|Britain|England|伦敦|曼彻斯特)/i);
  const krProxies = filterProxies(/(韩国|KR|Korea|首尔|釜山)/i);
  const inProxies = filterProxies(/(印度|IN|India|孟买|新德里|班加罗尔)/i);
  const nlProxies = filterProxies(/(荷兰|NL|Netherlands|Holland|阿姆斯特丹)/i);
  const trProxies = filterProxies(/(土耳其|TR|Turkey|Türkiye|伊斯坦布尔)/i);
  const brProxies = filterProxies(/(巴西|BR|Brazil|圣保罗)/i);
  const aeProxies = filterProxies(/(阿联酋|UAE|AE|United Arab Emirates|迪拜|阿布扎比)/i);
  const ruProxies = filterProxies(/(俄罗斯|RU|Russia|莫斯科|圣彼得堡)/i);
  const thProxies = filterProxies(/(泰国|TH|Thailand|曼谷)/i);
  const vnProxies = filterProxies(/(越南|VN|Vietnam|胡志明|河内)/i);
  const myProxies = filterProxies(/(马来西亚|MY|Malaysia|吉隆坡)/i);
  const idProxies = filterProxies(/(印度尼西亚|印尼|ID|Indonesia|雅加达)/i);
  const phProxies = filterProxies(/(菲律宾|PH|Philippines|马尼拉)/i);

  // 按线路特征筛选节点（机场命名差异较大，可按需扩展关键字）
  const ieplProxies = filterProxies(/(IEPL|专线)/i);
  const iplcProxies = filterProxies(/(IPLC|企业专线)/i);
  const cn2Proxies = filterProxies(/(CN2|GIA)/i);
  const bgpProxies = filterProxies(/(BGP)/i);
  const lowLatencyProxies = filterProxies(/(低延迟|低延时|Low.?Latency|Lite)/i);
  const highBandwidthProxies = filterProxies(/(高带宽|大带宽|High.?Bandwidth|Premium)/i);

  // 2. 定义自动测速的地区代理组（如需手动选节点，可将 type 改为 "select"）
  const autoTestConfig = {
    type: "url-test",
    url: "https://www.gstatic.com/generate_204",
    interval: 300, // 每 300 秒自动测速一次
    tolerance: 50  // 延迟差值小于 50ms 时不频繁切换
  };

  const regionGroups = [
    {
      name: "🇯🇵 日本节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: jpProxies
    },
    {
      name: "🇺🇸 美国节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: usProxies
    },
    {
      name: "🇭🇰 香港节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: hkProxies
    },
    {
      name: "🇸🇬 新加坡节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: sgProxies
    },
    {
      name: "🇹🇼 台湾节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: twProxies
    },
    {
      name: "🇨🇦 加拿大节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: caProxies
    },
    {
      name: "🇩🇪 德国节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: deProxies
    },
    {
      name: "🇫🇷 法国节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: frProxies
    },
    {
      name: "🇦🇺 澳大利亚节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: auProxies
    },
    {
      name: "🇬🇧 英国节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: gbProxies
    },
    {
      name: "🇰🇷 韩国节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: krProxies
    },
    {
      name: "🇮🇳 印度节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: inProxies
    },
    {
      name: "🇳🇱 荷兰节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: nlProxies
    },
    {
      name: "🇹🇷 土耳其节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: trProxies
    },
    {
      name: "🇧🇷 巴西节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: brProxies
    },
    {
      name: "🇦🇪 阿联酋节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: aeProxies
    },
    {
      name: "🇷🇺 俄罗斯节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: ruProxies
    },
    {
      name: "🇹🇭 泰国节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: thProxies
    },
    {
      name: "🇻🇳 越南节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: vnProxies
    },
    {
      name: "🇲🇾 马来西亚节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: myProxies
    },
    {
      name: "🇮🇩 印尼节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: idProxies
    },
    {
      name: "🇵🇭 菲律宾节点",
      ...autoTestConfig, // 如需自动选最快可改为 type: "select"
      proxies: phProxies
    },
    {
      name: "⚡ IEPL 专线",
      ...autoTestConfig,
      proxies: ieplProxies
    },
    {
      name: "⚡ IPLC 专线",
      ...autoTestConfig,
      proxies: iplcProxies
    },
    {
      name: "⚡ CN2/GIA 专线",
      ...autoTestConfig,
      proxies: cn2Proxies
    },
    {
      name: "🌐 BGP 节点",
      ...autoTestConfig,
      proxies: bgpProxies
    },
    {
      name: "🚄 低延迟节点",
      ...autoTestConfig,
      proxies: lowLatencyProxies
    },
    {
      name: "📶 高带宽节点",
      ...autoTestConfig,
      proxies: highBandwidthProxies
    }
  ];

  // 3. 过滤没有匹配节点的代理组，再加入“手动选择”和“节点选择”
  const availableRegionGroups = regionGroups.filter((group) =>
    Array.isArray(group.proxies) && group.proxies.length > 0
  );
  const allRegionGroupNames = regionGroups.map((group) => group.name);
  const regionGroupNames = availableRegionGroups.map((group) => group.name);

  const originalManualGroup = config["proxy-groups"].find((g) => g.name.includes("🔰 手动选择"));
  const originalManualProxies = originalManualGroup?.proxies?.length
    ? originalManualGroup.proxies
    : [...allProxyNames, "DIRECT"];

  const retainedManualProxies = originalManualProxies.filter((proxy) =>
    !allRegionGroupNames.includes(proxy) || regionGroupNames.includes(proxy)
  );

  // 区域代理组放在节点前面；去重是为了重复运行脚本时不会重复追加
  const manualProxies = [...new Set([
    ...regionGroupNames,
    ...retainedManualProxies,
    "DIRECT"
  ])];

  const mainGroup = {
    name: "🚀 节点选择",
    type: "select",
    proxies: manualProxies
  };

  // 更新原有“🔰 手动选择”，使它和“🚀 节点选择”一样可直接选择区域代理组
  if (originalManualGroup) {
    originalManualGroup.proxies = manualProxies;
  }

  // 去除旧版节点选择及旧区域代理组，避免重复运行脚本时重复追加
  const filteredOldGroups = config["proxy-groups"].filter((g) =>
    g.name !== mainGroup.name && !allRegionGroupNames.includes(g.name)
  );
  config["proxy-groups"] = [mainGroup, ...availableRegionGroups, ...filteredOldGroups];

  // 统一把其他代理组和 rules 中对“🔰 手动选择”的引用改为“🚀 节点选择”
  for (const group of config["proxy-groups"] ?? []) {
    if (Array.isArray(group.proxies)) {
      group.proxies = [...new Set(group.proxies.map((proxy) =>
        proxy === "🔰 手动选择" ? "🚀 节点选择" : proxy
      ))];
    }
  }

  config["rules"] = (config["rules"] ?? []).map((rule) =>
    rule.replace(/,🔰 手动选择(,|$)/, ",🚀 节点选择$1")
  );

  // 4. 注入去广告规则源（需 Mihomo 内核支持 mrs 格式）
  Object.assign(config["rule-providers"], {
    "AWAvenue-Ads": {
      type: "http",
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.mrs",
      path: "./ruleset/AWAvenue-Ads.mrs",
      interval: 86400
    },
    "anti-AD": {
      type: "http",
      behavior: "domain",
      format: "yaml",
      url: "https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-clash.yaml",
      path: "./ruleset/anti-AD.yaml",
      interval: 86400
    }
  });

  // 5. 将去广告拦截规则插入 rules 最顶部（去重后插入）
  const adRules = [
    "RULE-SET,AWAvenue-Ads,REJECT",
    "RULE-SET,anti-AD,REJECT"
  ];
  const remainingRules = config["rules"].filter((r) => !adRules.includes(r));
  config["rules"] = [...adRules, ...remainingRules];

  return config;
}