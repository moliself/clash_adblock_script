function main(config) {
  // 1. 确保基础字段存在
  config["proxies"] = config["proxies"] || [];
  config["proxy-groups"] = config["proxy-groups"] || [];
  config["rule-providers"] = config["rule-providers"] || {};
  config["rules"] = config["rules"] || [];

  // 提取所有节点名称
  const allProxyNames = config["proxies"].map(p => p.name);

  // 按关键字筛选节点的辅助函数（可根据你的机场命名习惯调整正则）
  const filterProxies = (regex) => {
    const matched = allProxyNames.filter(name => regex.test(name));
    // 若该地区没有匹配到节点，则回退到 DIRECT，避免空代理组导致报错
    return matched.length > 0 ? matched : ["DIRECT"];
  };

  const jpProxies = filterProxies(/(日本|JP|Japan|东京|大阪|埼玉|深川)/i);
  const usProxies = filterProxies(/(美国|US|United States|America|洛杉矶|圣何塞|西雅图|纽约|达拉斯)/i);
  const hkProxies = filterProxies(/(香港|HK|Hong Kong|港)/i);
  const sgProxies = filterProxies(/(新加坡|SG|Singapore|狮城)/i);

  // 自动测速公共配置
  const autoTestConfig = {
    type: "url-test",
    url: "https://www.gstatic.com/generate_204", // 测速地址
    interval: 300, // 每 300 秒（5 分钟）自动测速一次
    tolerance: 50  // 延迟差值小于 50ms 时不切换，避免频繁跳节点
  };

  // 2. 定义新增的地区代理组
  const regionGroups = [
    {
      name: "🇯🇵 日本节点",
      ...autoTestConfig, // 如需自动选最快可改为 "select"
      proxies: jpProxies
    },
    {
      name: "🇺🇸 美国节点",
      ...autoTestConfig, // 如需自动选最快可改为 "select"
      proxies: usProxies
    },
    {
      name: "🇭🇰 香港节点",
      ...autoTestConfig, // 如需自动选最快可改为 "select"
      proxies: hkProxies
    },
    {
      name: "🇸🇬 新加坡节点",
      ...autoTestConfig, // 如需自动选最快可改为 "select"
      proxies: sgProxies
    }
  ];

  // 主选择组（可选：把地区组和所有节点放进去，方便统一切换）
  const mainGroup = {
    // name: "🚀 节点选择",
    name: "🔰 手动选择",
    type: "select",
    proxies: [
      "🇯🇵 日本节点",
      "🇺🇸 美国节点",
      "🇭🇰 香港节点",
      "🇸🇬 新加坡节点",
      ...allProxyNames,
      "DIRECT"
    ]
  };

  // 将新代理组放到原有 proxy-groups 前面（避免重复同名组）
  const existingGroupNames = new Set(regionGroups.map(g => g.name).concat(mainGroup.name));
  const filteredOldGroups = config["proxy-groups"].filter(g => !existingGroupNames.has(g.name));
  config["proxy-groups"] = [mainGroup, ...regionGroups, ...filteredOldGroups];

  // 3. 注入去广告规则源
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

  // 4. 在 rules 最顶部插入去广告拦截规则（去重后插入）
  const adRules = [
    "RULE-SET,AWAvenue-Ads,REJECT",
    "RULE-SET,anti-AD,REJECT"
  ];
  const remainingRules = config["rules"].filter(r => !adRules.includes(r));
  config["rules"] = [...adRules, ...remainingRules];

  return config;
}