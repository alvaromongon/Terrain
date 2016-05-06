using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.WebApi.Models
{
    public class SystemConfiguration : TileMetadata
    {
        public bool FirstUse { get; set; }
        public Rule[] Rules { get; set; }
        public int MaxMinHeight { get; set; }
        public int MaxAllowedCameraAltitudeOverTerrain { get; set; }
        public int MinAllowedCameraAltitudeOverTerrain { get; set; }
        public decimal ShelfLevel { get; set; }
        public int MaxTerrainAltitudeInMeters { get; set; }        
    }

    public class Rule
    {
        public ActionType InitialActionType { get; set; }
        public MapElementType InitialMapElementType { get; set; }
        public MapElementType FinishMapElementType { get; set; }
        public int ManPowerNeeded { get; set; }
    }
}
