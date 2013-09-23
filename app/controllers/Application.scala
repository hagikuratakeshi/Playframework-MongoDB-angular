package controllers

import play.api._
import play.api.mvc._
import play.api.Play.current
import models.Quote
import jsmessages.api.JsMessages

object Application extends Controller {

  val messages = new JsMessages
  
  def index = Action {
    Ok(views.html.index("Your new application is ready.",
      Quote("Citer les pensees des autres, continuous",
        "Sacha Guitry")))
  }

  val jsMessages = Action { implicit request =>
    Ok(messages(Some("window.Messages"))).as(JAVASCRIPT)
  }
}