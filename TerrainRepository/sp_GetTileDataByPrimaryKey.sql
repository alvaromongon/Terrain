CREATE PROCEDURE [dbo].[sp_GetTileDataByPrimaryKey]
    @NorthLatitude decimal(5,2),
    @WestLongitude decimal(5,2),
    @GridSize int,
    @TileSize decimal(5,2)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT [JsonCellStructArray] FROM [dbo].[Tiles] WHERE [NorthLalitude] = @NorthLatitude AND [WestLongitude] = @WestLongitude AND [GridSize] = @GridSize AND [TileSize] = @TileSize
END

GO
