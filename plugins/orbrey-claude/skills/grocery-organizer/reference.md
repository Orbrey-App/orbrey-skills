# Grocery Organizer — Reference

Reference tables for the `grocery-organizer` skill.

---

## 1. Standard Category Taxonomy

| Category | Includes |
|---|---|
| Produce | All fresh fruit, veg, fresh herbs, salad mixes |
| Meat & seafood | Fresh meat, deli meats, fresh fish, prawns, smoked salmon |
| Dairy & eggs | Milk, cheese, butter, yoghurt, eggs, cream, cultured products |
| Bakery | Loaves, rolls, wraps, English muffins, cakes from in-store bakery |
| Pantry / dry goods | Pasta, rice, flour, sugar, tinned goods, oils, sauces, spices, condiments |
| Frozen | Frozen veg, ice cream, frozen meals, ice |
| Drinks | Soft drinks, juice, sparkling water, alcohol |
| Snacks & confectionery | Chips, crackers, muesli bars, chocolate, lollies |
| Cleaning & laundry | Detergents, dish products, bin liners, paper towels |
| Personal care | Shampoo, soap, toothpaste, deodorant, sanitary products |
| Pet | Dog/cat food, treats, kitty litter |
| Other | Batteries, hardware, anything that doesn't fit above |

---

## 2. Aisle Order (Woolworths/Coles standard)

```
Produce → Bakery → Deli/Meat → Dairy & eggs →
Pantry/dry → Frozen → Drinks → Snacks →
Cleaning → Personal care → Pet → Other (hardware)
```

Aldi flips Cleaning to the centre aisle and is more variable; default to standard with a flag.

---

## 3. Stem-Matching Rules

When detecting duplicates, normalise:

1. Lowercase the entire string.
2. Strip parenthetical clarifiers: `Milk (2L)` → `milk`.
3. Strip leading/trailing quantities: `500g flour` → `flour`.
4. Strip brand prefixes (when followed by a generic noun): `Bega cheese` → `cheese`.
5. Strip plural `s` from common produce: `onions` → `onion`.

If the resulting stems match across two rows → candidate duplicate.

---

## 4. Unit Reconciliation

| When two rows have | Do |
|---|---|
| Same unit (g + g) | Sum |
| Compatible units (g + kg) | Convert to the larger unit, sum |
| Count vs weight (e.g. "3 onions" + "500g onions") | Surface to user — don't auto-reconcile |
| One unit missing | Adopt the unit from the row that has it; ask if surprising |

---

## 5. Confidence Thresholds

- **High** — exact name match (case-insensitive) or exact stem match with same unit family.
- **Medium** — stem match across brand/generic divide; unit family matches.
- **Low** — fuzzy match (Levenshtein ≤2) or category match only. Always confirm with user.

Never auto-merge Low-confidence pairs.
