pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "PlateTycoonKotlin"

// Application entry module
include(":app")

// Core multi-layer architecture modules
include(":core:domain")
include(":core:data")
include(":core:designsystem")
include(":core:ui")

// Feature modules
include(":feature:generator")
include(":feature:garage")
include(":feature:cases")
include(":feature:dps")
include(":feature:races")
include(":feature:fortune")
include(":feature:menu")
