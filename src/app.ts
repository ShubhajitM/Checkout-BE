import { PricingRule } from "./pricing_rules/pricingRule";
import { CheckOutImpl } from "./checkout/checkOutImpl";
import { AppleTvPricingRule } from "./pricing_rules/appleTvPricingRule";
import { SuperIpadPricingRule } from "./pricing_rules/superIpadPricingRule";
import { AccountsDb } from "./db/accountsDb";

const pricingRuleList: PricingRule[] = [];

const loadPricingRules = () => {
  pricingRuleList.push(new AppleTvPricingRule());
  pricingRuleList.push(new SuperIpadPricingRule());
};

loadPricingRules();

const ck = new CheckOutImpl(pricingRuleList);

ck.scanSku('atv');
ck.scanSku('ipd');
ck.scanSku('ipd');
ck.scanSku('atv');
ck.scanSku('ipd');
ck.scanSku('ipd');
ck.scanSku('ipd');

const accounts = new AccountsDb();
console.log('Accounts:', accounts.listAccounts());

console.log(ck.total());
