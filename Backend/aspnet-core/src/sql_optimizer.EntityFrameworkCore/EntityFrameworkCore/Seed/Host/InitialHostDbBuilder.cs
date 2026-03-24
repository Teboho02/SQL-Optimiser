namespace sql_optimizer.EntityFrameworkCore.Seed.Host;

public class InitialHostDbBuilder
{
    private readonly sql_optimizerDbContext _context;

    public InitialHostDbBuilder(sql_optimizerDbContext context)
    {
        _context = context;
    }

    public void Create()
    {
        new DefaultEditionCreator(_context).Create();
        new DefaultLanguagesCreator(_context).Create();
        new HostRoleAndUserCreator(_context).Create();
        new DefaultSettingsCreator(_context).Create();

        _context.SaveChanges();
    }
}
