using TerrainGenerator.Services.Contracts;
using Action = TerrainGenerator.Services.Contracts.Action;

namespace TerrainGenerator.Services.Interfaces
{
    public interface IActionRulesService
    {
        ActionRule GetApplicableRule(Action action);
    }
}
