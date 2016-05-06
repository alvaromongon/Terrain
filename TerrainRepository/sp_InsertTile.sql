CREATE PROCEDURE [dbo].[sp_InsertTile]
    @NorthLatitude decimal(5,2),
    @WestLongitude decimal(5,2),
    @GridSize int,
    @TileSize decimal(5,2),    
    @ResolutionInMeters float,
    @Json nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [dbo].[Tiles] ([NorthLalitude],[WestLongitude],[GridSize],[TileSize],[ResolutionInMeters],[JsonCellStructArray])
    VALUES (@NorthLatitude,@WestLongitude,@GridSize,@TileSize,@ResolutionInMeters,@Json)
END

GO

