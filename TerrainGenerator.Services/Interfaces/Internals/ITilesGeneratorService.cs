using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services
{
    interface ITilesGeneratorService
    {
        /// <summary>
        /// Generate a tile data file.
        /// </summary>
        /// <returns>True if the file was generated</returns>
        bool GenerateTileDataFor(TileMetadata tileMetadata);

        /// <summary>
        /// Generate a tile image file.
        /// </summary>
        /// <returns>True if the file was generated</returns>
        bool GenerateTileImageFor(TileMetadata tileMetadata);
    }
}
