using System;
using System.Linq;
using System.Web.Script.Serialization;

namespace TerrainGenerator.Services.Contracts
{
    [Serializable]
    public class TileInformation
    {
        public CellStruct[] Grid { get; set; }
        public int GridSize { get; set; }
        public double ResolutionInMeters { get; set; }
        public bool IsNorthAdjusted { get; set; }
        public bool IsWestAdjusted { get; set; }
        public bool IsSouthAdjusted { get; set; }
        public bool IsEastAdjusted { get; set; }        

        [ScriptIgnore]
        public bool IsfinishedAdjustement
        {
            get { return IsNorthAdjusted & IsWestAdjusted & IsSouthAdjusted & IsEastAdjusted; }
        }

        public bool IsBetterThan(TileInformation otherTileInformation)
        {
            var completionStatus = (new[] {this.IsNorthAdjusted, this.IsWestAdjusted, this.IsSouthAdjusted, this.IsEastAdjusted}).Count(item => item);
            var otherCompletionStatus = (new[] { otherTileInformation.IsNorthAdjusted, otherTileInformation.IsWestAdjusted, otherTileInformation.IsSouthAdjusted, otherTileInformation.IsEastAdjusted }).Count(item => item);

            return completionStatus > otherCompletionStatus;
        }

    }
}
