package actor

import akka.actor.UntypedActor

class TestActor extends UntypedActor {

  override def onReceive(message: Any) = {
    // TODO implement
    println("onReceive : " + message) 
  }
}