using System.Linq;
using System.Runtime.InteropServices;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ComplexTerrain.Tests
{
    [TestClass]
    public class SurrounderAltitudesTests
    {
        [DllImport("ComplexTerrain.dll", EntryPoint = "GetSurroundersAltitudes", CallingConvention = CallingConvention.Cdecl)]
        extern static void GetSurroundersAltitudes(float[] elevationPreviousLine, float[] elevationCurrentLine, float[] elevationNextLine, int columnCounter, int columnNumber, out double[] altitudes);

        [TestMethod]
        public void GetSurroundersAltitudes_Tests()
        {
            var altitudes = new double[6];

            GetSurroundersAltitudes(Grid, Grid, Grid, 0, Grid.Count(), out altitudes);

            Assert.IsTrue(altitudes.Count() > 0);
        }

        private static readonly float[] Grid = { 0.216705f, 0.234455f, 0.236646f, 0.228681f, 0.232314f, 0.227241f, 0.235681f, 
                                                   0.248101f, 0.249869f, 0.242888f, 0.252282f, 0.26727f, 0.275952f, 0.282989f, 
                                                   0.281309f, 0.281333f, 0.28148f, 0.279152f, 0.282847f, 0.281707f, 0.288611f, 
                                                   0.27292f, 0.274141f, 0.269374f, 0.266971f, 0.265783f, 0.273372f, 0.279627f, 
                                                   0.278075f, 0.271807f, 0.247997f, 0.255803f, 0.253913f, 0.269429f, 0.25436f, 
                                                   0.31718f, 0.318109f, 0.367172f, 0.38159f, 0.390189f, 0.39489f, 0.40779f, 
                                                   0.410817f, 0.401766f, 0.391708f, 0.392966f, 0.389767f, 0.396852f, 0.39796f };
    }
}
