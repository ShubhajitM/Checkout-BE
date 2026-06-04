Flows and sequence diagrams

High-level flow
1) Client code loads pricing rules and constructs CheckOutImpl.
2) Client scans items by SKU or Item instance; ShoppingCart quantities are updated if inventory has stock.
3) Client calls total():
   - Create cart snapshot (clone) for rule evaluation.
   - Apply each PricingRule against the snapshot; aggregate discounts.
   - Compute gross total from price list and quantities; subtract total discount for net total.
   - Fulfill: reduce inventory counts; reset cart to empty.

PlantUML sequence: scan and total
@startuml
actor Client
participant CheckOutImpl as CO
participant ItemInventory as Inv
participant ShoppingCart as Cart
participant PricingRule as Rule

Client -> CO: scanSku("atv")
CO -> Inv: checkIfProductAvailable(atv)
Inv --> CO: true
CO -> Cart: addItemInCart(Item(atv))

Client -> CO: scanSku("ipd")
CO -> Inv: checkIfProductAvailable(ipd)
Inv --> CO: true
CO -> Cart: addItemInCart(Item(ipd))

Client -> CO: total()
CO -> Cart: clone()
activate Cart
Cart --> CO: ShoppingCart clone
deactivate Cart
loop for each rule
  CO -> Rule: apply(clone)
  Rule --> CO: discount
  CO -> Cart: addDiscount(discount)
end
CO -> Cart: getTotalPrice()
Cart --> CO: gross
CO -> Cart: getTotalDiscount()
Cart --> CO: discount
CO -> CO: net = gross - discount
CO -> Cart: reduceProductCount()
CO -> CO: shoppingCart = new ShoppingCart()
Client <-- CO: net
@enduml

Error flow: insufficient stock
@startuml
actor Client
participant CheckOutImpl as CO
participant ItemInventory as Inv

Client -> CO: scanSku("atv")
CO -> Inv: checkIfProductAvailable(atv)
Inv --> CO: false
CO -> Client: throw Error("Order can't be fulfilled for this item: atv")
@enduml

Component diagram
@startuml
package "Checkout Engine" {
  [CheckOutImpl]
  [ShoppingCart]
  [PricingRule Interface]
  [AppleTvPricingRule]
  [SuperIpadPricingRule]
}
[ItemInventory] as Inv
[ItemPricingMap] as Price

[CheckOutImpl] --> [ShoppingCart]
[CheckOutImpl] ..> [PricingRule Interface]
[AppleTvPricingRule] ..|> [PricingRule Interface]
[SuperIpadPricingRule] ..|> [PricingRule Interface]
[ShoppingCart] ..> Inv : reduce counts
[ShoppingCart] ..> Price : pricing
@enduml
