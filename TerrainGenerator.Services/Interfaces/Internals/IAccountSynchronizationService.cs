using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Interfaces.Internals
{
    interface IAccountSynchronizationService
    {
        void SynchronizeAll();

        void Synchronize(Account account);

        void SynchronizeNewActions(Account account);
    }
}
