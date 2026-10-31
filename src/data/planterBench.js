// Shared City planter bench. Full user-supplied source and preceding art remain preserved.
export const PLANTER_BENCH={
 frame:'planter-bench-2026-10-29',texture:'planterBench',nativeSize:[177,132],scale:.9,
 // The native Pixel Snapper canvas has wider transparent margins than the
 // preceding source. This render-only offset preserves the visible centre and
 // ground contact without resampling the supplied pixels or moving collision.
 artOffset:[-17,-12],depthOffset:96,
 // Match the complete visible planter/seat body so neither the player nor
 // resident routes can pass through its sides, flowers, or seat backs.
 position:{x:433,y:516},footprint:[5,-5,122,102]
};
