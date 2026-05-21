package com.mobile

import android.content.Context
import androidx.appcompat.widget.AppCompatButton
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

class CustomButton(context: Context) : AppCompatButton(context) {
  var disabled: Boolean = false
    set(value) {
      field = value
      isEnabled = !value
      alpha = if (value) 0.5f else 1.0f
    }

  init {
    setOnClickListener {
      if (disabled) {
        return@setOnClickListener
      }

      (context as? ReactContext)
          ?.getJSModule(RCTEventEmitter::class.java)
          ?.receiveEvent(id, EVENT_ON_PRESS, Arguments.createMap())
    }
  }

  companion object {
    const val EVENT_ON_PRESS = "onPress"
  }
}
