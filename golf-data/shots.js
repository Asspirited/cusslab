const SHOTS = {
  tee:[
    {id:"s",label:"Lay Up — Iron Off Tee",  desc:"Keep it in play. Zero drama.",          risk:1,thresh:2,cls:"r1"},
    {id:"n",label:"Driver — Standard Line", desc:"Sensible line, full commitment.",        risk:2,thresh:3,cls:"r2"},
    {id:"a",label:"Driver — Cut the Corner",desc:"Carry the hazard, shorten the hole.",   risk:3,thresh:4,cls:"r3"},
    {id:"l",label:"Full Throttle — Hero",   desc:"Maximum. The commentators lean forward.",risk:4,thresh:6,cls:"r4"},
  ],
  approach:[
    {id:"s",label:"Chip Out Safely",        desc:"Take your medicine.",                    risk:1,thresh:2,cls:"r1"},
    {id:"n",label:"Standard Approach",      desc:"Middle of green, two putts.",            risk:2,thresh:3,cls:"r2"},
    {id:"a",label:"Attack the Flag",        desc:"Go for the pin.",                        risk:3,thresh:4,cls:"r3"},
    {id:"l",label:"The Impossible Shot",    desc:"Between the trees, over the burn.",      risk:4,thresh:6,cls:"r4"},
  ],
  par3:[
    {id:"s",label:"Front Edge — Safe",      desc:"Green, two putts, move on.",             risk:1,thresh:2,cls:"r1"},
    {id:"n",label:"Middle of Green",        desc:"Safe target, flag is a bonus.",          risk:2,thresh:3,cls:"r2"},
    {id:"a",label:"Straight at the Pin",    desc:"Tucked flag. Going for it.",             risk:3,thresh:4,cls:"r3"},
    {id:"l",label:"Hole-in-One Line",       desc:"Shape it in. Legend territory.",         risk:4,thresh:6,cls:"r4"},
  ],
  putt:[
    {id:"s",label:"Lag it Close",           desc:"Two putts, walk away.",                  risk:1,thresh:1,cls:"r1"},
    {id:"n",label:"Normal Stroke",          desc:"Commit and hit it.",                     risk:2,thresh:3,cls:"r2"},
    {id:"a",label:"Charge at the Hole",     desc:"Make or miss, no halfway.",              risk:3,thresh:4,cls:"r3"},
    {id:"l",label:"'I Cannot Miss This'",   desc:"Commentators have gone quiet.",          risk:4,thresh:5,cls:"r4"},
  ]
};

// DFACES — 3×3 grid, 9 cells per face. Positions: TL TC TR / ML MC MR / BL BC BR
// Dots (●) marked per standard d6 layout. Empty cells use <span>.
const _ = '<span></span>', D = '<div class="d"></div>';
const DFACES = {
  1:`<div class="df">${_}${_}${_}${_}${D}${_}${_}${_}${_}</div>`,
  2:`<div class="df">${_}${_}${D}${_}${_}${_}${D}${_}${_}</div>`,
  3:`<div class="df">${_}${_}${D}${_}${D}${_}${D}${_}${_}</div>`,
  4:`<div class="df">${D}${_}${D}${_}${_}${_}${D}${_}${D}</div>`,
  5:`<div class="df">${D}${_}${D}${_}${D}${_}${D}${_}${D}</div>`,
  6:`<div class="df">${D}${_}${D}${D}${_}${D}${D}${_}${D}</div>`,
};

if (typeof module !== 'undefined') module.exports = { SHOTS, DFACES };
