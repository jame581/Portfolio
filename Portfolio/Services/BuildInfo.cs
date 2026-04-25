using System.Reflection;

namespace Portfolio.Services;

public static class BuildInfo
{
    public static string GitSha { get; } = ReadMetadata("GitSha", "dev");
    public static string BuildDate { get; } = ReadMetadata("BuildDate", "local");
    public static string Stamp { get; } = $"{BuildDate}-{GitSha}";

    private static string ReadMetadata(string key, string fallback)
    {
        var attr = typeof(BuildInfo).Assembly
            .GetCustomAttributes<AssemblyMetadataAttribute>()
            .FirstOrDefault(a => a.Key == key);
        return string.IsNullOrEmpty(attr?.Value) ? fallback : attr.Value!;
    }
}
