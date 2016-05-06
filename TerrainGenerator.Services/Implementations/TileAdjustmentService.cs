using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services
{
    public class TileAdjustmentService : ITileAdjustmentService
    {
        public void AdjustBorders(ref TileInformation tileInformation, TileInformation northTile, TileInformation southTile, TileInformation westTile, TileInformation eastTile)
        {
            var sideSize = tileInformation.GridSize;

            int index, otherIndex;

            //Last row -130-
            index = sideSize * (sideSize - 1);

            //Set values
            if (southTile != null) {
                for (int i = 0; i < sideSize; i++) {
                    tileInformation.Grid[index + i].a = southTile.Grid[i].a;
                }
                tileInformation.IsSouthAdjusted = true;
            }

            //Intermediate rows 128 + 128
            if (eastTile != null || westTile != null)
            {                
                for (int i = 0; i < sideSize; i++)
                {                    
                    if (eastTile != null)
                    {
                        //Last element in row
                        index = (sideSize * (sideSize - i)) - 1;
                        otherIndex = (sideSize * (sideSize - i)) - sideSize;

                        tileInformation.Grid[index].a = eastTile.Grid[otherIndex].a;
                    }                    

                    if (westTile != null)
                    {
                        //first element in row
                        index = (sideSize * (sideSize - i)) - sideSize;
                        otherIndex = (sideSize * (sideSize - i)) - 1;

                        tileInformation.Grid[index].a = westTile.Grid[otherIndex].a;
                    }
                }

                if (eastTile != null)
                {
                    tileInformation.IsEastAdjusted = true;
                }

                if (westTile != null)
                {
                    tileInformation.IsWestAdjusted = true;
                }                
            }            

            //First row -130-
            index = 0;

            //Set values
            if (northTile != null) {
                otherIndex = sideSize * (sideSize - 1);

                for (int i = 0; i < sideSize; i++) {
                    tileInformation.Grid[index + i].a = northTile.Grid[otherIndex + i].a;
                }
                tileInformation.IsNorthAdjusted = true;
            }
        }
    }
}
