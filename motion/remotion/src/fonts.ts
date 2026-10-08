import {loadFont as loadLeagueSpartan} from "@remotion/google-fonts/LeagueSpartan";
import {loadFont as loadInter} from "@remotion/google-fonts/Inter";

const league=loadLeagueSpartan("normal",{weights:["700","800"],subsets:["latin"]});
const inter=loadInter("normal",{weights:["400","500","700","800"],subsets:["latin"]});

export const font={display:league.fontFamily,body:inter.fontFamily};

export async function waitForBrandFonts(){await Promise.all([league.waitUntilDone(),inter.waitUntilDone()]);}
