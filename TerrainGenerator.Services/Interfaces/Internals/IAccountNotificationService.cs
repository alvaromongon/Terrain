using System;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Interfaces.Internals
{
    interface IAccountNotificationService
    {
        void SendActivationRequest(Account account, Uri activationUri);
    }
}
