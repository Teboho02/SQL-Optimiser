using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace sql_optimizer.Localization;

public static class sql_optimizerLocalizationConfigurer
{
    public static void Configure(ILocalizationConfiguration localizationConfiguration)
    {
        localizationConfiguration.Sources.Add(
            new DictionaryBasedLocalizationSource(sql_optimizerConsts.LocalizationSourceName,
                new XmlEmbeddedFileLocalizationDictionaryProvider(
                    typeof(sql_optimizerLocalizationConfigurer).GetAssembly(),
                    "sql_optimizer.Localization.SourceFiles"
                )
            )
        );
    }
}
