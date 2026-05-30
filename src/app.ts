import { PricingRule } from "./pricing_rules/pricingRule";
import { CheckOutImpl } from "./checkout/checkOutImpl";
import { AppleTvPricingRule } from "./pricing_rules/appleTvPricingRule";
import { SuperIpadPricingRule } from "./pricing_rules/superIpadPricingRule";
import { CatalogService } from "./catalog/catalogService";

const pricingRuleList: PricingRule[] = [];

const loadPricingRules = () => {
    pricingRuleList.push(new AppleTvPricingRule())
    pricingRuleList.push(new SuperIpadPricingRule())
}

try {
  CatalogService.loadCatalog();
} catch (err) {
  console.error('Failed to load product catalog:', err);
  throw err;
}
loadPricingRules();

const ck = new CheckOutImpl(pricingRuleList);

ck.scanSku('atv');
ck.scanSku('ipd');
ck.scanSku('ipd');
ck.scanSku('atv');
ck.scanSku('ipd');
ck.scanSku('ipd');
ck.scanSku('ipd');

console.log(ck.total());