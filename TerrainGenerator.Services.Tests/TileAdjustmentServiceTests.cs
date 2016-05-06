using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Tests
{
    [TestClass]
    public class TileAdjustmentServiceTests
    {
        private readonly ITileAdjustmentService _service = new TileAdjustmentService();
        private const int GridSize = 100;

        [TestMethod]
        public void AdjustBorders_SetNorthTileBorderValuesToExternalArrayValue()
        {
            var tileInformation = new TileInformation()
            {
                Grid = GenerateRandomGrid(GridSize),
                GridSize = GridSize,
            };
            var north = new TileInformation
            {
                Grid = GenerateRandomGrid(GridSize)
            };

            //last row index
            var index = GridSize * (GridSize - 1);

            for (int i = 0; i < GridSize; i++)
            {
                Assert.AreNotEqual(north.Grid[index + i].a, tileInformation.Grid[i].a);
            }

            _service.AdjustBorders(ref tileInformation, north, null, null, null);

            for (int i = 0; i < GridSize; i++)
            {
                Assert.AreEqual(north.Grid[index + i].a, tileInformation.Grid[i].a);
            }
            Assert.IsTrue(tileInformation.IsNorthAdjusted);
        }

        [TestMethod]
        public void AdjustBorders_SetSouthTileBorderValuesToExternalArrayValue()
        {
            var tileInformation = new TileInformation()
            {
                Grid = GenerateRandomGrid(GridSize),
                GridSize = GridSize,
            };
            var south = new TileInformation {Grid = GenerateRandomGrid(GridSize)};

            //last row index
            var index = GridSize * (GridSize - 1);

            for (int i = 0; i < GridSize; i++)
            {
                Assert.AreNotEqual(south.Grid[i].a, tileInformation.Grid[index + i].a);
            }

            _service.AdjustBorders(ref tileInformation, null, south, null, null);

            for (int i = 0; i < GridSize; i++)
            {
                Assert.AreEqual(south.Grid[i].a, tileInformation.Grid[index + i].a);
            }
            Assert.IsTrue(tileInformation.IsSouthAdjusted);
        }

        [TestMethod]
        public void AdjustBorders_SetWestTileBorderValuesToExternalArrayValue()
        {
            var tileInformation = new TileInformation()
            {
                Grid = GenerateRandomGrid(GridSize),
                GridSize = GridSize,
            };
            var west = new TileInformation {Grid = GenerateRandomGrid(GridSize)};

            for (int i = 0; i < GridSize; i++)
            {
                var index = (GridSize * (GridSize - i)) - GridSize;
                var otherIndex = (GridSize * (GridSize - i)) - 1;

                Assert.AreNotEqual(west.Grid[otherIndex].a, tileInformation.Grid[index].a);
            }

            _service.AdjustBorders(ref tileInformation, null, null, west, null);

            for (int i = 0; i < GridSize; i++)
            {
                var index = (GridSize * (GridSize - i)) - GridSize;
                var otherIndex = (GridSize * (GridSize - i)) - 1;

                Assert.AreEqual(west.Grid[otherIndex].a, tileInformation.Grid[index].a);
            }
            Assert.IsTrue(tileInformation.IsWestAdjusted);
        }

        [TestMethod]
        public void AdjustBorders_SetEastTileBorderValuesToExternalArrayValue()
        {
            var tileInformation = new TileInformation()
            {
                Grid = GenerateRandomGrid(GridSize),
                GridSize = GridSize,
            };
            var east = new TileInformation {Grid = GenerateRandomGrid(GridSize)};

            for (int i = 0; i < GridSize; i++)
            {
                var index = (GridSize * (GridSize - i)) - 1;
                var otherIndex = (GridSize * (GridSize - i)) - GridSize;

                Assert.AreNotEqual(east.Grid[otherIndex].a, tileInformation.Grid[index].a);
            }

            _service.AdjustBorders(ref tileInformation, null, null, null, east);

            for (int i = 0; i < GridSize; i++)
            {
                var index = (GridSize * (GridSize - i)) - 1;
                var otherIndex = (GridSize * (GridSize - i)) - GridSize;

                Assert.AreEqual(east.Grid[otherIndex].a, tileInformation.Grid[index].a);
            }
            Assert.IsTrue(tileInformation.IsEastAdjusted);
        }

        private CellStruct[] GenerateRandomGrid(int sideSize)
        {
            var grid = new CellStruct[sideSize * sideSize];
            var random = new Random(DateTime.Now.Millisecond);

            for (var i = 0; i < grid.Length; i++ )
            {
                grid[i] = new CellStruct {a = (float) random.NextDouble()};
            }

            return grid;
        }
    }
}
