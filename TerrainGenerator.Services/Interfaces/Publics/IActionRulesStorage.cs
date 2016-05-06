using System.Collections.Generic;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Interfaces
{
    public interface IActionRulesStorage
    {
        IEnumerable<ActionRule> LoadActionRules();

        void SaveActionRule(IEnumerable<ActionRule> actionRules);
    }
}
