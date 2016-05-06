using System;

namespace TerrainGenerator.Services.Contracts
{
    public class TimedAction : Action
    {
        public TimedAction()
        {
            
        }

        public TimedAction(DateTime initialTime, Action action) : base(action)
        {
            this.InitialTime = initialTime.ToUniversalTime();
        }

        public DateTime InitialTime { get; set; }
    }
}
