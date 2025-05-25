import { Item } from "./model/item";
import { Sku } from "./model/sku";
import { PricingRule } from "./pricing_rules/pricingRule";
import { CheckOutImpl } from "./checkout/checkOutImpl";
import { AppleTvPricingRule } from "./pricing_rules/appleTvPricingRule";
import { SuperIpadPricingRule } from "./pricing_rules/superIpadPricingRule";

const pricingRuleList: PricingRule[] = [];

const loadPricingRules = () => {
    pricingRuleList.push(new AppleTvPricingRule())
    pricingRuleList.push(new SuperIpadPricingRule())
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