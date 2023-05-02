import { Item } from "./model/item";
import { Sku } from "./model/sku";
import { PricingRule } from "./pricing_rules/pricingRule";
import { CheckOutImpl } from "./checkout/checkOutImpl";
import { AppleTvPricingRule } from "./pricing_rules/appleTvPricingRule";
import { SuperIpadPricingRule } from "./pricing_rules/superIpadPricingRule";

const pricingRuleList: PricingRule[] = [];
loadPricingRules(pricingRuleList);

const ck = new CheckOutImpl(pricingRuleList);

ck.scan(new Item(Sku.atv));
ck.scan(new Item(Sku.ipd));
ck.scan(new Item(Sku.ipd));
ck.scan(new Item(Sku.atv));
ck.scan(new Item(Sku.ipd));
ck.scan(new Item(Sku.ipd));
ck.scan(new Item(Sku.ipd));
console.log(ck.total());

function loadPricingRules(ruleList: PricingRule[]) {
    ruleList.push(new AppleTvPricingRule())
    ruleList.push(new SuperIpadPricingRule())
}