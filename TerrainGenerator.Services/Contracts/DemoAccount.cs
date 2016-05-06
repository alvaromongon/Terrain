namespace TerrainGenerator.Services.Contracts
{
    public class DemoAccount : Account
    {
        public DemoAccount(string name) : base(name, name)
        {
            this.Active = true;
        }

        public override bool IsDemoAccount()
        {
            return true;
        }
    }
}
