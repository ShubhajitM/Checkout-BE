import { CheckOutImpl } from "./checkout/checkOutImpl";
import { PricingRule } from "./pricing_rules/pricingRule";
import { PricingRuleRegistry } from "./pricing_rules/pricingRuleRegistry";
import "./pricing_rules/registerAll";

const pricingRuleList: PricingRule[] = PricingRuleRegistry.getAll();

const ck = new CheckOutImpl(pricingRuleList);

ck.scanSku('atv');
ck.scanSku('ipd');
ck.scanSku('ipd');
ck.scanSku('atv');
ck.scanSku('ipd');
ck.scanSku('ipd');
ck.scanSku('ipd');

console.log(ck.total());
