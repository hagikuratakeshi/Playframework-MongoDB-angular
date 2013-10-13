package actor

import akka.actor.UntypedActor
import play.api.Logger
import models.Event
import com.mongodb.casbah.commons.MongoDBObject
import java.util.Date
import org.joda.time.DateTime

class DeleteUnneededEventsActor extends UntypedActor {

  override def onReceive(message: Any) = {
    val twoDaysAgo = new DateTime().minusDays(2)
    val pastEvents = Event.find(MongoDBObject("dateEnd" -> MongoDBObject("$lt" -> twoDaysAgo.toDate())))
    Logger.info("Detected past events from Tokyo Art Beat : " + pastEvents.count)
    val removeResult = Event.remove(MongoDBObject("dateEnd" -> MongoDBObject("$lt" -> twoDaysAgo.toDate())))
    Logger.info("Deleted past events from Tokyo Art Beat : " + pastEvents.count)
  }
}