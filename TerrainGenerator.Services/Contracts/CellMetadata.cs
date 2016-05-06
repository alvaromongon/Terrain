using TerrainGenerator.Services.Contracts.AccountMetadata;

namespace TerrainGenerator.Services.Contracts
{
    public class CellMetadata
    {
        public CellMetadata()
        {
            
        }

        public CellMetadata(CellMetadata cellMetadata)
        {
            this.North = cellMetadata.North;
            this.West = cellMetadata.West;
            this.Index = cellMetadata.Index;
            this.InitialMapElementType = cellMetadata.InitialMapElementType;
            this.FinishMapElementType = cellMetadata.FinishMapElementType;
        }

        public decimal North { get; set; }
        public decimal West { get; set; }
        public int Index { get; set; }
        public MapElementType InitialMapElementType { get; set; }
        public MapElementType FinishMapElementType { get; set; }
    }
}
