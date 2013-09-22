package controllers

import play.api.GlobalSettings
import play.Logger

class Global extends GlobalSettings {

  @Override
  def onStart(app: play.Application) = {
    println("Application has started")
    Logger.info("Application has started");
  }  
  
  @Override
  def onStop(app: play.Application) = {
    println("Application shutdown...");
    Logger.info("Application shutdown...");
  }  
}