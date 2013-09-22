package controllers

import play.api.mvc.Controller
import play.api.mvc.Action
import views.html.helper.form
import models.Event
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject

object Events extends Controller {

  def nearBy = Action {
    Ok(views.html.nearby())
  }
  
  def details(id: String) = Action {
    val event = Event.findOne(MongoDBObject("_id" -> id))
    Ok(views.html.event_details(event.get))
  }
}