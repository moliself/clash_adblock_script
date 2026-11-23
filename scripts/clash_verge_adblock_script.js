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
    const matched = allProxyNames.filter((name) => regex.test(name));
    // 若该地区没有匹配到节点，则回退到 DIRECT，避免空代理组导致报错
    return matched.length > 0 ? matched : ["DIRECT"];
  };

  const jpProxies = filterProxies(/(日本|JP|Japan|东京|大阪|埼玉|深川)/i);
  const usProxies = filterProxies(/(美国|US|United States|America|洛杉矶|圣何塞|西雅图|纽约|达拉斯)/i);
  const hkProxies = filterProxies(/(香港|HK|Hong Kong|港)/i);
  const sgProxies = filterProxies(/(新加坡|SG|Singapore|狮城)/i);

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
    }
  ];

  // 3. 保留原有“手动选择”节点列表给“🚀 节点选择”
  const originalManualGroup = config["proxy-groups"].find((g) => g.name.includes("🔰 手动选择"));
  const manualProxies = originalManualGroup?.proxies?.length
    ? originalManualGroup.proxies
    : [...allProxyNames, "DIRECT"];

  const mainGroup = {
    name: "🚀 节点选择",
    type: "select",
    proxies: manualProxies
  };

  // 去重并合并代理组
  const filteredOldGroups = config["proxy-groups"].filter((g) => g.name !== mainGroup.name);
  config["proxy-groups"] = [mainGroup, ...regionGroups, ...filteredOldGroups];

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