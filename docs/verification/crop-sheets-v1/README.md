# Imported crop-sheet browser verification

Each `*-all-stages-dry-watered.png` is the live Phaser farm. Columns read left-to-right across two rows as seed, sprout, young, flowering, ripe, dry, wilted and dead; the same eight stages repeat on watered soil in the lower two rows. The live water/basket/warning signs, crop info panel and `E / Water` prompt are included. Each `*-harvest-flight.png` captures the real harvest animation and fly-to-player produce icon.

`results.json` records the assertions. The script uses disposable localStorage browser contexts and makes no remote runtime requests.
