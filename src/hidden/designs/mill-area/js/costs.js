// v25 — build cost for every new build that had none on its card (keyed by the card's name; main.js attaches these
// when the card has no finance block of its own). Planning estimates at Nov 2026 prices, ±40 % until quotations.
// Rates follow the front-zone + relocation estimate doc: PEB godown Rs 2,200–3,200/sq ft, tall milling hall
// Rs 3,000–4,500/sq ft, office / residential Rs 4,000–8,000/sq ft depending on finish, heavy concrete paving
// Rs 300–550/sq ft. Machinery the MashAllah programme already budgets is left out and said so.
const NOTE = 'Planning estimate at Nov 2026 prices (±40 % until quotations). Land already owned.';

export const BUILD_COSTS = {
  'Weighbridge (moved to the end of the main road)': {
    rows: [
      ['Build cost', 'Rs 0.15–0.3 cr (moving the existing scale)'],
      ['— pit, approach slabs, kerbs + drainage', 'Rs 0.08–0.15 cr'],
      ['— cabin, boom, traffic light, CCTV, wiring', 'Rs 0.04–0.08 cr'],
      ['— lift, move, re-install + recalibration (PSQCA / weights + measures)', 'Rs 0.03–0.07 cr'],
      ['New 80 t pit-type scale instead', 'Rs 0.45–0.65 cr installed'],
    ],
    note: NOTE + ' A new scale makes sense only if the old load cells are tired; it also lets the old one keep working at the front until the new mill runs.',
  },
  'Intake conveyor (proposed)': {
    rows: [
      ['Build cost', 'Rs 0.12–0.25 cr'],
      ['— intake hopper + grid in the paddy store', 'Rs 0.03–0.05 cr'],
      ['— ≈95 ft enclosed belt on trestles', 'Rs 0.07–0.15 cr'],
      ['— motors, starter, wiring, dust hood', 'Rs 0.02–0.05 cr'],
    ],
    note: NOTE + ' Optional since v23: trucks and tractors can reach the saila intake through the open yard again.',
  },
  'Boiler house': {
    rows: [
      ['Build cost', 'Rs 0.5–1.1 cr'],
      ['— house (1,512 sq ft, brick + steel roof), chimney base, husk feed bay', 'Rs 0.3–0.5 cr'],
      ['— boiler refurbishment + certification', 'Rs 0.2–0.6 cr (already in the MashAllah programme, Phase 1)'],
    ],
    note: NOTE + ' Steam and condensate lines to the saila plant are in the saila move (Rs 0.4–1.0 cr in the relocation estimate).',
  },
  'Rice mill hall (milling + finished goods, one building)': {
    rows: [
      ['Build cost', 'Rs 4.0–6.3 cr (building + moving the existing machinery)'],
      ['— hall 11,280 sq ft @ Rs 3,000–4,500 (frame, cladding, plinth, floor, machine foundations, head house, 4 docks)', 'Rs 3.4–5.1 cr'],
      ['— belt gallery from the saila bins + husk belt to the boiler', 'Rs 0.2–0.35 cr'],
      ['— dismantle, move, re-erect + align the existing machinery', 'Rs 0.4–0.8 cr'],
      ['vs the relocation estimate', 'Was Rs 3.9–6.7 cr for a separate milling hall + finished-goods godown: one hall is about the same or a little less'],
      ['Not included', 'The new 4–6 TPH line (Rs 4–9 cr) and colour sorter (Rs 0.5–1.0 cr): already in the MashAllah programme'],
    ],
    note: NOTE + ' Electrical (new connection, transformer, panels: Rs 0.6–1.5 cr) and dust / fire safety (Rs 0.3–0.8 cr) are separate lines in the relocation estimate.',
  },
  'Truck circulation (one-way loop)': {
    rows: [
      ['Build cost', 'Rs 0.4–0.6 cr'],
      ['— ≈12,300 sq ft heavy concrete paving @ Rs 300–450 (back lane, west lane, open yard, office strip, east apron)', 'Rs 0.37–0.55 cr'],
      ['— lines, arrows, bollards, drains', 'Rs 0.03–0.05 cr'],
    ],
    note: NOTE + ' Part of the "yard paving, roads and drainage" line (Rs 0.2–0.5 cr) in the relocation estimate, now larger because the yard is open.',
  },
  'Rice mill operations office': {
    rows: [
      ['Build cost', 'Rs 2.2–2.9 cr'],
      ['— 4,430 sq ft over 2 floors @ Rs 5,000–6,500 (RCC frame, office finish, washrooms, AC)', 'Rs 2.2–2.9 cr'],
      ['Fit-out (desks, IT, CCTV)', 'Rs 0.1–0.2 cr extra'],
    ],
    note: NOTE,
  },
  'Drop-off + visitor parking': {
    rows: [
      ['Build cost', 'Rs 0.1–0.2 cr'],
      ['— paving, kerbs, lines + lights (1,110 sq ft)', 'Rs 0.05–0.08 cr'],
      ['— porte-cochère canopy at the north door', 'Rs 0.05–0.12 cr'],
    ],
    note: NOTE,
  },
  'Owners’ backyard': {
    rows: [['Build cost', 'Rs 4–8 lakh (paving, planting, boundary wall, lights, gate)']],
    note: NOTE,
  },
  'Buffalo + goat shed': {
    rows: [
      ['Build cost', 'Rs 0.12–0.2 cr'],
      ['— open-fronted steel shed, brick walls, floor + drains (992 sq ft)', 'Rs 0.1–0.16 cr'],
      ['— mangers, troughs, water, fans, dung pit', 'Rs 0.02–0.04 cr'],
    ],
    note: NOTE + ' Animals not included.',
  },
  'Farmer’s path': {
    rows: [['Build cost', 'Rs 1.5–3 lakh (507 sq ft brick paving, edging, gate)']],
    note: NOTE,
  },
  'Flour QC lab': {
    rows: [
      ['Build cost', 'Rs 0.35–0.65 cr'],
      ['— room (380 sq ft): RCC, tiles, lab benches, AC, sink, power backup', 'Rs 0.2–0.3 cr'],
      ['— instruments (moisture, gluten, falling number, ash furnace, sieves, balance)', 'Rs 0.15–0.35 cr'],
    ],
    note: NOTE,
  },
  'Flour truck parking': {
    rows: [
      ['Build cost', 'Rs 0.1–0.16 cr'],
      ['— 4 bays + approach, ≈2,500 sq ft heavy concrete', 'Rs 0.08–0.12 cr'],
      ['— curved corner, kerbs, landscaping', 'Rs 0.02–0.04 cr'],
    ],
    note: NOTE,
  },
  'Silos strip': {
    rows: [
      ['Build cost', 'Rs 1.3–3.0 cr'],
      ['— 3 steel silos × 24 ft ≈ 1,080–1,140 t, with aeration + temperature cables', 'Rs 0.9–2.2 cr'],
      ['— foundations, conveyors, elevator, gallery', 'Rs 0.4–0.8 cr'],
    ],
    note: NOTE + ' Needs a structural check (≈3.75 ft side clearance). The MashAllah programme’s Phase 2 silos (2 × 1,250–1,500 t) are budgeted at Rs 3–8 cr.',
  },
  'Option: shop row': {
    rows: [
      ['Build cost', 'Rs 0.55–0.75 cr'],
      ['— 6 shops, ≈1,400 sq ft single storey @ Rs 3,500–4,500', 'Rs 0.5–0.63 cr'],
      ['— parking strip, back wall, signs', 'Rs 0.05–0.1 cr'],
      ['Rent', '6 × Rs 15,000–30,000/month ≈ Rs 11–22 lakh/yr'],
      ['ROI on build cost', '≈ 15–30 %/yr'],
      ['Payback', '≈ 3.5–6.5 years'],
    ],
    note: NOTE + ' Shop rents are assumptions: check two or three local dealers.',
  },
  'Option: mill front': {
    rows: [
      ['Build cost', 'Rs 0.55–0.8 cr (this card only)'],
      ['— sales counter + reception, ≈640 sq ft @ Rs 5,000–6,500', 'Rs 0.32–0.42 cr'],
      ['— visitor parking, paving between the stores + flats, trees', 'Rs 0.23–0.38 cr'],
      ['On their own cards', 'Store A Rs 0.55–0.7 cr · store B Rs 0.37–0.5 cr · staff flats Rs 3.5–4.5 cr · trolley strip Rs 0.85–1.2 cr'],
    ],
    note: NOTE + ' Demolishing the old mill is in the relocation estimate (site prep + demolition, Rs 0.3–0.8 cr).',
  },
  'Drying yard': {
    rows: [
      ['Build cost (new work only)', 'Rs 0.12–0.2 cr'],
      ['— v18 extension to the main road, ≈3,340 sq ft paving', 'Rs 0.1–0.15 cr'],
      ['— v15 rounded corners: kerbs + drains', 'Rs 0.02–0.05 cr'],
    ],
    note: NOTE,
  },
  'Solar shed · shade garden + goat & chicken yard': {
    rows: [
      ['Build cost (new work only)', 'Rs 6–12 lakh'],
      ['— raised beds + drip lines (west half)', 'Rs 2–4 lakh'],
      ['— fencing, coop on legs, hay rack, troughs, gate (east half)', 'Rs 4–8 lakh'],
    ],
    note: NOTE + ' The solar shed itself already exists.',
  },
};

