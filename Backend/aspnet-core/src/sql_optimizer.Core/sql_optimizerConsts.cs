using sql_optimizer.Debugging;

namespace sql_optimizer;

public class sql_optimizerConsts
{
    public const string LocalizationSourceName = "sql_optimizer";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "11e54bd12162456ba17fe2ec29bf469e";
}
