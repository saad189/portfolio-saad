// The Great Expansion — v7 confirmed geometry (feet). Origin = SW corner, x east, y north.
export const ytop = (x) => 528 + 60.5 * x / 220;          // slanted road frontage
export const SITE = {
  boundary: [[0,0],[440,0],[440,280.5],[220,280.5],[220,588.5],[0,528]],
  gate: { x1: 195, x2: 220 },
  roads: {
    main:   { x1: 195, y1: 0,   x2: 220, y2: 588 },
    branch: { x1: 220, y1: 110, x2: 440, y2: 134 },
    loopOuter: { x1: 43.2, y1: 169, x2: 195, y2: 410 },
    // v20: weighbridge moved to the south end of the main road, between finished goods and the flour mill (was bay x 165–195 × y 430–515,
    // platform x 175–186 × y 445–505 in the front zone). Trucks cross it southbound, then loop back via the back lane behind finished goods.
    weighBay: { x1: 195.5, y1: 20, x2: 219.5, y2: 96 },
    weighbridge: { x1: 204, y1: 28, x2: 215, y2: 88 },
    weighCabin: { x1: 196.5, y1: 51, x2: 202.5, y2: 65 },
  },
  front: { poly: [[0,410],[195,410],[195,ytop(195)],[0,528]] },
  frontStore: { x1: 168, y1: 412, x2: 193, y2: 508 },           // v20: store on the old weighbridge bay (original front zone only); v21: as long as the trolley holding area
  storage:  { x1: 0, y1: 169, x2: 43.2, y2: 410 },
  dryingYard: { x1: 59, y1: 185, x2: 195, y2: 394 },        // v18: runs east to the main road (the loop's unused east leg is paved in)
  rice: {
    zone:    { x1: 0, y1: 0, x2: 195, y2: 169 },
    saila:   { x1: 0, y1: 84.5, x2: 43.2, y2: 169 },
    sailaFree: { x1: 0, y1: 50, x2: 43.2, y2: 84.5 },
    boiler:  { x1: 0, y1: 15, x2: 43.2, y2: 50 },
    hall:    { x1: 43.2, y1: 39, x2: 93.2, y2: 169 },
    husk:    { x1: 43.2, y1: 14, x2: 68, y2: 39 },
    service: { x1: 68, y1: 0, x2: 93.2, y2: 39 },
    reserve: { x1: 93.2, y1: 104, x2: 150, y2: 169 },
    yard: [ {x1:93.2,y1:0,x2:123,y2:104}, {x1:123,y1:75,x2:195,y2:104}, {x1:150,y1:104,x2:195,y2:119} ],
    fg:      { x1: 123, y1: 16, x2: 173, y2: 100 },            // v9: extended north (was y 5–75); v19: south end cut back 11 ft for a truck lane behind it
    apron:   { x1: 173, y1: 5, x2: 195, y2: 100 },
    offices: { x1: 150, y1: 119, x2: 195, y2: 169 },          // plot
    opsOffice: { x1: 120, y1: 126, x2: 174, y2: 167 },        // building (v16: east 17 ft removed so the lane/main-road corner can be rounded)
    laneW:  { x1: 93.2, y1: 0, x2: 123, y2: 126 },              // two-way truck lanes between buildings (v9)
    laneEW: { x1: 123, y1: 100, x2: 195, y2: 126 },
    laneN:  { x1: 93.2, y1: 126, x2: 120, y2: 169 },
    laneS:  { x1: 123, y1: 0.55, x2: 173, y2: 15.7 },             // v19: back lane behind finished goods (wall face to plinth ≈15 ft)
  },
  east: {
    parking: { x1: 220, y1: 262, x2: 280, y2: 280.5 },
    office:  { x1: 225, y1: 198, x2: 277, y2: 260 },             // v13: head office + owners' flats, one building on both old plots
    officePlot: { x1: 220, y1: 196.5, x2: 280, y2: 262 },
    backyard: { x1: 277, y1: 196.5, x2: 292, y2: 226.5 },         // v13: owners' backyard, taken from the west end of the north farm
    solar:   { x1: 280, y1: 226.5, x2: 417.7, y2: 280.5 },
    farms2:  { x1: 292, y1: 196.5, x2: 417.7, y2: 226.5 },
    qstrip:  { x1: 417.7, y1: 196.5, x2: 440, y2: 280.5 },       // farmer residence (existing, v11)
    lawn:    { x1: 220, y1: 165.5, x2: 280, y2: 196.5 },          // v13: the full length of the office building
    farms:   { x1: 280, y1: 165.5, x2: 398, y2: 196.5 },          // v13: south farm back to x 280
    livestock: { x1: 398, y1: 165.5, x2: 430, y2: 196.5 },        // v11: buffalo + goat shed
    farmerPath: { x1: 430.5, y1: 134, x2: 438.5, y2: 197.4 },    // v11: farmer's path to the branch road (through the freed 4th silo spot)
    reserved:{ x1: 220, y1: 134, x2: 330, y2: 165.5 },
    truckPark: { x1: 276, y1: 136.5, x2: 327, y2: 163 },     // v16: 4 bays (2 western bays became the QC lab)
    qcLab:   { x1: 252, y1: 145, x2: 275, y2: 161.5 },       // v16: moved east; old spot = rounded junction corner
    silos:   { x1: 330, y1: 134, x2: 440, y2: 165.5 },
  },
  flour: { zone: { x1: 239, y1: 0, x2: 440, y2: 99 } },
  // product flow polyline (feet) — gate → weighbridge → loop → shed → saila → hall → finished goods → apron → out
  flow: [[207,600],[201,522],[184,512],[180,500],[180,446],[201,436],[201,404],[150,402],[60,402],[52,330],[22,330],
         [22,200],[22,128],[60,128],[70,62],[120,62],[148,60],[148,40],[184,40],[214,40],[214,300],[214,430],[214,600]],
};
