function main(config) {
  // 1. 确保 rule-providers 对象存在
  config["rule-providers"] = config["rule-providers"] || {};

  // 2. 注入 GitHub 广告过滤规则源
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

  // 3. 确保 rules 数组存在，并将拦截规则插入最顶部
  config["rules"] = config["rules"] || [];
  const adRules = [
    "RULE-SET,AWAvenue-Ads,REJECT",
    "RULE-SET,anti-AD,REJECT"
  ];

  config["rules"] = [...adRules, ...config["rules"]];

  return config;
}