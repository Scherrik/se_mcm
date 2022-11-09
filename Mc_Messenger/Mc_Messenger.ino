#include <Arduino.h>
#include "src/connectionhandler.hpp"

void setup() {
	ConnectionHandler::instance()->init();
}

void loop() {
}
