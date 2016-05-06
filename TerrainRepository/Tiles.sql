CREATE TABLE [dbo].[Tiles]
(
    [NorthLalitude] decimal(5,2) NOT NULL, 
    [WestLongitude] decimal(5,2) NOT NULL, 
    [GridSize] INT NOT NULL,
    [TileSize] decimal(5,2) NOT NULL, 
    [JsonCellStructArray] NVARCHAR(MAX) NOT NULL, 
    [ResolutionInMeters] FLOAT NULL,     
    PRIMARY KEY ([NorthLalitude],[WestLongitude],[GridSize],[TileSize])
);
GO