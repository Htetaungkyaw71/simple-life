// Existing farm indices remain stable; additional beds have their own saved records.
export const plotAt=(s,index)=>index<s.plots.length?s.plots[index]:s.customBeds?.[index-s.plots.length]?.plot;
export const allPlots=s=>[...s.plots,...(s.customBeds||[]).map(b=>b.plot)];
export function replacePlot(s,index,plot){if(index<s.plots.length)s.plots[index]=plot;else if(s.customBeds?.[index-s.plots.length])s.customBeds[index-s.plots.length].plot=plot;}
