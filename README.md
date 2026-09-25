# InstrumentDex prototype

Single-facility instrument-identification demonstration. Run `npm start`, then open `http://localhost:4173`. Run `npm test` for identity and applicability checks. Node 20+ is sufficient; there is no install or build step.

## Shared tester playground

The static site can optionally save and retrieve shared tester drafts through Supabase. Before using it, run the SQL migration and approve the intended tester accounts as described in [supabase/README.md](supabase/README.md). The browser configuration contains only the provided publishable key; RLS and authenticated RPC checks protect the database.

## Demonstration paths

1. Search **Mayo** and open Mayo Curved Scissors. Compare it with Metzenbaum scissors, see its family, specialties, and tray context, then follow the confirmed fictional product through Decontamination, Packaging, Sterilization / HLD process, Warnings / Notes, and concise source provenance.
2. Open Babcock forceps for the intentional unresolved contrast. Recognition and tray context remain useful, but product-specific processing is withheld pending product confirmation.
3. Search **Frazier** for a confirmed lumened pathway, **DS-F40** for the fictional HLD pathway, or **TV-C20** for the low-temperature camera-head pathway.
4. Open Anaesthesia mask to see why **FA-M20** is insufficient for variant-specific processing; **FA-M20-B** and **FA-M20-A** separately confirm the blue and amber variants.
5. Open **Add instrument** to capture identification, specialty context, tray/set context, an optional unresolved product candidate, and draft processing/source notes. Approved testers can save a shared draft. Saving a draft cannot confirm a product or publish processing methods.

## Model and scope

`domain.js` separates instrument concepts, manufacturer products, variants, facility profiles, authoritative sources, grounded knowledge representations, and facility publication records. The interface translates those objects into frontline language.

The reference contains free-text and category search, aliases, manufacturer/catalog/variant identifiers, feature and tray matching, explainable result reasons, direct confusable comparison, tray quantities, local conventions, identity states, and MDR-friendly instrument intake. The intake form uses collapsible processing stages, radio-style method states, additive requirement checkboxes, draft pathway summaries, visible processing restrictions, compact source linkage, and optional presets. Confirmed records display only their applicable processing methods, grouped by stage. Each method has a concise status and expandable source/provenance disclosure. The demo includes standard reusable, lumened, variant-specific, HLD, and low-temperature pathways. Intake details are stored as a separate draft and cannot become a confirmed product or applicable processing data until the required identity, source, review, and publication gates are satisfied.

All manufacturers, products, sources, dates, review/publication claims, and facility data are fictional demo material. Illustrations are schematic and are not validated clinical identification images. The optional shared playground stores only approved-tester draft submissions; it includes no clinical processing parameters, IFUs, operational hold tracking, or production governance workflow. A real implementation requires actual product mapping evidence, qualified source grounding, review, publication controls, and manufacturer/facility source access.