// v26 — storage capacity for every store (shown as a "Storage" section and a capacity tile on the card).
// Basis: paddy in 40 kg (1 maund) jute bags, bag stacks ≈ 0.58 t/m³ (the paddy store's 54,800 ft³ of stacks ≈ 900 t);
// rice in 50 kg bags, wheat in 100 kg bags, flour in 20 kg bags, bran ≈ 35 kg bags. Milling rate from the
// MashAllah programme's 4–6 TPH line run 16 h a day ≈ 65–95 t of paddy a day (≈ 42–62 t of rice, ≈ 13–19 t of husk).
// The flour mill's daily grind isn't recorded yet, so its days are at an assumed 60–100 t of wheat a day.
const MILL = '≈ 65–95 t of paddy a day (4–6 TPH line, 16 h)';
export const STORAGE = {
  'Paddy store (existing shed)': {
    capacity: '≈ 900 t of bagged paddy',
    rows: [
      ['Capacity', '≈ 900 t of paddy in bags (Saad’s figure; the modelled stacks give the same)'],
      ['Bags', '≈ 22,500 × 40 kg (1 maund) jute bags'],
      ['Stacks', '12 blocks on wooden dunnage, 11–15 ft high (≈ 14–19 bags), ≈ 54,800 ft³ of stacks · 6 ft centre aisle + cross-aisles at the 5 doors'],
      ['Floor use', '≈ 10,400 sq ft; ≈ 60–65 % under stacks · ≈ 0.086 t per sq ft overall'],
      ['Days of milling', '≈ 10–14 days at ' + MILL],
      ['Loose (bulk) instead', '≈ 1,300 t if heaped 8 ft deep — but brick walls aren’t built for grain pressure, so keep it bagged'],
      ['Keeping it sound', 'Paddy ≤ 14 % moisture before stacking · fumigate under sheets every 30–45 days · first in, first out by block'],
    ],
    note: 'Harvest buying (Oct–Dec) refills the store several times, so a season’s throughput is a multiple of the 900 t.',
  },
  'Option · paddy store flat roof + solar': {
    capacity: '≈ 900 t of bagged paddy (unchanged)',
    rows: [
      ['Storage under the roof', 'Unchanged: ≈ 900 t of paddy ≈ 22,500 × 40 kg bags in 12 stack blocks, 11–15 ft high'],
      ['Headroom', 'Flat deck at 21 ft (was 20 ft eaves rising to a 27 ft ridge): the stacks stay the same height'],
      ['Climate inside', 'Insulated deck + panels shading it: a cooler store with less day–night swing, so less condensation on the top bags'],
      ['During the works', 'Re-roof bay by bay, outside harvest, moving stacks under sheets: ≈ 2–3 weeks with the store half full'],
    ],
  },
  'Option: store A (old weighbridge spot)': {
    capacity: '≈ 280 t of bags',
    rows: [
      ['Capacity', '≈ 280 t of bagged paddy or rice'],
      ['Bags', '≈ 7,000 × 40 kg paddy bags, or ≈ 5,600 × 50 kg rice bags'],
      ['Stacks', 'Up to ≈ 13 ft high (16–18 bags) under 20 ft eaves, in 5 blocks down the east side with a 10 ft forklift / labour aisle'],
      ['Floor use', '2,400 sq ft · ≈ 0.12 t per sq ft (taller stacks and fewer aisles than the old paddy store)'],
      ['Days of milling', '≈ 3–4 days of paddy at ' + MILL],
      ['Or', '≈ 8 tractor-trolleys under cover, or a workshop / garage later'],
    ],
  },
  'Option: store B (between the pump and the staff flats)': {
    capacity: '≈ 170 t of bags',
    rows: [
      ['Capacity', '≈ 170 t of bagged paddy or rice'],
      ['Bags', '≈ 4,250 × 40 kg paddy bags, or ≈ 3,400 × 50 kg rice bags'],
      ['Stacks', 'Up to ≈ 10 ft high (12–14 bags) under 16 ft eaves, one row of blocks with an 8 ft aisle'],
      ['Floor use', '≈ 1,690 sq ft · ≈ 0.1 t per sq ft'],
      ['Days of milling', '≈ 2 days of paddy at ' + MILL],
      ['Also', 'Tarps, empty jute bags, spare trolley tyres and tools (it replaces the old holding area’s store room)'],
    ],
  },
  'Rice mill hall (milling + finished goods, one building)': {
    capacity: '≈ 350–450 t of finished rice',
    rows: [
      ['Finished rice', '≈ 350–450 t on ≈ 3,500 sq ft of the east part (the packing line takes the rest)'],
      ['Bags', '≈ 7,000–9,000 × 50 kg (or 14,000–18,000 × 25 kg) rice bags, stacked ≈ 12 ft on pallets'],
      ['Days of output', '≈ 6–10 days at ≈ 42–62 t of rice a day (≈ 65 % of the paddy milled)'],
      ['Husk bay', '≈ 10–12 t of loose husk (under a day’s ≈ 13–19 t): the boiler takes its share, the rest is sold or trucked out daily'],
      ['Product bins', 'Over the packing line, ≈ 1–2 hours of output, so packing can run while the line changes grade'],
    ],
    note: 'More finished-goods room, if needed: store A (≈ 280 t) is a short forklift run up the main road.',
  },
  'Silos strip': {
    capacity: '≈ 1,080–1,140 t of wheat in bulk',
    rows: [
      ['Capacity', '3 silos × ≈ 360–380 t ≈ 1,080–1,140 t of wheat in bulk (paddy is lighter: ≈ 800–850 t)'],
      ['Size', '24 ft diameter × 40 ft each, steel, on ring foundations'],
      ['Replaces', '≈ 11,000 × 100 kg bags: no bag cost, no stacking labour, less rodent and moisture loss'],
      ['Days of grinding', '≈ 11–19 days at an assumed 60–100 t of wheat a day'],
      ['Keeping it sound', 'Aeration fans + temperature cables · wheat ≤ 13 % moisture going in · top conveyor fills, the elevator + bridge feed the mill'],
    ],
  },
  'Flour mill · wheat godown': {
    capacity: '≈ 650–750 t of bagged wheat',
    rows: [
      ['Capacity', '≈ 650–750 t of wheat in bags'],
      ['Bags', '≈ 6,500–7,500 × 100 kg (or 13,000–15,000 × 50 kg) bags'],
      ['Stacks', '≈ 12–14 ft high in blocks either side of a central aisle to the intake pit'],
      ['Floor use', '5,940 sq ft · ≈ 0.11–0.13 t per sq ft'],
      ['Days of grinding', '≈ 7–12 days at an assumed 60–100 t of wheat a day (the real grind isn’t recorded yet)'],
    ],
    note: 'Section uses are guessed until there are photos of the flour mill.',
  },
  'Flour mill · packing hall + flour godown': {
    capacity: '≈ 250–350 t of bagged flour',
    rows: [
      ['Capacity', '≈ 250–350 t of flour on ≈ 3,100 sq ft (the three packers take ≈ 1,000 sq ft)'],
      ['Bags', '≈ 12,500–17,500 × 20 kg bags (or fewer 50 kg bags for bakeries)'],
      ['Days of output', '≈ 3–6 days of flour at ≈ 75 % extraction of an assumed 60–100 t grind (≈ 45–75 t of flour a day)'],
    ],
    note: 'Section uses are guessed until there are photos of the flour mill.',
  },
  'Flour mill · bran store': {
    capacity: '≈ 120–160 t of bran',
    rows: [
      ['Capacity', '≈ 120–160 t of bran in bags (bran is light, so it fills the space before it gets heavy)'],
      ['Bags', '≈ 3,500–4,500 bags of ≈ 35 kg'],
      ['Days of output', '≈ 6–10 days at ≈ 22–25 % of an assumed 60–100 t grind (≈ 13–25 t of bran a day)'],
    ],
    note: 'Section uses are guessed until there are photos of the flour mill.',
  },
};
