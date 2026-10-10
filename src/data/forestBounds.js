// Shared by world placement, edge travel and the return gate.
export const FOREST_SIZE={width:10240,height:5120};
export const FOREST_ENTRANCE={x:FOREST_SIZE.width/2,y:FOREST_SIZE.height-272};
export const FOREST_EXIT=[FOREST_ENTRANCE.x-48,FOREST_SIZE.height-32,96,32];
// Placement masks reserve a natural grassy approach and join the eastern crossway.
export const FOREST_APPROACHES=[[FOREST_ENTRANCE.x-104,4704,208,416],[FOREST_ENTRANCE.x-104,4704,620,112]];
