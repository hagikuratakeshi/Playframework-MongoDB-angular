package controllers

import play.api._
import play.api.mvc._
import models.Quote

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready.",
      Quote("Citer les pensees des autres, continuous",
          "Sacha Guitry")))
  }

}