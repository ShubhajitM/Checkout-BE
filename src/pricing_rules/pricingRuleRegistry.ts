import { PricingRule } from "./pricingRule";

export class PricingRuleRegistry {
  private static rules: PricingRule[] = [];

  public static register(rule: PricingRule): void {
    this.rules.push(rule);
  }

  public static getAll(): PricingRule[] {
    return [...this.rules];
  }
}
