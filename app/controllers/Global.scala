import play.api._
import play.api.Play.current
import play.api.libs.concurrent.Akka
import akka.actor.Props
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import actor.TokyoArtBeatRequestActor
import actor.DeleteUnneededEventsActor

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    Logger.info("Application has started")

    val tokyoArtBeatActor = 
      Akka.system.actorOf(Props[TokyoArtBeatRequestActor], name = "tokyoArtBeatActor")
    Akka.system.scheduler.schedule(10 seconds, 1 day, tokyoArtBeatActor, "tick")

    val deletePastEventsTokyoArtBeatActor = 
      Akka.system.actorOf(Props[DeleteUnneededEventsActor], name = "deletePastEventsTokyoArtBeatActor")
    Akka.system.scheduler.schedule(5 seconds, 1 day, deletePastEventsTokyoArtBeatActor, "tick")
  }

  override def onStop(app: Application) {
    Logger.info("Application shutdown...")
  }

}