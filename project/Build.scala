
import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName = "event-scala"
  val appVersion = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    jdbc,
    anorm,
    "org.scalaj" % "scalaj-time_2.10.0-M7" % "0.7-SNAPSHOT",
    "org.scalaj" %% "scalaj-http" % "0.3.6",
    "com.novus" %% "salat" % "1.9.2",
    "com.github.julienrf" %% "play-jsmessages" % "1.5.0"
    )

  val main = play.Project(appName, appVersion, appDependencies).settings(
      resolvers += "Scala-Tools Maven2 Snapshots Repository" at "http://scala-tools.org/repo-snapshots",
      resolvers += "OSS sonatype repository" at "http://oss.sonatype.org/content/repositories/snapshots",
      resolvers += "julienrf.github.com" at "http://julienrf.github.com/repo/"
    )
}
